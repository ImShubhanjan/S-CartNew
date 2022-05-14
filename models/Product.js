const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        itemName: {type: String, required: true},
        itemImage: { type: String, required: true},
        itemPrice: { type: String, required: true},
        category: { type: String, required: true}
    }, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);