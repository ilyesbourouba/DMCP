const express = require('express');
const passport = require('passport');

const clientController = require("../controller/client");

const router = express.Router();
const { checkLogin, registerClient } = clientController;

// Login
router.post('/login', checkLogin);
router.post('/create', registerClient);

module.exports = router;