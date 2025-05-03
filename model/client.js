const db = require("../config/DB");

module.exports = class ClientModel {
    constructor() {}

    static async getAll() {
        try {

            const [res] = await db.execute(`SELECT client.* FROM client`);
            if (res.length > 0) return {
                success: true,
                data: res
            };

            return {
                success: true,
                message: "Aucun utilisateur trouvé",
                data: [],
            };
        } catch (error) {
            console.log("error => ", error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async findById(id) {

        try {
            const [res] = await db.execute(`select client.* from client where id = ?`, [id]);

            if (res.length > 0) return res[0];
            return null;
        } catch (error) {
            return error;
        }
    }

    static async getClientByName(name) {

        try {

            const [res] = await db.execute(`select client.* from client where name = ?`, [name]);

            if (res.length > 0) return res[0];
            return null;
        } catch (error) {
            return error;
        }
    }

    static async getUserById(id) {
        try {
            const sql = `select client.* from client where id = ?`;

            const [res] = await db.execute(sql, [id]);
            if (res.length > 0)
                return {
                    success: true,
                    data: res[0]
                };
            return {
                success: false,
                message: "No user found",
                data: []
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            }
        }
    }

    static async getClientByPhoneEmail(phone, mail) {
        try {
            const sql = `SELECT * FROM client WHERE phone = ? OR email = ?`;

            const [res] = await db.execute(sql, [phone, mail]);
            if (res.length > 0) return true;
            return false;
        } catch (error) {
            return error;
        }
    }
    static async getClientByPhoneEmailNotID(phone, mail, id) {
        try {
            const sql = `SELECT * FROM client WHERE (phone = ? OR email = ?) AND id != ?`;

            const [res] = await db.execute(sql, [phone, mail, id]);
            console.log(res);
            if (res.length > 0) return true;
            return false;
        } catch (error) {
            return error;
        }
    }
    static async getClientByPhone(phone) {
        try {
            const sql = `SELECT * FROM client WHERE phone = ? `;

            const [res] = await db.execute(sql, [phone]);
            if (res.length > 0) return [res][0];
            return false;
        } catch (error) {
            return error;
        }
    }
    static async createClient(name, phone, email, adr, password) {
        try {
            const sql = `INSERT INTO client (name, phone, email, adr, password) VALUES (?, ?, ?, ?, ?)`;
            const [res] = await db.execute(sql, [name, phone, email, adr, password]);
            if (res.affectedRows > 0) return {
                success: true,
            };
            return {
                success: false,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            }
        }
    }

    // update client without password
    static async updateClient(id, name, phone, email, adr) {
        try {
            const sql = `UPDATE client SET name = ?, phone = ?, email = ?, adr = ? WHERE id = ?`;
            const [res] = await db.execute(sql, [name, phone, email, adr, id]);

            const sql2 = `select client.* from client where id = ?`;
            const [res2] = await db.execute(sql2, [id]);

            if (res.affectedRows > 0) return res2[0];
            return {
                success: false,
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            }
        }
    }

};