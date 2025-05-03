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
    static async getCMDByClient(id_client) {
        try {
            const [rows] = await db.execute(
                `SELECT 
                    commande.id, 
                    commande.total AS total_amount, 
                    commande.date_commande, 
                    commande_status.status_en, 
                    commande_status.status_fr, 
                    commande_status.status_ar 
                    FROM commande 
                    JOIN commande_status ON commande.status_id = commande_status.id 
                    WHERE client_id = ?
                    AND commande.status_id NOT IN(5)
                    order by commande.date_commande DESC;`, [id_client]
            );
            if (rows.length === 0) {
                return null;
            }
            // get the products of each commande
            for (const row of rows) {
                const [products] = await db.execute(
                    `SELECT 
                        commande_product.quantity, 
                        product.name_en, 
                        product.name_fr, 
                        product.name_ar
                    FROM commande_product 
                    JOIN product ON commande_product.product_id = product.id 
                    WHERE commande_product.commande_id = ?`, [row.id]
                );
                row.products = products;
            };
            return rows;

        } catch (error) {
            return error;
        }
    }
}