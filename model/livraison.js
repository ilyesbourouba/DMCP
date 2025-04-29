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
}