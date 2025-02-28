exports.productsPage = (req, res, next) => {
    return res.render('products', {
        user: req.user,
        sectionName: "products",
        pageName: "Products"
    });
}

exports.addProduct = (req, res, next) => {
    const { name, category, description, price, stock, best_selling } = req.body;
    console.log(name, category, description, price, stock, best_selling)
        // check if all fields are filled
    if (!name || !category || !description || !price || !stock || !best_selling) {
        console.log('Please fill in all fields')
        req.flash('error_msg', 'Please fill in all fields');
        return res.redirect('/products');
    }
    // check if price is a number
    if (isNaN(price)) {
        console.log('Price must be a number')
        req.flash('error_msg', 'Price must be a number');
        return res.redirect('/products');
    }
    // check if stock is a number
    if (isNaN(stock)) {
        console.log('Stock must be a number')
        req.flash('error_msg', 'Stock must be a number');
        return res.redirect('/products');
    }
    // check if best_selling is a boolean value
    if (best_selling !== 'true' && best_selling !== 'false') {
        console.log('Best Selling must be a boolean value')
        req.flash('error_msg', 'Best Selling must be a boolean value');
        return res.redirect('/products');
    }
    // if all fields are filled, price is a number, stock is a number, and best_selling is a boolean value
    console.log('Product added successfully')

}