const express = require('express');
const router = express.Router();
const { createCMD } = require("../controller/commande");

router.post("/create", createCMD);

module.exports = router;