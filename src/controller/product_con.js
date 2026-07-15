import Product from "../models/product.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import Category from "../models/category.js";
import user from "../models/user.js";


// ******************** create product ********************
export const product_create = async (req, res) => {
    try {

        const {
            category,
            name,
            description,
            price,
            quantity,
            stock
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
            // !stock ||
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

        // Duplicate Product
        const existingProduct = await Product.findOne({
            name: name.trim(),
        });

        if (existingProduct) {
            return res.status(409).json({
                success: false,
                message: "Product already exists.",
            });
        }

        // Upload Image
        const uploadResult = await new Promise((resolve, reject) => {

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "avyron/product",
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

        // Create Product
        const product = await Product.create({
            category,
            name: name.trim(),
            description,
            price,
            quantity,
            stock: "In Stock",

            img: uploadResult.secure_url,
            img_public_id: uploadResult.public_id,

            post_status: req.user.post_status,
            posted_by: req.user.id,
            posted_by_role: req.user.role,
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully.",
            data: product,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ******************** Read Product ********************

// export const product_read = async (req, res) => {
//     try {
//         const product = await Product.find();
//         // .sort({ createdAt: -1 });
//         res.status(200).json(product);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Something went wrong" });
//     }
// };

// ******************** Read Product ********************
export const product_read = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("category", "category_name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Products fetched successfully.",
            data: products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

// ******************** Read Single Product (Client Side) ********************
export const product_read_single = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await Product.findOne({
            _id: id,
            post_status: "Published",
        }).populate("category", "category_name");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully.",
            data: product,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ******************** Update Product Post_Status ********************
export const product_update_post_status = async (req, res) => {
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

        // Product Check
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        // Update Status
        product.post_status = post_status;
        await product.save();

        res.status(200).json({
            success: true,
            message: `Product status updated to ${post_status}.`,
            data: product,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ******************** Update Product Stock ********************
export const product_update_stock = async (req, res) => {
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

        // Product Check
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        // Update Stock
        product.stock = stock;
        await product.save();

        res.status(200).json({
            success: true,
            message: `Stock updated to ${stock}.`,
            data: product,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ******************** Update Product ********************
// export const product_update = async (req, res) => {
//     try {

//         const { id } = req.params;
//         const {
//             category,
//             name,
//             description,
//             price,
//             quantity,
//         } = req.body;

//         // Sirf Admin aur Super Admin
//         if (
//             req.user.role !== "admin" &&
//             req.user.role !== "super_admin"
//         ) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Access denied.",
//             });
//         }

//         // Product Check
//         const product = await Product.findById(id);

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found.",
//             });
//         }

//         // Category Check — sirf tab jab category bheji gayi ho
//         if (category) {
//             const categoryExists = await Category.findById(category);

//             if (!categoryExists) {
//                 return res.status(404).json({
//                     success: false,
//                     message: "Category not found.",
//                 });
//             }

//             product.category = category;
//         }

//         // Duplicate Name Check — sirf tab jab name bheja gaya ho
//         if (name) {
//             const existingProduct = await Product.findOne({
//                 name: name.trim(),
//                 _id: { $ne: id },
//             });

//             if (existingProduct) {
//                 return res.status(409).json({
//                     success: false,
//                     message: "Another product with this name already exists.",
//                 });
//             }

//             product.name = name.trim();
//         }

//         // Baaki fields — jo bheja gaya usi ko update karo
//         if (description) product.description = description;
//         if (price) product.price = price;
//         if (quantity) product.quantity = quantity;

//         await product.save();

//         res.status(200).json({
//             success: true,
//             message: "Product updated successfully.",
//             data: product,
//         });

//     } catch (error) {

//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });

//     }
// };

// ******************** Update Product ********************
export const product_update = async (req, res) => {
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

        // Product Check
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
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

            product.category = category;
        }

        // Duplicate Name Check — sirf tab jab name bheja gaya ho
        if (name) {
            const existingProduct = await Product.findOne({
                name: name.trim(),
                _id: { $ne: id },
            });

            if (existingProduct) {
                return res.status(409).json({
                    success: false,
                    message: "Another product with this name already exists.",
                });
            }

            product.name = name.trim();
        }

        // Baaki fields — jo bheja gaya usi ko update karo
        if (description) product.description = description;
        if (price) product.price = price;
        if (quantity) product.quantity = quantity;

        // Image Update — sirf tab jab nayi image bheji gayi ho
        if (req.file) {

            // Purani image Cloudinary se delete karo
            if (product.img_public_id) {
                await cloudinary.uploader.destroy(product.img_public_id);
            }

            // Nayi image upload karo
            const uploadResult = await new Promise((resolve, reject) => {

                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "avyron/product",
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

            product.img = uploadResult.secure_url;
            product.img_public_id = uploadResult.public_id;
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            data: product,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ******************** Delete Product ********************
export const product_delete = async (req, res) => {
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

        // Product Check
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        // Cloudinary se image delete karo
        if (product.img_public_id) {
            await cloudinary.uploader.destroy(product.img_public_id);
        }

        // Database se product delete karo
        await Product.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ******************** Read Products (Client Side) ********************
export const product_read_client = async (req, res) => {
    try {

        const products = await Product.find({ post_status: "Published" })
            .populate("category", "category_name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Products fetched successfully.",
            data: products,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ******************** Read Products By Category Name (Client Side) ********************
export const product_read_by_category = async (req, res) => {
    try {

        const { category_name } = req.params;

        // Pehle category dhoondo naam se
        const category = await Category.findOne({
            category_name: { $regex: `^${category_name}$`, $options: "i" },
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found.",
            });
        }

        // Us category ke sirf Published products
        const products = await Product.find({
            category: category._id,
            post_status: "Published",
        })
            .populate("category", "category_name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Products fetched successfully.",
            data: products,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};