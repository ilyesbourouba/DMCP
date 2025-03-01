const db = require("../config/DB");

module.exports = class UserModel {
    constructor() {}

    // Get all products
    static async getProducts() {
        try {
            const [rows] = await db.execute(`SELECT product.*, category.name as category_name FROM product 
                                             JOIN category ON product.category_id = category.id`);
            return {
                success: true,
                data: rows
            };
        } catch (error) {
            console.log("error => ", error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    static async addProduct(name, category, description, price, stock, best_selling, image_names) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Insérer le produit
            const [res] = await connection.execute(`
                INSERT INTO product (name, category_id, description, price, stock, best_selling)
                VALUES (?, ?, ?, ?, ?, ?)`, [name, category, description, price, stock, best_selling]);

            const productId = res.insertId; // ID du produit ajouté

            // Insérer les images
            if (image_names.length > 0) {
                const imageValues = image_names.map(img => [productId, img]);
                await connection.query(`
                    INSERT INTO product_images (product_id, image_url) VALUES ?`, [imageValues]);
            }

            await connection.commit();
            connection.release();

            return { success: true, data: res };
        } catch (error) {
            await connection.rollback();
            connection.release();
            return { success: false, error: error.message };
        }
    }



}