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
                    SELECT feature_fr FROM product_feature WHERE product_id = ?
                `, [product.id]);
                    product.features = features.map(feature => feature.feature_fr);
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

            const productId = res.insertId; // ID du produit ajouté
            // console.log("productId => ", productId);
            var prefs = prefs.split(",");
            // console.log("prefs => ", prefs);
            // console.log(prefs.length);

            if (prefs.length > 0) {

                const prefValues = prefs.map(pref => [productId, pref.trim()]);
                // console.log("prefValues => ", prefValues);
                await connection.query(`
                    INSERT INTO product_feature (product_id, feature_fr) VALUES ?`, [prefValues]);
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
        var prefs = prefs.split(",");

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

            if (prefs.length > 0) {
                const prefValues = prefs.map(pref => [id, pref.trim()]);
                // delete the old prefs of that product and insert the new ones
                await connection.query(`
                    DELETE FROM product_feature WHERE product_id = ?`, [id]);

                await connection.query(`
                    INSERT INTO product_feature (product_id, feature_fr) VALUES ?`, [prefValues]);
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