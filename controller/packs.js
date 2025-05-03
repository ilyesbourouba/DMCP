const PacksModel = require('../model/packs');
const ProductModel = require('../model/product');

exports.packsPage = async(req, res, next) => {

    let packs = [];
    let products = [];
    const { success, data } = await PacksModel.getPacks();
    const products_data = await ProductModel.getProductsForPacks();
    if (products_data.success) products = products_data.data;

    if (success) {
        packs = data;
    }
    console.log(packs)
    return res.render('packs', {
        user: req.user,
        sectionName: "Packs",
        pageName: "Packs",
        packs,
        products
    });
}

exports.getpacks = async(req, res, next) => {

    const { success, data } = await PacksModel.getPacks();

    if (success) {
        return res.status(200).json(data);
    }

    return res.status(500).json({ success: false, message: "Failed to fetch packs" });
}

exports.addPack = async(req, res, next) => {
    const { name_fr, name_ar, name_en, description_fr, description_ar, description_en, products } = req.body;

    if (!name_fr || !name_ar || !name_en || !description_fr || !description_ar || !description_en || !products === 0) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    const image_name = req.files.map(file => file.filename);
    console.log(image_name)

    if (image_name.length === 0) image_name[0] = "";
    const result = await PacksModel.addPack(name_fr, name_ar, name_en, description_fr, description_ar, description_en, products, image_name[0]);

    if (result.success) {
        return res.status(200).json({ message: "Pack added successfully!" });
    }

    return res.status(500).json({ message: "Error adding pack", error: result.error });
}

exports.deletePack = async(req, res, next) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Invalid request" });
    }

    const result = await PacksModel.deletePack(id);

    if (result.success) {
        return res.status(200).json({ message: "Pack deleted successfully!" });
    }

    return res.status(500).json({ message: "Error deleting pack", error: result.error });
}

exports.updatePack = async(req, res, next) => {
        const { id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, products } = req.body;
        console.log("products are => ", products);
        console.log(products);
        if (!id || !name_fr || !name_ar || !name_en || !description_fr || !description_ar || !description_en || !products.length === 0) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const image_name = req.files.map(file => file.filename);
        if (image_name.length == 0) {
            image_name[0] = "";
        }
        const result = await PacksModel.updatePack(id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, products, image_name[0]);

        if (result.success) {
            return res.status(200).json({ message: "Pack updated successfully!" });
        }

        return res.status(500).json({ message: "Error updating pack", error: result.error });
    }
    // addToPanier(clientId, packId) conttroler system :
exports.addToPanier = async(req, res, next) => {
    const { client_id, pack_id } = req.body;
    if (!client_id || !pack_id) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    const result = await PacksModel.addToPanier(client_id, pack_id);
    if (result) {
        return res.status(200).json({ message: "Pack added to panier successfully!" });
    }
    return res.status(500).json({ message: "Error adding pack to panier", error: result.error });
}

exports.deletePacksIMAGE = async(req, res) => {
    const { id, image } = req.body;

    if (!id || !image) return res.status(400).json({ message: "Please provide a Packs id and image" });

    const result = await PacksModel.deleteIMAGE(id);

    if (result.success) {
        return res.status(200).json({ message: "Packs image deleted successfully!", success: result.success });
    }
    return res.status(500).json({ message: "Error deleting Packs image", error: result.error });
};