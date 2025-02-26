exports.dashBoardPage = (req, res, next) => {
    return res.render('dashboard', {
        user: req.user,
        sectionName: "Dashboard",
        pageName: "bashboard"
    });
}