const PacksModel = require('../model/packs');
const ProductModel = require('../model/product');

exports.packsPage = async(req, res, next) => {

    let packs = [];
    let products = [];
    const { success, data } = await PacksModel.getPacks();
    const products_data = await ProductModel.getProducts();
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
        return res.status(200).json({ success: true, data });
    }

    return res.status(500).json({ success: false, message: "Failed to fetch packs" });
}

exports.addPack = async(req, res, next) => {
    const { name, description, products } = req.body;

    console.log(name, description, products)
    if (!name || !description || products.length === 0) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }


    const result = await PacksModel.addPack(name, description, products);

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
    const { id, name, description, products } = req.body;

    if (!id || !name || !description || products.length === 0) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    const result = await PacksModel.updatePack(id, name, description, products);

    if (result.success) {
        return res.status(200).json({ message: "Pack updated successfully!" });
    }

    return res.status(500).json({ message: "Error updating pack", error: result.error });
}