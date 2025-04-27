const express = require('express');
const router = express.Router();
const { getPanier } = require("../controller/panier");

router.post("/client", getPanier);

module.exports = router;