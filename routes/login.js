const express = require('express');
const passport = require('passport');

const userController = require("../controller/user");

const router = express.Router();
const { loginPage } = userController;

// Login Page
router.get("/", (req, res, next) => {
        next();
}, loginPage);

// Login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
}));

// Logout
router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
});

// Middleware to check authentication
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

module.exports = router;