const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const Order = require("../Model/order");
const User = require("../Model/UserSchema");
const { authenticate } = require("../middleware/auth.middleware");

router.get("/invoice/:orderId", authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("items.productId");

    const user = await User.findById(req.user.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Create PDF with exact 3-inch width (216 points)
    const doc = new PDFDocument({
      size: [216, 792], // 3 inches wide, 11 inches tall (standard receipt height)
      margin: 8,
      layout: 'portrait'
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    // Helper function for exact positioning
    const col1 = 12;  // Item name start
    const col2 = 115; // Qty position
    const col3 = 140; // Price position
    const col4 = 175; // Total position
    const maxWidth = 200; // Maximum content width

    /* HEADER SECTION - FIXED HEIGHT */
    doc
      .rect(0, 0, 216, 50)
      .fill("#1a1a1a");

    doc
      .fillColor("#ffffff")
      .fontSize(14)
      .font('Helvetica-Bold')
      .text("TOLVV SIGNS", 8, 15, {
        align: 'center',
        width: 200
      });

    doc
      .fontSize(7)
      .font('Helvetica')
      .fillColor("#dddddd")
      .text("Premium Skincare", 8, 32, {
        align: 'center',
        width: 200
      });

    /* INVOICE DETAILS */
    doc.fillColor("#333333");
    
    // Invoice ID and Date
    doc
      .fontSize(6)
      .font('Helvetica')
      .text(`Invoice: #${order._id.toString().substring(0, 8)}`, 8, 60);
    
    doc
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 8, 68);

    // Order Status
    const statusColors = {
      'pending': '#f39c12',
      'processing': '#3498db',
      'delivered': '#27ae60',
      'cancelled': '#e74c3c'
    };
    
    doc
      .fillColor(statusColors[order.status] || '#95a5a6')
      .fontSize(7)
      .font('Helvetica-Bold')
      .text(order.status.toUpperCase(), 155, 62, {
        width: 50,
        align: 'right'
      });

    doc.fillColor("#333333");
    
    // Separator line
    doc
      .moveTo(8, 80)
      .lineTo(208, 80)
      .lineWidth(0.5)
      .strokeColor("#cccccc")
      .stroke();

    /* CUSTOMER SECTION */
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .text("CUSTOMER", 8, 88);
    
    doc
      .fontSize(7)
      .font('Helvetica')
      .text(`${user.fname} ${user.lname || ""}`, 8, 100)
      .text(`${user.email}`, 8, 110)
      .text(`📱 ${user.mobile || "N/A"}`, 8, 120);

    // Separator
    doc
      .moveTo(8, 132)
      .lineTo(208, 132)
      .lineWidth(0.5)
      .strokeColor("#cccccc")
      .stroke();

    /* SHIPPING ADDRESS */
    if (order.address) {
      let addressY = 140;
      
      doc
        .fontSize(8)
        .font('Helvetica-Bold')
        .text("DELIVERY ADDRESS", 8, addressY);
      
      addressY += 12;
      
      const addressLines = [
        order.address.houseNumber,
        order.address.buildingName,
        order.address.road,
        `${order.address.city || ""} - ${order.address.pincode || ""}`,
        `📱 ${order.address.mobile || ""}`
      ].filter(Boolean);

      doc
        .fontSize(6.5)
        .font('Helvetica')
        .text(addressLines.join('\n'), 8, addressY, {
          lineGap: 2
        });

      addressY += (addressLines.length * 9) + 5;
      
      // Separator
      doc
        .moveTo(8, addressY)
        .lineTo(208, addressY)
        .lineWidth(0.5)
        .strokeColor("#cccccc")
        .stroke();
      
      doc.y = addressY + 5;
    } else {
      doc.y = 145;
    }

    /* ORDER ITEMS TABLE */
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .text("ITEMS", 8, doc.y);

    // Table Header
    const headerY = doc.y + 10;
    doc
      .rect(8, headerY - 2, 200, 12)
      .fill("#f5f5f5");

    doc
      .fillColor("#333333")
      .fontSize(6)
      .font('Helvetica-Bold')
      .text("Item", col1, headerY)
      .text("Qty", col2, headerY)
      .text("Price", col3, headerY)
      .text("Total", col4, headerY);

    let itemY = headerY + 12;
    let subtotal = 0;

    order.items.forEach((item) => {
      const name = item.productId?.ProductName || "Product";
      const price = item.productId?.ProductPrice || 0;
      const qty = item.quantity;
      const total = price * qty;
      subtotal += total;

      // Truncate name if too long
      const shortName = name.length > 18 ? name.substring(0, 16) + '..' : name;

      doc
        .fillColor("#333333")
        .fontSize(6)
        .font('Helvetica')
        .text(shortName, col1, itemY, { width: 95 })
        .text(qty.toString(), col2, itemY)
        .text(`₹${price}`, col3, itemY)
        .text(`₹${total}`, col4, itemY);

      itemY += 12;
    });

    doc.y = itemY;

    // Subtotal line
    doc
      .moveTo(8, doc.y)
      .lineTo(208, doc.y)
      .lineWidth(0.5)
      .strokeColor("#cccccc")
      .stroke();

    doc.y += 5;

    /* BILL SUMMARY */
    const summaryY = doc.y;
    
    doc
      .fontSize(7)
      .font('Helvetica')
      .text("Subtotal:", 120, summaryY)
      .text(`₹${subtotal}`, 175, summaryY);

    // Calculate other charges
    const deliveryFee = 40;
    const tax = order.totalAmount - subtotal - deliveryFee;
    
    doc
      .text("Delivery:", 120, summaryY + 10)
      .text(`₹${deliveryFee}`, 175, summaryY + 10);
    
    if (tax > 0) {
      doc
        .text("Tax:", 120, summaryY + 20)
        .text(`₹${tax}`, 175, summaryY + 20);
    }

    // Separator
    const totalBeforeY = summaryY + (tax > 0 ? 30 : 20);
    doc
      .moveTo(115, totalBeforeY)
      .lineTo(208, totalBeforeY)
      .lineWidth(0.5)
      .strokeColor("#cccccc")
      .stroke();

    /* TOTAL AMOUNT */
    const totalY = totalBeforeY + 5;
    
    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .text("TOTAL:", 120, totalY)
      .text(`₹${order.totalAmount}`, 175, totalY);

    doc.y = totalY + 15;

    /* PAYMENT INFO */
    doc
      .fontSize(6)
      .font('Helvetica')
      .fillColor("#666666")
      .text(`Payment: ${order.paymentMethod || 'Online'}`, 8, doc.y)
      .text(`Txn ID: ${order.paymentId?.substring(0, 10) || 'N/A'}`, 8, doc.y + 8);

    doc.y += 20;

    /* FOOTER - Always at bottom */
    doc
      .fontSize(5)
      .font('Helvetica-Oblique')
      .fillColor("#999999")
      .text("Thank you for shopping with us!", 8, doc.y, {
        align: 'center',
        width: 200
      });

    doc
      .fontSize(4)
      .text("For returns: www.tolvvsignts.com/returns", 8, doc.y + 8, {
        align: 'center',
        width: 200
      });

    doc
      .text(`Generated: ${new Date().toLocaleString('en-IN')}`, 8, doc.y + 14, {
        align: 'center',
        width: 200
      });

    doc.end();

  } catch (error) {
    console.error("Invoice error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;