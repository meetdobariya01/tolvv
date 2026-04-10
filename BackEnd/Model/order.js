
  // // const mongoose = require("mongoose");

  // // const orderSchema = new mongoose.Schema({
  // //   customOrderId: { type: String, required: true, unique: true },
  // //   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // //   customerName: { type: String, required: true },  // ✅ Store name
  // //   customerEmail: { type: String, required: true }, // ✅ Store email
  // //   subscribe: { type: Boolean, default: false },
  // //   items: [
  // //     {
  // //       productId: {
  // //         type: mongoose.Schema.Types.ObjectId,
  // //         ref: "Product"
  // //       },

  // //       hamperId: {
  // //         type: mongoose.Schema.Types.ObjectId,
  // //         ref: "Hamper"
  // //       },

  // //       productName: { type: String, required: true },
  // //       quantity: { type: Number, required: true },
  // //       priceAtBuy: { type: Number, required: true },

  // //       // ✅ ADD THIS
  // //       hamperItems: [
  // //         {
  // //           productId: {
  // //             type: mongoose.Schema.Types.ObjectId,
  // //             required: false,
  // //             default: null
  // //           },
  // //           name: String,
  // //           quantity: Number,
  // //           isFree: Boolean
  // //         }
  // //       ]
  // //     }
  // //   ],

  // //   subtotal: { type: Number },
  // //   cgst: { type: Number },
  // //   sgst: { type: Number },
  // //   totalAmount: { type: Number, required: true },
  // //   emailSent: { type: Boolean, default: false },

  // //   paymentMethod: { type: String, default: "upi" }, // upi, card, cod
  // //   status: { type: String, default: "Pending" },    // Pending, CHARGED, FAILED

  // //   hdfcResponse: { type: Object },

  // //   address: {
  // //     houseNumber: String,
  // //     buildingName: String,
  // //     societyName: String,
  // //     road: String,
  // //     landmark: String,
  // //     city: String,
  // //     pincode: String,
  // //     mobile: String
  // //   },
  // //   discount: { type: Number, default: 0 },
  // //   couponCode: { type: String },
  // //   note: { type: String, default: "" }


  // // }, { timestamps: true });

  // // module.exports = mongoose.model("Order", orderSchema);
  // const mongoose = require("mongoose");

  // const orderSchema = new mongoose.Schema({
  //   customOrderId: { type: String, required: true, unique: true },
  //   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  //   customerName: { type: String, required: true },  // ✅ Store name
  //   customerEmail: { type: String, required: true }, // ✅ Store email
  //   subscribe: { type: Boolean, default: false },
  //   items: [
  //     {
  //       productId: {
  //         type: mongoose.Schema.Types.ObjectId,
  //         ref: "Product"
  //       },

  //       hamperId: {
  //         type: mongoose.Schema.Types.ObjectId,
  //         ref: "Hamper"
  //       },

  //       productName: { type: String, required: true },
  //       quantity: { type: Number, required: true },
  //       priceAtBuy: { type: Number, required: true },

  //       // ✅ ADD THIS
  //       hamperItems: [
  //         {
  //           productId: {
  //             type: mongoose.Schema.Types.ObjectId,
  //             required: false,
  //             default: null
  //           },
  //           name: String,
  //           quantity: Number,
  //           isFree: Boolean
  //         }
  //       ]
  //     }
  //   ],

  //   subtotal: { type: Number },
  //   cgst: { type: Number },
  //   sgst: { type: Number },
  //   totalAmount: { type: Number, required: true },
  //   emailSent: { type: Boolean, default: false },

  //   paymentMethod: { type: String, default: "upi" }, // upi, card, cod
  //   status: { type: String, default: "Pending" },    // Pending, PAID, PAYMENT_FAILED, AMOUNT_MISMATCH
  //   orderStatus: { type: String, default: "Pending" }, // Pending, Confirmed, Processing for Shipping, Shipped, In Transit, Out for Delivery, Delivered, Returned to Origin, Cancelled
  //   paymentId: { type: String }, // Transaction ID from payment gateway
  //   paidAt: { type: Date },

  //   hdfcResponse: { type: Object },

  //   address: {
  //     houseNumber: String,
  //     buildingName: String,
  //     societyName: String,
  //     road: String,
  //     landmark: String,
  //     city: String,
  //     pincode: String,
  //     mobile: String,
  //     name: String, // Add this if not already present
  //     street: String, // Add this for ShipRocket
  //     state: String // Add this for ShipRocket
  //   },
  //   discount: { type: Number, default: 0 },
  //   couponCode: { type: String },
  //   note: { type: String, default: "" },

  //   // ================= SHIPROCKET FIELDS =================
  //   shiprocketOrderId: {
  //     type: String,
  //     sparse: true
  //   },
  //   shiprocketShipmentId: {
  //     type: String,
  //     sparse: true
  //   },
  //   shiprocketLabelUrl: {
  //     type: String
  //   },
  //   shiprocketStatus: {
  //     type: String
  //   },
  //   awbCode: {
  //     type: String
  //   },
  //   trackingStatus: {
  //     type: String
  //   },
  //   trackingData: {
  //     type: Object
  //   },
  //   lastTrackingUpdate: {
  //     type: Date
  //   },
  //   deliveredAt: {
  //     type: Date
  //   },
  //   totalWeight: {
  //     type: Number,
  //     default: 0.8
  //   },
  //   shippingCost: {
  //     type: Number,
  //     default: 0
  //   },
    

  // }, { timestamps: true });

  // module.exports = mongoose.model("Order", orderSchema);


  const mongoose = require("mongoose");

  const orderSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        hamperId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Hamper",
        },
        productName: String,
        quantity: Number,
        priceAtBuy: Number,
        isFree: Boolean,
        hamperItems: [
          {
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
            },
            name: String,
            quantity: Number,
            isFree: Boolean,
          },
        ],
      },
    ],
    subtotal: Number,
    discount: Number,
    shippingCost: Number,
    codCharge: {
      type: Number,
      default: 0,
    },
    totalAmount: Number,
    couponCode: String,
    paymentMethod: {
      type: String,
      enum: ["upi", "card", "cod", "cod_hybrid"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "PAYMENT_PENDING",
        "PARTIALLY_PAID_COD", // New status for hybrid COD
        "COD_CONFIRMED",
        "PAID",
        "FAILED",
        "CANCELLED",
        "AMOUNT_MISMATCH",
        "COD_PAYMENT_FAILED",
      ],
      default: "PAYMENT_PENDING",
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing for Shipping",
        "Shipped",
        "In Transit",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "Returned to Origin",
        "Awaiting COD Confirmation",
        "Partial Payment Received",
      ],
      default: "Pending",
    },
    partialPayment: {
      paidOnline: {
        type: Number,
        default: 0,
      },
      remainingToPay: {
        type: Number,
        default: 0,
      },
      paymentMode: {
        type: String,
        enum: ["COD_HYBRID", null],
        default: null,
      },
      transactionId: String,
      paidAt: Date,
    },
    address: {
      name: String,
      houseNumber: String,
      buildingName: String,
      societyName: String,
      road: String,
      landmark: String,
      city: String,
      state: String,
      pincode: String,
      mobile: String,
      street: String,
    },
    paymentId: String,
    paidAt: Date,
    deliveredAt: Date,
    note: String,
    subscribe: {
      type: Boolean,
      default: false,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    shiprocketOrderId: String,
    shiprocketShipmentId: String,
    shiprocketLabelUrl: String,
    awbCode: String,
    shiprocketStatus: String,
    trackingStatus: String,
    trackingData: mongoose.Schema.Types.Mixed,
    lastTrackingUpdate: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  module.exports = mongoose.model("Order", orderSchema);