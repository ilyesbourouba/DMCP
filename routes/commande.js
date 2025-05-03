const express = require('express');
const router = express.Router();
const { createCMD, getCMDByClient } = require("../controller/commande");

router.post("/create", createCMD);
router.post("/get", getCMDByClient);

module.exports = router;