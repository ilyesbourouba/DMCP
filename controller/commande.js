const CommandeModel = require('../model/commande');

exports.createCMD = async(req, res, next) => {
    const { client_id, total_amount, products } = req.body;

    console.log(client_id, total_amount, products);

    if (!client_id || !total_amount || products.length === 0) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    try {
        const result = await CommandeModel.createCMD(client_id, total_amount, products);
        if (result) {
            return res.status(200).json({ message: "Commande created successfully" });
        } else {
            return res.status(500).json({ message: "Error creating commande" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}