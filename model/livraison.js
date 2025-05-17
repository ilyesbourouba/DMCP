const db = require("../config/DB");

module.exports = class LivraisonModel {
    constructor() { }

    static async getPrices() {
        try {
            const [price] = await db.execute(`SELECT 
                                                l.wilaya, 
                                                w.name AS wilaya_name, 
                                                l.price
                                            FROM 
                                                livraison l
                                            JOIN 
                                                wilaya w ON l.wilaya = w.id;
`);

            if (price.length > 0) return price;
            return null;
        } catch (error) {
            return error
        }
    }
    // update price
    static async updatePrice(wilaya, price) {
        try {
            const [result] = await db.execute(`UPDATE livraison SET price = ? where wilaya = ?;`, [price, wilaya]);
            if (result.affectedRows > 0) return true;
            return false;
        } catch (error) {
            return error
        }
    }
}