const express = require('express');
const upload = require("../middleware/multer");
const router = express.Router();
const { isAuthenticated } = require("../config/authcheck");
const { productsPage, addProduct } = require("../controller/products");


// products Page
router.get("/", isAuthenticated, productsPage);
router.post("/add", upload.array('images', 10), addProduct);

module.exports = router;