const express = require('express');
const upload = require("../middleware/multer");
const router = express.Router();
const { isAuthenticated } = require("../config/authcheck");
const { productsPage, addProduct, updateProduct, deleteProduct, deleteProductIMAGE } = require("../controller/products");


// products Page
router.get("/", isAuthenticated, productsPage);
router.post("/add", upload.array('images', 10), addProduct);
router.put("/update", upload.array('images', 10), updateProduct);
router.delete("/delete", deleteProduct);
router.delete("/deleteimage", deleteProductIMAGE);

module.exports = router;