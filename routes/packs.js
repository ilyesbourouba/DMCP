const express = require('express');
const router = express.Router();
const { isAuthenticated } = require("../config/authcheck");
const { packsPage, getpacks, addPack, deletePack, updatePack } = require("../controller/packs");

router.get("/", isAuthenticated, packsPage);

router.get("/getall", getpacks);

router.post("/add", addPack);

router.delete("/delete", deletePack);

router.put("/update", updatePack);

module.exports = router;