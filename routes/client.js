const express = require('express');
const passport = require('passport');

const clientController = require("../controller/client");

const router = express.Router();
const { checkLogin, registerClient, updateClient } = clientController;

// Login
router.post('/login', checkLogin);
router.post('/create', registerClient);
router.put("/update", updateClient)

module.exports = router;