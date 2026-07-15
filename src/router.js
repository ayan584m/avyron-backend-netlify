import express from 'express'
import { user_signin, user_signup, user_update } from './controller/user_con.js'
import { verifyToken } from './middleware/authMiddleware.js'
import { category_create, category_delete, category_read, category_update, category_update_image } from './controller/category_con.js'
import upload from './middleware/upload.js'
import { product_create, product_delete, product_read, product_read_by_category, product_read_client, product_read_single, product_update, product_update_post_status, product_update_stock } from './controller/product_con.js'
import { tester_create, tester_delete, tester_read, tester_read_client, tester_read_single, tester_update, tester_update_post_status, tester_update_stock } from './controller/tester_con.js'
import { order_create, order_read, order_update_status } from './controller/order_con.js'

const router = express.Router()

router.get("/", ((req, res) => {
    res.send("Hellow")
}))

// http://localhost:2000/category_read

// *********** user router ***********
router.post("/user_create", verifyToken, user_signup)
router.post("/user_signin", user_signin)
router.put("/user_update", user_update)

// *********** categories router ***********
router.post("/category_create", verifyToken, upload.single("image"), category_create);
router.get("/category_read", category_read);
router.put("/category_update_image/:id", verifyToken, upload.single("image"), category_update_image);
router.put("/category_update/:id", verifyToken, category_update);
router.delete("/category_delete/:id", verifyToken, category_delete);

// *********** Product router ***********
router.post("/product_create", verifyToken, upload.single("image"), product_create);
router.get("/product_read", product_read);
router.get("/product_read_single/:id", product_read_single);
router.patch("/product_update_post_status/:id", verifyToken, product_update_post_status);
router.patch("/product_update_stock/:id", verifyToken, product_update_stock);
router.put("/product_update/:id", verifyToken, upload.single("image"), product_update);
router.delete("/product_delete/:id", verifyToken, product_delete);
router.get("/product_read_client", product_read_client);
router.get("/product_read_by_category/:category_name", product_read_by_category );

// *********** Tester router ***********
router.post("/tester_create", verifyToken, upload.single("image"), tester_create);
router.get("/tester_read", tester_read);
router.get("/tester_read_single/:id", tester_read_single);
router.patch("/tester_update_post_status/:id", verifyToken, tester_update_post_status);
router.patch("/tester_update_stock/:id", verifyToken, tester_update_stock);
router.put("/tester_update/:id", verifyToken, upload.single("image"), tester_update);
router.delete("/tester_delete/:id", verifyToken, tester_delete);
router.get("/tester_read_client", tester_read_client);


// *********** Order router ***********
router.post("/order_create", order_create );
router.get("/order_read", verifyToken, order_read);
router.patch("/order_update_status/:id", verifyToken, order_update_status );

export default router;