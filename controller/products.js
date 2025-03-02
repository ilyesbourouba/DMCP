const ProductModel = require('../model/product');
const CategoryModel = require('../model/category');

exports.productsPage = async(req, res, next) => {

    let products = [];
    let category = [];

    const { success, data } = await ProductModel.getProducts();
    const Categories = await CategoryModel.getCategories();

    if (Categories.success) category = Categories.data;
    if (success) products = data;

    console.log(products)
    return res.render('products', {
        user: req.user,
        sectionName: "products",
        pageName: "Products",
        products,
        category
    });
}

exports.addProduct = async(req, res) => {
    const { name, category, description, price, stock, best_selling } = req.body;

    if (!name || !category || !description || !price || !stock || best_selling === undefined) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }
    console.log("addProduct => ", name, category, description, price, stock, best_selling);

    const image_names = req.files.map(file => file.filename);

    const result = await ProductModel.addProduct(name, category, description, price, stock, best_selling, image_names);

    if (result.success) {
        return res.status(200).json({ message: "Product added successfully!", images: image_names });
    }
    return res.status(500).json({ message: "Error adding product", error: result.error });
};

// delete product
exports.deleteProduct = async (req, res) => {
    const { id } = req.body;

    if (!id) return res.status(400).json({ message: "Please provide a product id" });

    const { data } = await ProductModel.getProductById(id);
    if (data.length == 0) return res.status(400).json({ message: "Product not found" });

    const result = await ProductModel.deleteProduct(id);

    if (result.success) {
        return res.status(200).json({ message: "Product deleted successfully!" });
    }
    return res.status(500).json({ message: "Error deleting product", error: result.error });
};
