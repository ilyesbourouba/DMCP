const express = require('express');
const router = express.Router();
const { getLivraisonPrice } = require("../controller/livraison");


router.get("/getprice", getLivraisonPrice);


module.exports = router;