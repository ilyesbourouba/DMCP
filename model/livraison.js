const db = require("../config/DB");

module.exports = class LivraisonModel {
    constructor() {}

    static async getPrice() {
            try {
                const [price] = await db.execute(`SELECT price FROM livraison;`);
                if (price.length > 0) return price;
                return null;
            } catch (error) {
                return error
            }
        }
        // update price
    static async updatePrice(price) {
        try {
            const [result] = await db.execute(`UPDATE livraison SET price = ?;`, [price]);
            if (result.affectedRows > 0) return true;
            return false;
        } catch (error) {
            return error
        }
    }
}