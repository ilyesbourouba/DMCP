const express = require('express');
const userController = require("../controller/user");

const router = express.Router();
const { loginPage } = userController;

router.get("/", (req, res, next) => {
        next();
}, loginPage);

router.post("/login",loginPage);

module.exports = router;