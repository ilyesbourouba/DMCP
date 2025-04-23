exports.loginPage = (req, res, next) => {
    return res.render('login', {
        error: req.query.error
    });
}

exports.checkLogin = (req, res, next) => {

    const { username, password } = req.body;
    console.log(username, password);

    if (username.trim() == "123" && password.trim() == "123")
        res.status(200).json({
            id: "1",
            username: "ilyes",
            email: "ilyes@gmail.com",
            img: "link img",
            token: "dfghjkl;kjhgjkl;jhgjkl"
        });
    else res.status(500).json(false);

}

exports.registerUser = (req, res, next) => {
    const { username, phone, email, password } = req.body;
    console.log(username, phone, email, password)
    if (!username || !phone || !email || !password) {
        return res.status(400).json({ message: "empty_fields" });
    }
    if (phone == "123456" || email == "sarah") {
        return res.status(400).json({ message: "already_exists" });
    } else {
        return res.status(201).json("success");
    }

}