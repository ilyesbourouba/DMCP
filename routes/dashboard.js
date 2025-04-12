const express = require('express');
const router = express.Router();
const { isAuthenticated } = require("../config/authcheck");
const { dashboardPage } = require("../controller/dashboard");

router.get("/", isAuthenticated, dashboardPage);

module.exports = router;