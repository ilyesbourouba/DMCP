const PacksModel = require('../model/packs');

exports.packsPage = async(req, res, next) => {

    const { success, data } = await PacksModel.getPacks();
    let packs = [];
    if (success) {
        packs = data;
    }

    return res.render('packs', {
        user: req.user,
        sectionName: "Packs",
        pageName: "Packs",
        packs
    });
}

exports.getpacks = async(req, res, next) => {

    const { success, data } = await PacksModel.getPacks();

    if (success) {
        return res.status(200).json({ success: true, data });
    }

    return res.status(500).json({ success: false, message: "Failed to fetch packs" });
}
