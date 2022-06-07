const mongoose = require('mongoose');

const DetailsSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        landmark: { type: String },
        pin: { type: String, required: true },
    }, { timestamps: true }
);

module.exports = mongoose.model("Details", DetailsSchema);