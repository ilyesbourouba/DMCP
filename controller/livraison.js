const LivraisonModel = require('../model/livraison');

exports.livraisonPage = async (req, res, next) => {
    const { user } = req;
    const data = await LivraisonModel.getPrices();

    let livraisons = [];
    if (data.length != 0) {
        livraisons = data;
    }

    return res.render('livraison', {
        user,
        sectionName: "Livraison",
        pageName: "Livraison",
        livraisons
    });
}

exports.getLivraisonPrice = async (req, res, next) => {

    const data = await LivraisonModel.getPrices();
    console.log(data)

    return res.status(200).json(data);
}

exports.updateLivraisonPrice = async (req, res, next) => {
    const { wilaya, price } = req.body;
    console.log(price);
    if (!wilaya || !price) return res.status(400).json({ message: "Price && wilaya are required" });

    const result = await LivraisonModel.updatePrice(wilaya, price);
    if (result) return res.status(200).json({ message: "Price updated successfully" });
    return res.status(500).json({ message: "Internal server error" });
}