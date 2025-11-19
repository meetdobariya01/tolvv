const  mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
        ProductName:{
        type:String,
        require:true
    },
    ProductPrice:{
        type:Number,
        required:true
    },
    Description:{
        type:String,
        required:true 
    },
    Category:{
        type:String,
        required:true
    },
    Photos:{
        type:String,
        required:true
    },
});
module.exports = mongoose.model('Product', ProductSchema);