// import nodemailer from "nodemailer";

// // Gmail use kar rahe hain — .env mein EMAIL_USER aur EMAIL_PASS set karna hoga
// // EMAIL_PASS Gmail ka normal password nahi, "App Password" hoga
// // (Google Account → Security → 2-Step Verification → App Passwords se banega)

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// export const sendOrderConfirmationEmail = async (order) => {

//     const itemsHtml = order.products
//         .map(
//             (p) => `
//         <tr>
//             <td style="padding:10px 0;border-bottom:1px solid #eee;">
//                 ${p.product_name} <span style="color:#8FA5A4;font-size:12px;">(${p.product_type})</span>
//             </td>
//             <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;">
//                 Rs. ${p.product_price}
//             </td>
//         </tr>`
//         )
//         .join("");

//     const html = `
//     <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#2F3A2C;">
//         <h2 style="color:#4F6B4A;margin-bottom:4px;">AVYRON</h2>
//         <p style="color:#6b6357;margin-top:0;">Order Confirmation</p>

//         <p>Hi ${order.client_name},</p>
//         <p>Thank you for your order! Here's a summary:</p>

//         <table style="width:100%;border-collapse:collapse;margin:18px 0;">
//             ${itemsHtml}
//         </table>

//         <table style="width:100%;font-size:14px;">
//             <tr>
//                 <td style="padding:4px 0;">Subtotal</td>
//                 <td style="padding:4px 0;text-align:right;">Rs. ${order.subtotal}</td>
//             </tr>
//             <tr>
//                 <td style="padding:4px 0;">Delivery Charges</td>
//                 <td style="padding:4px 0;text-align:right;">Rs. ${order.delivery_charges}</td>
//             </tr>
//             <tr>
//                 <td style="padding:8px 0;font-weight:bold;border-top:1px solid #ddd;">Total</td>
//                 <td style="padding:8px 0;font-weight:bold;text-align:right;border-top:1px solid #ddd;">
//                     Rs. ${order.total_amount}
//                 </td>
//             </tr>
//         </table>

//         <p style="margin-top:20px;">
//             We'll reach out to you on WhatsApp/phone shortly to confirm your order.
//         </p>

//         <p style="color:#8b8b84;font-size:12px;margin-top:30px;">
//             — AVYRON · Karachi Atelier
//         </p>
//     </div>
//     `;

//     await transporter.sendMail({
//         from: `"AVYRON" <${process.env.EMAIL_USER}>`,
//         to: order.client_email,
//         subject: "Your AVYRON Order Confirmation",
//         html,
//     });
// };




import nodemailer from "nodemailer";

// Outlook/Office365 SMTP use kar rahe hain — .env mein EMAIL_USER aur EMAIL_PASS set karna hoga

const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false, // STARTTLS use hota hai port 587 pe
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOrderConfirmationEmail = async (order) => {

    const itemsHtml = order.products
        .map(
            (p) => `
        <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee;">
                ${p.product_name} <span style="color:#8FA5A4;font-size:12px;">(${p.product_type})</span>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;">
                Rs. ${p.product_price}
            </td>
        </tr>`
        )
        .join("");

    const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#2F3A2C;">
        <h2 style="color:#4F6B4A;margin-bottom:4px;">AVYRON</h2>
        <p style="color:#6b6357;margin-top:0;">Order Confirmation</p>

        <p>Hi ${order.client_name},</p>
        <p>Thank you for your order! Here's a summary:</p>

        <table style="width:100%;border-collapse:collapse;margin:18px 0;">
            ${itemsHtml}
        </table>

        <table style="width:100%;font-size:14px;">
            <tr>
                <td style="padding:4px 0;">Subtotal</td>
                <td style="padding:4px 0;text-align:right;">Rs. ${order.subtotal}</td>
            </tr>
            <tr>
                <td style="padding:4px 0;">Delivery Charges</td>
                <td style="padding:4px 0;text-align:right;">Rs. ${order.delivery_charges}</td>
            </tr>
            <tr>
                <td style="padding:8px 0;font-weight:bold;border-top:1px solid #ddd;">Total</td>
                <td style="padding:8px 0;font-weight:bold;text-align:right;border-top:1px solid #ddd;">
                    Rs. ${order.total_amount}
                </td>
            </tr>
        </table>

        <p style="margin-top:20px;">
            We'll reach out to you on WhatsApp/phone shortly to confirm your order.
        </p>

        <p style="color:#8b8b84;font-size:12px;margin-top:30px;">
            — AVYRON · Karachi Atelier
        </p>
    </div>
    `;

    await transporter.sendMail({
        from: `"AVYRON" <${process.env.EMAIL_USER}>`,
        to: order.client_email,
        subject: "Your AVYRON Order Confirmation",
        html,
    });
};