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
    const { name, description } = req.body;

    if (!name || !description) return res.status(400).json({ message: "Please fill in all fields" });


    const { data } = await CategoryModel.getCategories();
    const categoryExists = data.find(category => category.name.toUpperCase() === name.toUpperCase());
    if (categoryExists) return res.status(400).json({ message: "Category already exists" });

    const { success } = await CategoryModel.addCategory(name, description);
    if (success) {
        console.table(success);
        return res.status(200).json(success);
    }
    return res.status(400).json({ message: "something went wrong" });
}

exports.updateCategory = async(req, res, next) => {
    const { id, name, description } = req.body;

    if (!id || !name || !description) return res.status(400).json({ message: "Please provide all fields" });
    // check if the id exists
    const { data } = await CategoryModel.getCategoryById(id);
    console.log(data)
    if (data.length == 0) return res.status(400).json({ message: "Category not found" });

    const { success } = await CategoryModel.updateCategory(id, name, description);
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