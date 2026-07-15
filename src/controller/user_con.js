import User from "../models/user.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const user_signup = async (req, res) => {
    try {
        const { name, email, password, role, post_status } = req.body;

        const currentUserId = req.user.id;
        const currentUserRole = req.user.role;

        if (req.user.role !== "super admin") {
            return res.status(403).json({
                success: false,
                message: "Only Super Admin can create users."
            });
        }

        if (!name || !email || !password || !post_status) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            post_status,
        });

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                post_status: user.post_status
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "7d",
            }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            // data: user,
            user_id: user._id,
            user_role: user.role,
            post_status: user.post_status,
            user_email: user.email,
            token: token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const user_signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        // Find User
        const user = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        // Generate Token
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                post_status: user.post_status,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "7d",
            }
        );

        res.status(200).json({
            success: true,
            message: "Login successful.",
            user_id: user._id,
            user_role: user.role,
            user_email: user.email,
            post_status: user.post_status,
            token,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const user_update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, password, post_status } = req.body;

        const updateData = {};

        if (name) updateData.name = name;

        if (post_status) updateData.post_status = post_status;

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const token = jwt.sign(
            {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                post_status: updatedUser.post_status
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || "7d",
            }
        );


        res.status(200).json({
            success: true,
            message: "User updated successfully.",
            user_id: updatedUser._id,
            user_role: updatedUser.role,
            post_status: updatedUser.post_status,
            user_email: updatedUser.email,
            token: token
            // data: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

