const express = require('express');
const passport = require('passport');
const { isAuthenticated } = require("../config/authcheck");
const clientController = require("../controller/client");

const router = express.Router();
const { clientPage, checkLogin, registerClient, updateClient } = clientController;

router.get("/", isAuthenticated, clientPage);
router.post('/login', checkLogin);
router.post('/create', registerClient);
router.put("/update", updateClient)

module.exports = router;