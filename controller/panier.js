const PanierModel = require('../model/panier');

exports.getPanier = async(req, res) => {
    const { client } = req.body;

    if (!client) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    console.log("client => ", client);

    const result = await PanierModel.getByClientId(client);
    console.log(result)
    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(200).json([]);
};

exports.addToPanier = async(req, res) => {
    const { product_id, client_id, quantity } = req.body;

    if (!product_id || !client_id || !quantity) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    console.log("DATA => ", product_id, client_id, quantity);
    const checkPanier = await PanierModel.find(client_id, product_id);
    console.log(checkPanier);

    let result; // declare it first

    if (checkPanier == null) {
        result = await PanierModel.addToPanier(client_id, product_id, quantity);
    } else {
        // var sum = quantity + checkPanier["quantity"];
        result = await PanierModel.updatePanier(client_id, product_id, quantity);
    }

    console.log("result =>", result);

    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(500).json({ message: "Error getting panier : " + result.error });
};

exports.deleteFromPanier = async(req, res) => {
    const { product_id, client_id } = req.body;

    if (!product_id || !client_id) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    console.log(product_id, client_id)
    result = await PanierModel.deleteFromPanier(client_id, product_id);

    if (result.length > 0) {
        return res.status(200).json(result);
    }
    return res.status(200).json([]);
};