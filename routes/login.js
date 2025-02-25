const express = require('express');

const router = express.Router();
const { loginPage } = userController;
const { LogIn, LogOut } = authController;

router.get("/", (req, res, next) => {
   
    if (req.user)
        res.redirect('/api/rma');
    else
        next();
}, loginPage);

router.post("/login", login_validation_rules, login_validation_result, try_catch(LogIn));
router.get('/logout',  LogOut);

module.exports = router;