import Category from "../models/category.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


// ******************** Create Category ********************
export const category_create = async (req, res) => {
    try {
        const { category_name } = req.body;

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
        if (!category_name || !req.file) {
            return res.status(400).json({
                success: false,
                message: "Category name and image are required.",
            });
        }

        // Duplicate Check
        const existingCategory = await Category.findOne({
            category_name: category_name.trim(),
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists.",
            });
        }

        // Upload Image to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "avyron/category",
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

        // Save Category
        const category_create_v = await Category.create({
            category_name: category_name.trim(),
            img: uploadResult.secure_url,
            img_public_id: uploadResult.public_id,
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully.",
            data: category_create_v,
        });

        // } catch (error) {
        //     res.status(500).json({
        //         success: false,
        //         message: error.message,
        //     });
        // }
    } catch (error) {
        console.error("Category Create Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ******************** Read Category ********************
export const category_read = async (req, res) => {
    try {

        const categories = await Category.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: categories.length,
            data: categories,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ******************** Update img Category ********************
export const category_update_image = async (req, res) => {
    try {
        const { id } = req.params;

        // Admin & Super Admin Only
        if (
            req.user.role !== "admin" &&
            req.user.role !== "super admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required.",
            });
        }

        // Find Category
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        // Delete Old Image
        if (category.img_public_id) {
            await cloudinary.uploader.destroy(category.img_public_id);
        }

        // Upload New Image
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "avyron/category/img",
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

        // Update Database
        category.img = uploadResult.secure_url;
        category.img_public_id = uploadResult.public_id;

        await category.save();

        res.status(200).json({
            success: true,
            message: "Category image updated successfully.",
            data: category,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ******************** Update Name Category ********************
export const category_update = async (req, res) => {
    try {
        const { id } = req.params;
        const { categories } = req.body;

        // Sirf Admin aur Super Admin
        if (
            req.user.role !== "admin" &&
            req.user.role !== "super admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        // Validation
        if (!categories) {
            return res.status(400).json({
                success: false,
                message: "Category name is required.",
            });
        }

        // Duplicate Check
        const existingCategory = await Category.findOne({
            categories: categories.trim(),
            _id: { $ne: id },
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists.",
            });
        }

        // Update
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            {
                categories: categories.trim(),
            },
            {
                new: true,
            }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully.",
            data: updatedCategory,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ******************** Delete Category ********************
export const category_delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Sirf Admin aur Super Admin
        if (
            req.user.role !== "admin" &&
            req.user.role !== "super admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        // Find Category
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        // Delete image from Cloudinary
        if (category.img_public_id) {
            await cloudinary.uploader.destroy(category.img_public_id);
        }

        // Delete category from MongoDB
        await Category.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully.",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};