const db = require("../config/DB");

module.exports = class CommandeModel {
    constructor() {}

    static async createCMD(client_id, total_amount, products) {
        try {
            const [result] = await db.execute(
                `INSERT INTO commande (client_id, total) VALUES (?, ?)`, [client_id, total_amount]
            );

            const commande_id = result.insertId;

            for (const product of products) {
                await db.execute(
                    `INSERT INTO commande_product (commande_id, product_id, quantity) VALUES (?, ?, ?)`, [commande_id, product.product_id, product.quantity]
                );
            }
            // i want to delete the panier of the client after creating the commande
            await db.execute(
                `DELETE FROM panier WHERE client_id = ?`, [client_id]
            );

            return true;
        } catch (error) {
            return error;
        }
    }
}