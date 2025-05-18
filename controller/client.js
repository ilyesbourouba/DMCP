const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs/dist/bcrypt');
const ClientModel = require('../model/client');
require("dotenv").config();

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


        const data = await ClientModel.createClient(username.trim(), phone.trim(), email.trim(), adr.trim(), wilaya, hashedPassword);

        console.log(data)

        return res.status(201).json("registred");

    } catch (error) {
        return res.status(500).json({ message: "server_error" });
    }

}

// update client 
exports.updateClient = async (req, res, next) => {
    const { id, username, phone, email, adr, wilaya } = req.body;
    try {
        console.log(id, username, phone, email, adr, wilaya);
        if (!id || !username || !phone || !email || !adr || !wilaya) {
            return res.status(400).json("empty_fields");
        }
        // check if the new phone or email don"t exist
        const clientNew = await ClientModel.getClientByPhoneEmailNotID(phone, email, id);
        console.log("clientNew => ", clientNew);

        if (clientNew)
            return res.status(400).json({ message: "user_exists" });

        const data = await ClientModel.updateClient(id, username.trim(), phone.trim(), email.trim(), adr.trim(), wilaya);

        console.log(data);

        return res.status(200).json({ message: "client_updated", data });

    } catch (error) {
        console.error(error);

        return res.status(500).json({ message: "server_error" });
    }
}

exports.forgetPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: "empty_fields" });
        }

        let client = await ClientModel.getClientByEmail(email.trim());

        if (!client) return res.status(400).json({ message: "user not found" });

        client = client[0];
        console.log("client => ", client);
        // generate a unique code with 5 digits
        const code = Math.floor(10000 + Math.random() * 90000);
        console.log("code => ", code);
        // send the code to the client email
        const mailer = await sendEmail(email, code);
        console.log("mailer => ", mailer);
        if (!mailer) return res.status(400).json({ message: "email not sent" });

        // save the code in the database
        const data = await ClientModel.updateClientCode(client.id, code);
        console.log(data);
        if (!data)
            return res.status(400).json({ message: "user not found" });
        return res.status(200).json({ message: "code_sent" });


    } catch (error) {
        return res.status(500).json({ message: "server error" });
    }
}

// create the function to send email
const sendEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.mail,
            pass: process.env.mail_password
        }
    });
    const mailOptions = {
        from: 'DMCP support <' + process.env.mail + '>',
        to: email,
        subject: 'DMCP - Password Reset Code',
        text: `Hello, \n\n Your password reset code is: ${code} \n\n If you didn't request this code, please ignore this email. \n\n Thank you, \n DMCP Team`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.log('Error sending email:', error);
        return false;
    }
}

// check if the code is correct
exports.checkCode = async (req, res, next) => {
    const { code } = req.body;
    try {

        console.log("code => ", code);
        if (!code)
            return res.status(400).json({ message: "empty fields" });

        let checkCode = await ClientModel.checkCode(code.trim());
        console.log(checkCode);

        if (!checkCode)
            return res.status(400).json({ message: "invalid code" });

        return res.status(200).json({ message: "code_valid" });
    }
    catch (error) {
        return res.status(500).json({ message: "server error" });
    }

}

exports.resetPassword = async (req, res, next) => {
    const { code, password } = req.body;
    try {
        console.log("code => ", code);
        console.log("password => ", password);
        if (!code || !password)
            return res.status(400).json({ message: "empty_fields" });

        let checkCode = await ClientModel.checkCode(code.trim());
        console.log("checkCode => ", checkCode);

        if (!checkCode)
            return res.status(400).json({ message: "invalid code" });

        const hashedPassword = await bcrypt.hashSync(password.trim(), 10);
        const data = await ClientModel.updateClientPassword(code.trim(), hashedPassword);
        console.log("updated result => ", data);
        if (!data)
            return res.status(400).json({ message: "user not found" });
        return res.status(200).json({ message: "password_updated" });
    }
    catch (error) {
        return res.status(500).json({ message: "server_error" });
    }
}
exports.deleteClient = async (req, res, next) => {
    const { id } = req.body;
    try {
        if (!id) {
            return res.status(400).json({ message: "empty_fields" });
        }
        const data = await ClientModel.deleteClient(id);
        console.log(data);
        if (!data)
            return res.status(400).json({ message: "user not found" });
        return res.status(200).json({ message: "client_deleted" });
    } catch (error) {
        return res.status(500).json({ message: "server_error" });
    }
}