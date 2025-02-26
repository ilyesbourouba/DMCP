const express = require('express');
const router = express.Router();
const { isAuthenticated } = require("../config/authcheck");
const { dashBoardPage } = require("../controller/dashboard");
// dashboard Page
router.get("/", isAuthenticated, dashBoardPage);

module.exports = router;