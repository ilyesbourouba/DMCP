const db = require("../config/DB");
const fs = require('fs');
const path = require('path');
require('dotenv').config();
module.exports = class ProductModel {
    constructor() {}

    // Get all products
    static async getProducts() {
            try {
                const [products] = await db.execute(`
                SELECT product.*, category.name_fr AS category_name_fr, category.name_en AS category_name_en, category.name_ar AS category_name_ar
                FROM product 
                JOIN category ON product.category_id = category.id ORDER BY id DESC
            `);

                for (const product of products) {
                    const [images] = await db.execute(`
                    SELECT image_url FROM product_images WHERE product_id = ?
                `, [product.id]);
                    product.images = images.map(img => img.image_url);

                    const [features] = await db.execute(`
                    SELECT feature_fr, price FROM product_feature WHERE product_id = ?
                `, [product.id]);
                    // Return features as objects {name, price} for frontend to use
                    product.features = features.map(f => ({
                        name: f.feature_fr,
                        price: f.price !== null ? parseFloat(f.price) : null
                    }));
                }

                return { success: true, data: products };
            } catch (error) {
                console.log("error => ", error);
                return { success: false, error: error.message };
            }
        }
        // get getProductsForPacks
    static async getProductsForPacks() {
        try {
            const [products] = await db.execute(`
                SELECT product.id, product.name_fr, product.price
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
                SELECT product.*, category.name_fr AS category_name 
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

    /**
     * Parse a features string like "ALCO GEL 1L:400, ALCO GEL 5L:600, ALCO GEL 250ML"
     * into an array of {name, price} objects.
     */
    static _parseFeatures(prefsStr) {
        return prefsStr.split(",").map(item => {
            const parts = item.trim().split(":");
            const name = parts[0].trim();
            const price = parts.length > 1 && parts[1].trim() !== '' ? parseFloat(parts[1].trim()) : null;
            return { name, price };
        }).filter(f => f.name.length > 0);
    }

    static async addProduct(name_fr, name_en, name_ar, category, description_fr, description_ar, description_en, price, stock, best_selling, top_rating, new_product, image_names, prefs) {
        best_selling = best_selling == "true" ? 1 : 0;
        top_rating = top_rating == "true" ? 1 : 0;
        new_product = new_product == "true" ? 1 : 0;

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const [res] = await connection.execute(`
                INSERT INTO product (name_fr, name_en, name_ar, category_id,  desc_fr, desc_ar, desc_en, price, stock, best_selling, top_rating, new_product)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [name_fr, name_en, name_ar, category, description_fr, description_ar, description_en, price, stock, best_selling, top_rating, new_product]);

            const productId = res.insertId;

            const parsedFeatures = ProductModel._parseFeatures(prefs);
            if (parsedFeatures.length > 0) {
                const prefValues = parsedFeatures.map(f => [productId, f.name, f.price]);
                await connection.query(`
                    INSERT INTO product_feature (product_id, feature_fr, price) VALUES ?`, [prefValues]);
            }

            if (image_names.length > 0) {
                const imageValues = image_names.map(img => [productId, process.env.IMAGE_PATH + img]);
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
    static async updateProduct(id, name_fr, name_ar, name_en, desc_fr, desc_ar, desc_en, category, price, stock, best_selling, new_product, top_rating, image_names, prefs) {
        best_selling = best_selling == "true" ? 1 : 0;
        top_rating = top_rating == "true" ? 1 : 0;
        new_product = new_product == "true" ? 1 : 0;

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            await connection.execute(`
                UPDATE product SET name_fr = ?,name_ar = ?,name_en = ?, desc_fr = ?, desc_ar = ?, desc_en = ?, category_id = ?, price = ?, stock = ?, best_selling = ?, new_product = ?, top_rating = ?
                WHERE id = ?`, [name_fr, name_ar, name_en, desc_fr, desc_ar, desc_en, category, price, stock, best_selling, new_product, top_rating, id]);

            if (image_names.length > 0) {
                const imageValues = image_names.map(img => [id, process.env.IMAGE_PATH + img]);
                await connection.query(`
                    INSERT INTO product_images (product_id, image_url) VALUES ?`, [imageValues]);
            }

            const parsedFeatures = ProductModel._parseFeatures(prefs);
            // Delete old features and re-insert with new price info
            await connection.query(`DELETE FROM product_feature WHERE product_id = ?`, [id]);

            if (parsedFeatures.length > 0) {
                const prefValues = parsedFeatures.map(f => [id, f.name, f.price]);
                await connection.query(`
                    INSERT INTO product_feature (product_id, feature_fr, price) VALUES ?`, [prefValues]);
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