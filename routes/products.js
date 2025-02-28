const express = require('express');
const router = express.Router();
const { isAuthenticated } = require("../config/authcheck");
const { productsPage, addProduct } = require("../controller/products");
// products Page
router.get("/", isAuthenticated, productsPage);
router.post("/addproduct", isAuthenticated, addProduct);

module.exports = router;