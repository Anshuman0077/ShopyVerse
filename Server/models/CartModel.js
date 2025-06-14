import mongoose from "mongoose";



const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,

    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 0,
                min: 1
            }
        }
    ]


}, {timestamps: true})

// module.exports = mongoose.model("Cart" , cartSchema);
const Cart = mongoose.model("Cart" , cartSchema);
export default Cart;