const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        category_name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        img: {
            type: String,
            required: true,
        },

        img_public_id: {
            type: String,
            required: true,
        },

        // status: {
        //     type: String,
        //     required: true,
        //     enum: ["live", "paused"],
        //     default: "live",
        // },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Category", categorySchema);