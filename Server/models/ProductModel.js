import mongoose from "mongoose";

export const productSchmma = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Product name is required"],
    },
    description: {
        type: String,
        required: [true, "Product description is required"],
        trim: true,
        minlength: 10,
        maxlength: 500
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: 0
    },
    category: {
        type: String,
        required: [true, "Product category is required"],
        // enum: ["electronics", "clothing", "home", "books", "toys"]
    },
    image :{
        type: String,
        default: ""
    },
    stock: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchmma);
export default Product;