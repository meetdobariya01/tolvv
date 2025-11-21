const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    ProductName: { type: String, required: true },
    ProductPrice: { type: Number, required: true },
    Description: String,
    Category: { type: String, required: true },
    Photos: String,
    Zodiac: { type: String, enum: [
        'Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
    ] }, // optional
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
