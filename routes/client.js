const express = require('express');
const passport = require('passport');
const { isAuthenticated } = require("../config/authcheck");
const clientController = require("../controller/client");

const router = express.Router();
const { clientPage, checkLogin, registerClient, updateClient, forgetPassword, checkCode, resetPassword } = clientController;

router.get("/", isAuthenticated, clientPage);
router.post('/login', checkLogin);
router.post('/create', registerClient);
router.put("/update", updateClient);
router.post("/resetpassword", forgetPassword);
router.post("/checkcode", checkCode);
router.post("/changepassword", resetPassword);

module.exports = router;