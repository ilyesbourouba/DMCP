const express = require('express');
const router = express.Router();
const { getPanier, addToPanier, deleteFromPanier } = require("../controller/panier");

router.post("/client", getPanier);
router.post("/add", addToPanier);
router.put("/update", addToPanier);
router.delete("/delete", deleteFromPanier);

module.exports = router;