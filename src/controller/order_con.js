import Order from "../models/order.js";

export const order_create = async (req, res) => {
    try {
        const {
            client_name,
            client_email,
            client_whatsapp,
            client_phone,
            client_address,
            client_city,
            client_notes,
            products,
            subtotal,
            delivery_charges,
            total_amount,
        } = req.body;

        // Validation
        if (
            !client_name ||
            !client_email ||
            !client_whatsapp ||
            !client_phone ||
            !client_address ||
            !client_city ||
            !products ||
            !Array.isArray(products) ||
            products.length === 0 ||
            subtotal == null ||
            delivery_charges == null ||
            total_amount == null
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields are required.",
            });
        }

        // Create Order
        const newOrder = await Order.create({
            client_name,
            client_email,
            client_whatsapp,
            client_phone,
            client_address,
            client_city,
            client_notes,
            products,
            subtotal,
            delivery_charges,
            total_amount,
        });

        res.status(201).json({
            success: true,
            message: "Order created successfully.",
            data: newOrder,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ******************** Read Orders ********************
export const order_read = async (req, res) => {
    try {

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

        const orders = await Order.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Orders fetched successfully.",
            data: orders,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ******************** Update Order Status ********************
export const order_update_status = async (req, res) => {
    try {

        const { id } = req.params;
        const { order_status } = req.body;

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
        if (!order_status) {
            return res.status(400).json({
                success: false,
                message: "order_status is required.",
            });
        }

        if (!["Pending", "Confirmed", "Delivered"].includes(order_status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order_status value.",
            });
        }

        // Order Check
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        // Update Status
        order.order_status = order_status;
        await order.save();

        res.status(200).json({
            success: true,
            message: `Order status updated to ${order_status}.`,
            data: order,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ******************** Create Order ********************
// export const order_create = async (req, res) => {
//     try {
 
//         const {
//             client_name,
//             client_email,
//             client_whatsapp,
//             client_phone,
//             client_address,
//             client_city,
//             client_notes,
//             products,
//         } = req.body;
 
//         // Validation
//         if (
//             !client_name ||
//             !client_email ||
//             !client_whatsapp ||
//             !client_phone ||
//             !client_address ||
//             !client_city
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required.",
//             });
//         }
 
//         if (!products || !Array.isArray(products) || products.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Your cart is empty.",
//             });
//         }
 
//         // Har item ki price DB se dobara verify karo — client se aayi price trust nahi karte
//         let subtotal = 0;
//         const verifiedProducts = [];
 
//         for (const item of products) {
//             const Model = item.product_type === "Tester" ? Tester : Product;
//             const dbItem = await Model.findById(item.product_id);
 
//             if (!dbItem) {
//                 return res.status(404).json({
//                     success: false,
//                     message: `"${item.product_name}" is no longer available.`,
//                 });
//             }
 
//             subtotal += dbItem.price;
 
//             verifiedProducts.push({
//                 product_id: dbItem._id,
//                 product_type: item.product_type,
//                 product_name: dbItem.name,
//                 product_img: dbItem.img,
//                 product_category: item.product_category || "",
//                 product_price: dbItem.price,
//             });
//         }
 
//         const delivery_charges = 200;
//         const total_amount = subtotal + delivery_charges;
 
//         // Create Order
//         const order = await Order.create({
//             client_name,
//             client_email,
//             client_whatsapp,
//             client_phone,
//             client_address,
//             client_city,
//             client_notes,
//             products: verifiedProducts,
//             subtotal,
//             delivery_charges,
//             total_amount,
//         });
 
//         // Confirmation email — fail ho jaye to bhi order fail nahi hona chahiye
//         try {
//             await sendOrderConfirmationEmail(order);
//         } catch (emailError) {
//             console.log("Email send failed:", emailError.message);
//         }
 
//         res.status(201).json({
//             success: true,
//             message: "Order placed successfully.",
//             data: order,
//         });
 
//     } catch (error) {
 
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
 
//     }
// };
