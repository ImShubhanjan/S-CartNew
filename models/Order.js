const mongoose = require('mongoose');

const OrderedProductSchema = new mongoose.Schema({
    productId: { type: String,},
    quantity: {
        type: Number,
        default:1,
    }
});

const OrderSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        orderedProduct: [OrderedProductSchema]
        // amount: { type: Number},
        // address: { type: Object},
        // status: { type: String, default: "Pending" }

    }, { timestamps: true });

const order = mongoose.model("Order", OrderSchema);
const orderedproduct = mongoose.model("OrderedProduct", OrderedProductSchema);
    
module.exports.Order = order;
module.exports.OrderedProduct = orderedproduct;