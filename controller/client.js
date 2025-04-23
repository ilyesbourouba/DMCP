const bcrypt = require('bcryptjs/dist/bcrypt');
const ClientModel = require('../model/client');


exports.loginPage = (req, res, next) => {
    return res.render('login', {
        error: req.query.error
    });
}

exports.checkLogin = async(req, res, next) => {

    const { username, password } = req.body;

    try {
        console.log(username, password);

        if (!username || !password) {
            return res.status(400).json({ message: "empty_fields" });
        }

        const client = await ClientModel.getClientByName(username.trim());
        console.log(client)

        if (client == null)
            return res.status(400).json({ message: "user_not_found" });

        if (bcrypt.compareSync(password.trim(), client.password))
            return res.status(200).json(client);

        return res.status(400).json({ message: "invalid_credentials" });

    } catch (error) {
        return res.status(500).json({ message: "server_error" });
    }


}

exports.registerClient = async(req, res, next) => {
    const { username, phone, email, password } = req.body;
    try {
        if (!username || !phone || !email || !password) {
            return res.status(400).json({ message: "empty_fields" });
        }

        const client = await ClientModel.getClientByPhoneEmail(phone.trim(), email.trim());
        console.log(client)

        if (client)
            return res.status(400).json({ message: "user_exists" });

        const hashedPassword = await bcrypt.hashSync(password.trim(), 10);


        const data = await ClientModel.createClient(username.trim(), phone.trim(), email.trim(), hashedPassword);

        console.log(data)

        return res.status(200).json("client registred successfully! Please login to continue.");

    } catch (error) {
        return res.status(500).json({ message: "server_error" });
    }

}