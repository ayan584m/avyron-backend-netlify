import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        stock: {
            type: String,
            required: true,
            default: 0,
        }, // In Stock    Out of Stock
        
        quantity: {
            type: Number,
            required: true,
            default: 0,
        },

        img: {
            type: String,
            required: true,
        },

        img_public_id: {
            type: String,
            required: true,
        },

        post_status: {
            type: String,
            enum: ["Published", "paused"],
            default: "Published",
        },

        posted_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        posted_by_role: {
            type: String,
            enum: ["admin", "super_admin"],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Product", productSchema);