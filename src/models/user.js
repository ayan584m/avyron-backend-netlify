const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            // unique: true,
            // lowercase: true,
            // trim: true,
        },

        role: {
            type: String,
            enum: ["user", "admin", "super admin"],
            default: "admin",
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        post_status: {
            type: String,
            required: true,
            // type: Boolean,
            // default: true,
        },

        // otp: {
        //     type: String,
        //     default: null,
        // },

        // otpExpires: {
        //     type: Date,
        //     default: null,
        // },

        // isVerified: {
        //     type: Boolean,
        //     default: false,
        // },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);