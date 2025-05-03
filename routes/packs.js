const express = require('express');
const upload = require("../middleware/multer");
const { isAuthenticated } = require("../config/authcheck");
const router = express.Router();
const { packsPage, getpacks, addPack, deletePack, updatePack, addToPanier, deletePacksIMAGE } = require("../controller/packs");

router.get("/", isAuthenticated, packsPage);

router.get("/getall", getpacks);

router.post("/add", upload.array('images', 10), addPack);

router.delete("/delete", deletePack);

router.put("/update", upload.array('images', 10), updatePack);

router.post("/buy", addToPanier);

router.delete("/deleteimage", deletePacksIMAGE);

module.exports = router;