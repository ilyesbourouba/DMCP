const LivraisonModel = require('../model/livraison');

exports.getLivraisonPrice = async(req, res, next) => {

    const [data] = await LivraisonModel.getPrice();
    console.log(data)

    return res.status(200).json(data);
}