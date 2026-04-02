const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../Model/Product.add.admin");
const { authenticate } = require("../middleware/auth.middleware");
const Order = require("../Model/order"); 
// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single product


// Get products by category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = category === "All"
      ? await Product.find()
      : await Product.find({ Category: category });
    res.status(200).json(products);
  } catch (error) {
    console.error("Fetch products by category error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get products by zodiac sign
router.get("/zodiac/:zodiac", async (req, res) => {
  try {
    const { zodiac } = req.params;
    const { category } = req.query;

    const query = { Zodiac: zodiac };
    if (category && category !== "All") query.Category = category;

    const products = await Product.find(query);
    if (!products.length) {
      return res.status(404).json({ message: "No products found for this zodiac." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Zodiac products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all categories
router.get("/categories/all", async (req, res) => {
  try {
    const categories = await Product.distinct('Category');
    res.status(200).json(categories);
  } catch (error) {
    console.error("Categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/best-sellers", async (req, res) => {
  try {
    const bestSellers = await Order.aggregate([
      
      // ✅ FIXED FIELD NAME
      { $unwind: "$items" },

      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
          orderCount: { $sum: 1 }
        }
      },

      // ✅ ONLY SUCCESSFUL ORDERS (IMPORTANT)
      // (filter before group ideally, but ok here if needed)

      { $sort: { totalSold: -1 } },
      { $limit: 4
       },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },

      { $unwind: "$productDetails" },

    {
  $project: {
    _id: "$productDetails._id",
    ProductName: "$productDetails.ProductName",
    ProductPrice: "$productDetails.ProductPrice",
    Photos: "$productDetails.Photos",
    Category: "$productDetails.Category",
    Zodiac: "$productDetails.Zodiac",

    // ✅ ADD THIS LINE
    size: "$productDetails.size",

    totalSold: 1,
    orderCount: 1
  }
}
    ]);

    console.log("BEST SELLERS 👉", bestSellers);

    res.status(200).json(bestSellers);

  } catch (error) {
    console.error("Best seller error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/zodiac-hampers", async (req, res) => {
  try {
    const hampers = await Product.find({ Category: "Hamper" });
    res.json(hampers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// 🔍 SEARCH PRODUCTS (PUT THIS FIRST)
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || "";

    if (!query) {
      const products = await Product.find();
      return res.json(products);
    }

    const products = await Product.find({
      $or: [
        { ProductName: { $regex: query, $options: "i" } },
        { Category: { $regex: query, $options: "i" } }
      ]
    });

    res.json(products);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ VERY IMPORTANT FIX
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Fetch single product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;