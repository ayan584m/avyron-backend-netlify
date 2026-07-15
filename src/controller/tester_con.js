import Tester from "../models/tester.js";
import Category from "../models/category.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


// ******************** Create Tester ********************
export const tester_create = async (req, res) => {
    try {

        const {
            category,
            name,
            description,
            price,
            quantity,
        } = req.body;

        // Sirf Admin aur Super Admin
        if (
            req.user.role !== "admin" &&
            req.user.role !== "super_admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        // Validation
        if (
            !category ||
            !name ||
            !description ||
            !price ||
            !quantity ||
            !req.file
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        // Category Check
        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        // Duplicate Tester
        const existingTester = await Tester.findOne({
            name: name.trim(),
        });

        if (existingTester) {
            return res.status(409).json({
                success: false,
                message: "Tester already exists.",
            });
        }

        // Upload Image
        const uploadResult = await new Promise((resolve, reject) => {

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "avyron/tester",
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            streamifier
                .createReadStream(req.file.buffer)
                .pipe(uploadStream);

        });

        // Create Tester
        const tester = await Tester.create({
            category,
            name: name.trim(),
            description,
            price,
            quantity,
            stock: "In Stock",

            img: uploadResult.secure_url,
            img_public_id: uploadResult.public_id,

            post_status: "Published",
            posted_by: req.user.id,
            posted_by_role: req.user.role,
        });

        res.status(201).json({
            success: true,
            message: "Tester created successfully.",
            data: tester,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


// ******************** Read Tester ********************
export const tester_read = async (req, res) => {
    try {
        const testers = await Tester.find()
            .populate("category", "category_name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Testers fetched successfully.",
            data: testers,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ******************** Read Single Tester (Client Side) ********************
export const tester_read_single = async (req, res) => {
    try {

        const { id } = req.params;

        const tester = await Tester.findOne({
            _id: id,
            post_status: "Published",
        }).populate("category", "category_name");

        if (!tester) {
            return res.status(404).json({
                success: false,
                message: "Tester not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Tester fetched successfully.",
            data: tester,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ******************** Update Tester Post Status ********************
export const tester_update_post_status = async (req, res) => {
    try {

        const { id } = req.params;
        const { post_status } = req.body;

        // Sirf Admin aur Super Admin
        if (
            req.user.role !== "admin" &&
            req.user.role !== "super_admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        // Validation
        if (!post_status) {
            return res.status(400).json({
                success: false,
                message: "post_status is required.",
            });
        }

        if (!["Published", "paused"].includes(post_status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post_status value.",
            });
        }

        // Tester Check
        const tester = await Tester.findById(id);

        if (!tester) {
            return res.status(404).json({
                success: false,
                message: "Tester not found.",
            });
        }

        // Update Status
        tester.post_status = post_status;
        await tester.save();

        res.status(200).json({
            success: true,
            message: `Tester status updated to ${post_status}.`,
            data: tester,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


// ******************** Update Tester Stock ********************
export const tester_update_stock = async (req, res) => {
    try {

        const { id } = req.params;
        const { stock } = req.body;

        // Sirf Admin aur Super Admin
        if (
            req.user.role !== "admin" &&
            req.user.role !== "super_admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        // Validation
        if (!stock) {
            return res.status(400).json({
                success: false,
                message: "stock is required.",
            });
        }

        if (!["In Stock", "Out of Stock"].includes(stock)) {
            return res.status(400).json({
                success: false,
                message: "Invalid stock value.",
            });
        }

        // Tester Check
        const tester = await Tester.findById(id);

        if (!tester) {
            return res.status(404).json({
                success: false,
                message: "Tester not found.",
            });
        }

        // Update Stock
        tester.stock = stock;
        await tester.save();

        res.status(200).json({
            success: true,
            message: `Stock updated to ${stock}.`,
            data: tester,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


// ******************** Update Tester ********************
export const tester_update = async (req, res) => {
    try {

        const { id } = req.params;
        const {
            category,
            name,
            description,
            price,
            quantity,
        } = req.body;

        // Sirf Admin aur Super Admin
        if (
            req.user.role !== "admin" &&
            req.user.role !== "super_admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        // Tester Check
        const tester = await Tester.findById(id);

        if (!tester) {
            return res.status(404).json({
                success: false,
                message: "Tester not found.",
            });
        }

        // Category Check — sirf tab jab category bheji gayi ho
        if (category) {
            const categoryExists = await Category.findById(category);

            if (!categoryExists) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found.",
                });
            }

            tester.category = category;
        }

        // Duplicate Name Check — sirf tab jab name bheja gaya ho
        if (name) {
            const existingTester = await Tester.findOne({
                name: name.trim(),
                _id: { $ne: id },
            });

            if (existingTester) {
                return res.status(409).json({
                    success: false,
                    message: "Another tester with this name already exists.",
                });
            }

            tester.name = name.trim();
        }

        // Baaki fields — jo bheja gaya usi ko update karo
        if (description) tester.description = description;
        if (price) tester.price = price;
        if (quantity) tester.quantity = quantity;

        // Image Update — sirf tab jab nayi image bheji gayi ho
        if (req.file) {

            // Purani image Cloudinary se delete karo
            if (tester.img_public_id) {
                await cloudinary.uploader.destroy(tester.img_public_id);
            }

            // Nayi image upload karo
            const uploadResult = await new Promise((resolve, reject) => {

                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "avyron/tester",
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );

                streamifier
                    .createReadStream(req.file.buffer)
                    .pipe(uploadStream);

            });

            tester.img = uploadResult.secure_url;
            tester.img_public_id = uploadResult.public_id;
        }

        await tester.save();

        res.status(200).json({
            success: true,
            message: "Tester updated successfully.",
            data: tester,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


// ******************** Delete Tester ********************
export const tester_delete = async (req, res) => {
    try {

        const { id } = req.params;

        // Sirf Admin aur Super Admin
        if (
            req.user.role !== "admin" &&
            req.user.role !== "super_admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        // Tester Check
        const tester = await Tester.findById(id);

        if (!tester) {
            return res.status(404).json({
                success: false,
                message: "Tester not found.",
            });
        }

        // Cloudinary se image delete karo
        if (tester.img_public_id) {
            await cloudinary.uploader.destroy(tester.img_public_id);
        }

        // Database se tester delete karo
        await Tester.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Tester deleted successfully.",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ******************** Read Testers (Client Side) ********************
export const tester_read_client = async (req, res) => {
    try {

        const testers = await Tester.find({ post_status: "Published" })
            .populate("category", "category_name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Testers fetched successfully.",
            data: testers,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};