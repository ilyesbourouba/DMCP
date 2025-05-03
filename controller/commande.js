const CommandeModel = require('../model/commande');

// render the commande page :
exports.renderCMDPage = async(req, res, next) => {
    const { user } = req;

    const data = await CommandeModel.getAllCMD();
    const status = await CommandeModel.getStatus();
    // console.log("data are => ", data);
    // console.log("status are => ", status);
    let commandes = [];
    if (data != null && data != undefined && data.length > 0) {
        commandes = data;
    }
    // console.log("commande => ", commandes);

    return res.render('commande', {
        user,
        sectionName: "Commande",
        pageName: "Commande",
        commandes,
        status
    });
}

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

exports.getCMDByClient = async(req, res, next) => {
    const { client_id } = req.body;

    if (!client_id) {
        return res.status(400).json({ message: "Please provide a client id" });
    }
    try {

        const result = await CommandeModel.getCMDByClient(client_id);
        console.log("result are", result)
        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json([]);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
exports.updateStatus = async(req, res, next) => {
    const { id, status } = req.body;
    // console.log(id, status)
    if (!id || !status) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    try {
        const result = await CommandeModel.updateStatus(id, status);
        if (result) {
            return res.status(200).json({ message: "Commande updated successfully" });
        } else {
            return res.status(500).json({ message: "Error updating commande" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}