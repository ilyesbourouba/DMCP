const db = require("../config/DB");

module.exports = class ClientModel {
    constructor() { }

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
    static async getClientByEmail(mail) {
        try {
            const sql = `SELECT * FROM client WHERE email = ? `;

            const [res] = await db.execute(sql, [mail]);
            if (res.length > 0) return [res][0];
            return false;
        } catch (error) {
            return error;
        }
    }
    static async createClient(name, phone, email, nif, adr, wilaya, password) {
        try {
            const sql = `INSERT INTO client (name, phone, email, nif, adr, wilaya, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const [res] = await db.execute(sql, [name, phone, email, nif, adr, wilaya, password]);
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
    static async updateClient(id, name, phone, email, adr, wilaya) {
        try {
            const sql = `UPDATE client SET name = ?, phone = ?, email = ?, adr = ?, wilaya = ? WHERE id = ? `;
            const [res] = await db.execute(sql, [name, phone, email, adr, wilaya, id]);

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
    static async updateClientCode(id, code) {
        try {
            const sql = `UPDATE client SET reset = ? WHERE id = ? `;
            const [res] = await db.execute(sql, [code, id]);

            if (res.affectedRows > 0) return true;
            return false;
        } catch (error) {
            return error;
        }
    }
    static async checkCode(code) {
        try {
            const sql = `SELECT * FROM client WHERE reset = ? `;
            const [res] = await db.execute(sql, [code]);

            if (res.length > 0) return true;
            return false;
        } catch (error) {
            return error;
        }
    }
    static async updateClientPassword(code, password) {
        try {
            const sql = `UPDATE client SET password = ?, reset = NULL WHERE reset = ? `;
            const [res] = await db.execute(sql, [password, code]);

            if (res.affectedRows > 0) return true;
            return false;
        } catch (error) {
            return error;
        }
    }

    static async deleteClient(id) {
        try {
            // update the client phone and email to 00
            const sql = `UPDATE client SET phone = '00', email = '00', google_id= "00" WHERE id = ? `;
            const [res] = await db.execute(sql, [id]);

            if (res.affectedRows > 0) return true;
            return false;
        } catch (error) {
            return error;
        }
    }

    static async findByGoogleId(googleId) {
        const [rows] = await db.execute(
            `SELECT * FROM client WHERE google_id = ? LIMIT 1`,
            [googleId]
        );
        return rows[0] || null;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute(
            `SELECT * FROM client WHERE email = ? LIMIT 1`,
            [email]
        );
        return rows[0] || null;
    }

    static async createGoogleClient(name, email, googleId) {
        console.log("Creating Google client with name:", name, "email:", email, "googleId:", googleId);
        try {
            const sql = `INSERT INTO client (name, phone, password, email, adr, wilaya, token, google_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            const [res] = await db.execute(sql, [name, "0000000000", "$2a$10$6W7bA.8Z2QO9g0V22LR6IO0QASkx20Mzzrd35K/44pk7a0r0BucDm", email, "alger", "16", "10", googleId]);
            if (res.affectedRows > 0) {
                const [newClient] = await db.execute(`SELECT * FROM client WHERE google_id = ?`, [googleId]);
                return {
                    success: true,
                    data: newClient[0]
                };
            }
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

    static async linkGoogleId(id, googleId) {
        await db.execute(
            `UPDATE client SET google_id = ? WHERE id = ?`,
            [googleId, id]
        );
    }
};