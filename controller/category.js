const CategoryModel = require('../model/category');

exports.categoryPage = async(req, res, next) => {

    const { success, data } = await CategoryModel.getCategories();
    let category = [];
    if (success) {
        category = data;
    }

    return res.render('category', {
        user: req.user,
        sectionName: "Category",
        pageName: "Category",
        category
    });
}

exports.getCategory = async(req, res, next) => {
    const { success, data } = await CategoryModel.getCategories();

    if (success) {
        console.table(data);
        return res.status(200).json(data);
    }
    return res.status(400).json({ message: "something went wrong" });
}

exports.getCategoryById = async(req, res, next) => {
    const id = req.params.id;

    if (!id) return res.status(400).json({ message: "Please provide a category id" });

    const { success, data } = await CategoryModel.getCategoryById(id);
    if (success) {
        console.table(data);
        return res.status(200).json(data);
    }
    return res.status(400).json({ message: "something went wrong" });
}
exports.addCategory = async(req, res, next) => {
    const { name_fr, name_ar, name_en } = req.body;

    if (!name_fr || !name_ar || !name_en) return res.status(400).json({ message: "Please fill in all fields" });


    const { data } = await CategoryModel.getCategories();
    const categoryExists = data.find(category => category.name_fr.toUpperCase() === name_fr.toUpperCase());
    if (categoryExists) return res.status(400).json({ message: "Category already exists" });

    const image_name = req.files.map(file => file.filename);
    if (image_name.length === 0) image_name[0] = "";
    const { success } = await CategoryModel.addCategory(name_fr, name_ar, name_en, image_name);
    if (success) {
        return res.status(200).json(success);
    }
    return res.status(400).json({ message: "something went wrong" });
}

exports.updateCategory = async(req, res, next) => {
    const { id, name_fr, name_en, name_ar } = req.body;

    if (!id || !name_fr || !name_en || !name_ar) return res.status(400).json({ message: "Please provide all fields" });

    // check if the id exists
    const { data } = await CategoryModel.getCategories();
    const categoryExists = data.find(category => category.name_fr.toUpperCase() === name_fr.toUpperCase());
    if (categoryExists && categoryExists.id != id) return res.status(400).json({ message: "Category already exists" });

    const image_name = req.files.map(file => file.filename);
    if (image_name.length == 0) {
        image_name[0] = "";
    }
    console.log(id, name_fr, name_en, name_ar, image_name)
    const { success } = await CategoryModel.updateCategory(id, name_fr, name_en, name_ar, image_name[0]);
    if (success) {
        console.table(success);
        return res.status(200).json(success);
    }
    return res.status(400).json({ message: "something went wrong" });
}

exports.deleteCategory = async(req, res, next) => {
    const { id } = req.body;

    if (!id) return res.status(400).json({ message: "Please provide a category id" });

    const { data } = await CategoryModel.getCategoryById(id);
    console.log(data)
    if (data.length == 0) return res.status(400).json({ message: "Category not found" });

    const { success } = await CategoryModel.deleteCategory(id);
    if (success) {
        console.table(success);
        return res.status(200).json(success);
    }
    return res.status(400).json({ message: "something went wrong" });
}

// delete product image
exports.deleteCategoryIMAGE = async(req, res) => {
    const { id, image } = req.body;

    if (!id || !image) return res.status(400).json({ message: "Please provide a Category id and image" });

    const result = await CategoryModel.deleteIMAGE(id);

    if (result.success) {
        return res.status(200).json({ message: "Category image deleted successfully!", success: result.success });
    }
    return res.status(500).json({ message: "Error deleting Category image", error: result.error });
};