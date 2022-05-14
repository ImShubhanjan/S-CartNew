const mongoose = require('mongoose');

const GirlsProductSchema = new mongoose.Schema(
    {
        itemName: { type: String, required: true },
        itemImage: { type: String, required: true },
        itemPrice: { type: String, required: true },
    }, { timestamps: true });

module.exports = mongoose.model("GirlsProduct", GirlsProductSchema);