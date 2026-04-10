const ShipRocketService = require("./shiprocket.service");
const ADVANCE_AMOUNT = 200;

// Format phone number
function formatPhoneNumber(phone) {
  if (!phone) return "9999999999";
  let cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('91')) cleaned = cleaned.substring(2);
  if (cleaned.length === 11 && cleaned.startsWith('0')) cleaned = cleaned.substring(1);
  if (cleaned.length === 10) return cleaned;
  if (cleaned.length > 10) return cleaned.slice(-10);
  return cleaned.padStart(10, '0');
}

// Main function to create ShipRocket shipment
async function createShipRocketShipment(order) {
  try {
    console.log("🚀 Starting ShipRocket shipment creation for:", order.customOrderId);
    
    const shiprocket = ShipRocketService.getInstance();
    const formattedPhone = formatPhoneNumber(order.address.mobile);

    // Build full address from available fields
    const addressParts = [
      order.address.houseNumber,
      order.address.buildingName,
      order.address.societyName,
      order.address.road
    ].filter(Boolean);

    const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : order.address.street || "Address not provided";

    // Prepare order items for ShipRocket
    const orderItems = order.items.map(item => ({
      name: item.productName.substring(0, 100),
      sku: item.productId?.toString() || item.hamperId?.toString() || "CUSTOM",
      units: item.quantity,
      selling_price: Math.round(item.priceAtBuy),
      discount: 0,
      tax: 0,
      hsn: 0
    }));

    // Calculate amounts based on payment method
    let codAmount = 0;
    let subtotalForShiprocket = 0;
    let paymentMethodForShiprocket = "";

    if (order.paymentMethod === "cod_hybrid") {
      codAmount = order.partialPayment?.remainingToPay || (order.totalAmount - ADVANCE_AMOUNT);
      subtotalForShiprocket = codAmount;
      paymentMethodForShiprocket = "COD";
    } else if (order.paymentMethod === "cod") {
      codAmount = order.totalAmount;
      subtotalForShiprocket = order.totalAmount;
      paymentMethodForShiprocket = "COD";
    } else {
      // PREPAID ORDERS (UPI, Card, etc.)
      codAmount = 0;
      subtotalForShiprocket = order.totalAmount;
      paymentMethodForShiprocket = "Prepaid";
    }

    // ✅ REMOVED channel_id - not needed for adhoc endpoint
    const shiprocketOrderData = {
      order_id: order.customOrderId,
      order_date: new Date(order.createdAt || Date.now()).toISOString().split('T')[0],
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "home",
      
      billing_customer_name: order.customerName || "Customer",
      billing_last_name: "",
      billing_address: fullAddress,
      billing_address_2: order.address.landmark || "",
      billing_city: order.address.city || "Ahmedabad",
      billing_pincode: order.address.pincode || "380015",
      billing_state: order.address.state || "Gujarat",
      billing_country: "India",
      billing_email: order.customerEmail,
      billing_phone: formattedPhone,
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: paymentMethodForShiprocket,
      ...(codAmount > 0 && { cod_amount: codAmount }),
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: order.discount || 0,
      sub_total: Math.round(subtotalForShiprocket),
      length: 10,
      breadth: 10,
      height: 10,
      weight: order.totalWeight || 1.0
    };

    console.log("📦 ShipRocket Request:", JSON.stringify({
      order_id: shiprocketOrderData.order_id,
      payment_method: shiprocketOrderData.payment_method,
      sub_total: shiprocketOrderData.sub_total,
      cod_amount: shiprocketOrderData.cod_amount
    }, null, 2));
    
    const response = await shiprocket.createOrder(shiprocketOrderData);

    if (response && response.status === 200) {
      order.shiprocketOrderId = response.data.order_id;
      order.shiprocketShipmentId = response.data.shipment_id;
      order.orderStatus = "Processing for Shipping";
      await order.save();
      console.log(`✅ ShipRocket order created successfully for ${order.customOrderId}`);
      return true;
    }

    throw new Error("ShipRocket order creation failed");
  } catch (error) {
    console.error(`❌ Failed to create ShipRocket shipment:`, error.response?.data || error.message);
    return false;
  }
}

module.exports = { createShipRocketShipment };