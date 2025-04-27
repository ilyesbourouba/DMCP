const db = require("../config/DB");

module.exports = class PanierModel {
    constructor() {}

    static async getAll() {
        try {
            const [res] = await db.execute(`SELECT * FROM panier`);
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

    static async getByClientId(clientId) {
        try {
            const [paniers] = await db.execute(`SELECT product.id, product.name_fr, product.name_en, product.name_ar, product.price, panier.quantity 
                                            FROM panier 
                                            JOIN product ON product.id = panier.product_id WHERE panier.client_id = 1;`, [clientId]);

            for (const panier of paniers) {
                const [images] = await db.execute(`
                                SELECT image_url FROM product_images WHERE product_id = ? LIMIT 1
                            `, [panier.id]);
                console.log(images[0]["image_url"]);
                panier.imageUrl = images[0]["image_url"];
            }
            return { success: true, data: paniers };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async addToPanier(clientId, productId, quantity) {
        try {
            const sql = `INSERT INTO panier (client_id, product_id, quantity) VALUES (?, ?, ?)`;
            const [res] = await db.execute(sql, [clientId, productId, quantity]);
            if (res.affectedRows > 0) return {
                success: true,
            };
            return {
                success: false,
                message: "Failed to add to panier."
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async updatePanier(clientId, productId, quantity) {
        try {
            const sql = `UPDATE panier SET quantity = ? WHERE client_id = ? AND product_id = ?`;
            const [res] = await db.execute(sql, [quantity, clientId, productId]);
            if (res.affectedRows > 0) return {
                success: true,
            };
            return {
                success: false,
                message: "No panier entry updated."
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async deleteFromPanier(clientId, productId) {
        try {
            const sql = `DELETE FROM panier WHERE client_id = ? AND product_id = ?`;
            const [res] = await db.execute(sql, [clientId, productId]);
            if (res.affectedRows > 0) return {
                success: true,
            };
            return {
                success: false,
                message: "No panier entry deleted."
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async find(clientId, productId) {
        try {
            const sql = `SELECT * FROM panier WHERE client_id = ? AND product_id = ?`;
            const [res] = await db.execute(sql, [clientId, productId]);
            if (res.length > 0) return res[0];
            return null;
        } catch (error) {
            return error;
        }
    }
};