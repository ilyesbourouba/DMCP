exports.productsPage = (req, res, next) => {
    return res.render('products', {
        user: req.user,
        sectionName: "products",
        pageName: "Products"
    });
}