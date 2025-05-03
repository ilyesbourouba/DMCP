const express = require('express');
const router = express.Router();
const { isAuthenticated } = require("../config/authcheck");
const { livraisonPage, getLivraisonPrice, updateLivraisonPrice } = require("../controller/livraison");


router.get("/", isAuthenticated, livraisonPage);
router.get("/getprice", getLivraisonPrice);
router.put("/updateprice", updateLivraisonPrice);


module.exports = router;