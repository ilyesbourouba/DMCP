const LivraisonModel = require('../model/livraison');

exports.livraisonPage = async(req, res, next) => {
    const { user } = req;
    const [data] = await LivraisonModel.getPrice();
    let livraison = [];
    if (data.length != 0) {
        livraison = data;
    }
    console.log("livraison =>", livraison);

    return res.render('livraison', {
        user,
        sectionName: "Livraison",
        pageName: "Livraison",
        livraison
    });
}

exports.getLivraisonPrice = async(req, res, next) => {

    const [data] = await LivraisonModel.getPrice();
    console.log(data)

    return res.status(200).json(data);
}

exports.updateLivraisonPrice = async(req, res, next) => {
    const { price } = req.body;
    console.log(price);
    if (!price) return res.status(400).json({ message: "Price is required" });

    const result = await LivraisonModel.updatePrice(price);
    if (result) return res.status(200).json({ message: "Price updated successfully" });
    return res.status(500).json({ message: "Internal server error" });
}