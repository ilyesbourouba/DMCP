const express = require('express');
const router = express.Router();
const { isAuthenticated } = require("../config/authcheck");
const { packsPage, getpacks } = require("../controller/packs");


router.get("/", isAuthenticated, packsPage);

router.get("/getall", getpacks);

module.exports = router;