import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        client_name: {
            type: String,
            required: true,
            trim: true,
        },

        client_email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        client_whatsapp: {
            type: String,
            required: true,
            trim: true,
        },

        client_phone: {
            type: String,
            required: true,
            trim: true,
        },

        client_address: {
            type: String,
            required: true,
            trim: true,
        },

        client_city: {
            type: String,
            required: true,
            trim: true,
        },

        client_notes: {
            type: String,
            default: "",
            trim: true,
        },

        products: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                product_img: {
                    type: String,
                    required: true,
                },

                product_name: {
                    type: String,
                    required: true,
                },

                product_category: {
                    type: String,
                    required: true,
                },

                product_price: {
                    type: Number,
                    required: true,
                },
                product_type: {
                    required: true,
                    type: String,
                    enum: [
                        "Tester",
                        "Product"
                    ],
                }
            },
        ],

        subtotal: {
            type: Number,
            required: true,
        },

        delivery_charges: {
            type: Number,
            required: true,
            default: 0,
        },

        total_amount: {
            type: Number,
            required: true,
        },

        order_status: {
            type: String,
            enum: [
                "Pending",
                // "Confirmed",
                // "Packed",
                // "Shipped",
                // "Delivered",
                // "Cancelled",
                "Confirmed",
                "Delivered"
            ],
            default: "Pending",
        },

        order_date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Order", orderSchema);