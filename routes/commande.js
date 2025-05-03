const express = require('express');
const { isAuthenticated } = require("../config/authcheck");

const router = express.Router();
const { createCMD, getCMDByClient, renderCMDPage, updateStatus } = require("../controller/commande");

router.get("/", isAuthenticated, renderCMDPage);
router.post("/create", createCMD);
router.post("/get", getCMDByClient);
router.put("/updatestatus", updateStatus);

module.exports = router;