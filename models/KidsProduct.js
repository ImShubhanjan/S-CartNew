const mongoose = require('mongoose');

const KidsProductSchema = new mongoose.Schema(
    {
        itemName: { type: String, required: true },
        itemImage: { type: String, required: true },
        itemPrice: { type: String, required: true },
    }, { timestamps: true });

module.exports = mongoose.model("KidsProduct", KidsProductSchema);