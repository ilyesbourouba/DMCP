const express = require('express');
const router = express.Router();
const { isAuthenticated } = require("../config/authcheck");
const { productsPage } = require("../controller/products");
// products Page
router.get("/", isAuthenticated, productsPage);

module.exports = router;