const express = require('express');
const router = express.Router();
const { isAuthenticated } = require("../config/authcheck");
const { dashboardPage, contactsPage, updateContacts } = require("../controller/dashboard");

router.get("/", isAuthenticated, dashboardPage);
router.get("/contact", isAuthenticated, contactsPage);
router.post("/contact", isAuthenticated, updateContacts);


module.exports = router;