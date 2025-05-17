const express = require('express');
const passport = require('passport');
const { isAuthenticated } = require("../config/authcheck");
const clientController = require("../controller/client");

const router = express.Router();
const { clientPage, checkLogin, registerClient, updateClient, forgetPassword } = clientController;

router.get("/", isAuthenticated, clientPage);
router.post('/login', checkLogin);
router.post('/create', registerClient);
router.put("/update", updateClient)
router.post("/resetpassword", forgetPassword)

module.exports = router;