exports.loginPage = (req, res, next) => {
    return res.render('login', {
        error: req.query.error
    });
}