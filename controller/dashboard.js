exports.dashboardPage = async(req, res, next) => {
    res.render('dashboard', {
        user: req.user,
        sectionName: 'Dashboard',
        pageName: 'Dashboard'
    });
}