const PanierModel = require('../model/panier');

exports.getPanier = async(req, res) => {
    const { client } = req.body;

    if (!client) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    console.log("client => ", client);

    const result = await PanierModel.getByClientId(client);
    console.log(result["data"])
    if (result.success) {
        return res.status(200).json(result["data"]);
    }
    return res.status(500).json({ message: "Error getting panier : " + result.error });
};