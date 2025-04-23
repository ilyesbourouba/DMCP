const db = require("../config/DB");
const fs = require('fs');
const path = require('path');

module.exports = class ProductModel {
    constructor() {}

    // Get all products
    static async getProducts() {
        try {
            const [products] = await db.execute(`
                SELECT product.*, category.name AS category_name 
                FROM product 
                JOIN category ON product.category_id = category.id ORDER BY id DESC
            `);

            for (const product of products) {
                const [images] = await db.execute(`
                    SELECT image_url FROM product_images WHERE product_id = ?
                `, [product.id]);
                product.images = images.map(img => img.image_url);
            }

            return { success: true, data: products };
        } catch (error) {
            console.log("error => ", error);
            return { success: false, error: error.message };
        }
    }

    //get product by id
    static async getProductById(id) {
        try {
            const [products] = await db.execute(`
                SELECT product.*, category.name AS category_name 
                FROM product 
                JOIN category ON product.category_id = category.id
                WHERE product.id = ?
            `, [id]);

            if (products.length === 0) return { success: false, error: "Product not found" };

            const product = products[0];

            const [images] = await db.execute(`
                SELECT image_url FROM product_images WHERE product_id = ?
            `, [id]);

            product.images = images.map(img => img.image_url);

            return { success: true, data: product };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async addProduct(name, category, description, price, stock, best_selling, image_names) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [res] = await connection.execute(`
                INSERT INTO product (name_fr, category_id, description, price, stock, best_selling)
                VALUES (?, ?, ?, ?, ?, ?)`, [name, category, description, price, stock, best_selling]);

            const productId = res.insertId; // ID du produit ajouté

            if (image_names.length > 0) {
                const imageValues = image_names.map(img => [productId, img]);
                await connection.query(`
                    INSERT INTO product_images (product_id, image_url) VALUES ?`, [imageValues]);
            }

            await connection.commit();
            connection.release();

            return { success: true };
        } catch (error) {
            await connection.rollback();
            connection.release();
            return { success: false, error: error.message };
        }
    }

    // delete product
    static async deleteProduct(id) {
            try {

                const [images] = await db.execute(`SELECT image_url FROM product_images WHERE product_id = ?`, [id]);

                images.forEach(img => {
                    const imagePath = path.join(__dirname, '../uploads', img.image_url);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                });

                await db.execute(`DELETE FROM product_images WHERE product_id = ?`, [id]);

                await db.execute(`DELETE FROM product WHERE id = ?`, [id]);

                return { success: true };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }
        // delete product image
    static async deleteProductIMAGE(id, image) {
            try {
                const imagePath = path.join(__dirname, "../uploads/", image);
                console.log("imagePath => ", imagePath);

                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }

                const [res] = await db.execute(`DELETE FROM product_images WHERE product_id = ? AND image_url = ?`, [id, image]);
                if (res.affectedRows === 0) return { success: false, error: "Image not found" };
                return { success: true };

            } catch (error) {
                return { success: false, error: error.message };
            }
        }
        // update product
    static async updateProduct(id, name, category, description, price, stock, best_selling, image_names) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            await connection.execute(`
                UPDATE product SET name_fr = ?, category_id = ?, description = ?, price = ?, stock = ?, best_selling = ?
                WHERE id = ?`, [name, category, description, price, stock, best_selling, id]);

            if (image_names.length > 0) {

                const imageValues = image_names.map(img => [id, img]);
                await connection.query(`
                    INSERT INTO product_images (product_id, image_url) VALUES ?`, [imageValues]);
            }

            await connection.commit();
            connection.release();

            return { success: true };
        } catch (error) {
            await connection.rollback();
            connection.release();
            return { success: false, error: error.message };
        }
    }
}