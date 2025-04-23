const express = require('express');
const passport = require('passport');

const userController = require("../controller/user");

const router = express.Router();
const { checkLogin, registerUser } = userController;


// Login
router.post('/login', checkLogin);
router.post('/create', registerUser);

module.exports = router;