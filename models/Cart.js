const mongoose = require('mongoose');

const ProductsSchema = new mongoose.Schema({
    productId: { type: String,},
    quantity: {
        type: Number,
        default:1,
    }
});

const CartSchema = new mongoose.Schema({
    username: { type: String, required: true },
    products: [ProductsSchema]
});

const cart = mongoose.model("Cart", CartSchema);
const products = mongoose.model("Products", ProductsSchema);

module.exports.Cart = cart;
module.exports.Products = products;