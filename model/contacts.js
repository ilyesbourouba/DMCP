// create a model for category
const db = require("../config/DB");
require('dotenv').config();
module.exports = class CategoryModel {
    constructor() { }

    static async getContacts() {
        try {
            const [res] = await db.execute(`SELECT * FROM contacts where id = 1`);
            return {
                success: true,
                data: res
            };
        } catch (error) {
            console.log("error => ", error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async updateContacts(phone, adr, mail, facebook, instagram, google_play, ios) {
        try {
            const [res] = await db.execute(`UPDATE contacts SET phone = ?, email = ?, address = ?, facebook = ?, instagram = ?, google_store = ?, apple_store = ? WHERE id = 1`, [phone, mail, adr, facebook, instagram, google_play, ios]);
            return {
                success: true,
                data: res
            };
        } catch (error) {
            console.log("error => ", error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}