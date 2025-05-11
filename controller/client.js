const bcrypt = require('bcryptjs/dist/bcrypt');
const ClientModel = require('../model/client');


exports.clientPage = async (req, res, next) => {
    const { user } = req;
    // get client list
    const { success, data } = await ClientModel.getAll();
    let clients = [];
    if (success) {
        clients = data;
    }
    return res.render('client', {
        user,
        sectionName: "Client",
        pageName: "Client",
        clients
    });
}

exports.checkLogin = async (req, res, next) => {

    const { phone, password } = req.body;

    try {
        console.log(phone, password);

        if (!phone || !password) {
            return res.status(400).json({ message: "empty_fields" });
        }

        const [client] = await ClientModel.getClientByPhone(phone.trim());
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

exports.registerClient = async (req, res, next) => {
    const { username, phone, email, adr, wilaya, password } = req.body;
    try {
        if (!username || !phone || !email || !adr || !password) {
            return res.status(400).json({ message: "empty_fields" });
        }
        console.log("****************************")
        console.log("wilaya => ", wilaya);
        console.log("****************************")

        const client = await ClientModel.getClientByPhoneEmail(phone.trim(), email.trim());
        console.log(client)

        if (client)
            return res.status(400).json({ message: "user_exists" });

        const hashedPassword = await bcrypt.hashSync(password.trim(), 10);


        const data = await ClientModel.createClient(username.trim(), phone.trim(), email.trim(), adr.trim(), hashedPassword);

        console.log(data)

        return res.status(201).json("registred");

    } catch (error) {
        return res.status(500).json({ message: "server_error" });
    }

}

// update client 
exports.updateClient = async (req, res, next) => {
    const { id, username, phone, email, adr } = req.body;
    try {
        console.log(id, username, phone, email, adr);
        if (!id || !username || !phone || !email || !adr) {
            return res.status(400).json("empty_fields");
        }
        // check if the new phone or email don"t exist
        const clientNew = await ClientModel.getClientByPhoneEmailNotID(phone, email, id);
        console.log("clientNew => ", clientNew);

        if (clientNew)
            return res.status(400).json({ message: "user_exists" });

        const data = await ClientModel.updateClient(id, username.trim(), phone.trim(), email.trim(), adr.trim());

        console.log(data);

        return res.status(200).json({ message: "client_updated", data });

    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: "server_error" });
    }
}