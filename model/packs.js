const db = require("../config/DB");
const PanierModel = require('../model/panier');

module.exports = class PackModel {
    constructor() {}

    // Get all packs
    static async getPacks() {
        try {

            const [packs] = await db.execute(`SELECT * FROM pack ORDER BY id DESC;`);


            const [packProducts] = await db.execute(`
                SELECT pp.pack_id, p.id AS product_id, p.price
                FROM pack_product pp
                JOIN product p ON pp.product_id = p.id
            `);

            const packMap = {};

            packs.forEach(pack => {
                packMap[pack.id] = {
                    ...pack,
                    products: [],
                    total_price: 0
                };
            });

            packProducts.forEach(product => {
                if (packMap[product.pack_id]) {
                    packMap[product.pack_id].products.push({
                        id: product.product_id
                    });

                    packMap[product.pack_id].total_price += product.price;
                }
            });

            return { success: true, data: Object.values(packMap) };
        } catch (error) {
            console.log("error => ", error);
            return { success: false, error: error.message };
        }

    }

    // Add a new pack with products
    static async addPack(name_fr, name_ar, name_en, description_fr, description_ar, description_en, productIds, image_name) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [packRes] = await connection.execute(
                `INSERT INTO pack (name_fr, name_ar, name_en, description_fr, description_ar, description_en, image) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`, [name_fr, name_ar, name_en, description_fr, description_ar, description_en, image_name]
            );

            const packId = packRes.insertId;

            for (let productId of productIds) {
                await connection.execute(
                    `INSERT INTO pack_product (pack_id, product_id) VALUES (?, ?)`, [packId, productId]
                );
            }

            await connection.commit();
            return { success: true };
        } catch (error) {
            await connection.rollback();
            console.log("error => ", error);
            return { success: false, error: error.message };
        } finally {
            connection.release();
        }
    }

    // Get a single pack with its products
    static async getPackById(id) {
        try {
            const [packRes] = await db.execute(`SELECT * FROM pack WHERE id = ?`, [id]);
            const [productsRes] = await db.execute(
                `SELECT p.id AS product_id, p.name_fr AS product_name, p.price FROM product p 
                 JOIN pack_product pp ON p.id = pp.product_id 
                 WHERE pp.pack_id = ?`, [id]
            );

            return {
                success: true,
                data: {...packRes[0], products: productsRes }
            };
        } catch (error) {
            console.log("error => ", error);
            return { success: false, error: error.message };
        }
    }

    // Update a pack and its product list
    static async updatePack(id, name_fr, name_ar, name_en, description_fr, description_ar, description_en, productIds, image_name) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            if (image_name == "") {
                await connection.execute(
                    `UPDATE pack SET name_fr = ?, name_ar = ?, name_en = ?, description_fr = ?, description_ar = ?, description_en = ? WHERE id = ?`, [name_fr, name_ar, name_en, description_fr, description_ar, description_en, id]
                );
            } else {
                await connection.execute(
                    `UPDATE pack SET name_fr = ?, name_ar = ?, name_en = ?, description_fr = ?, description_ar = ?, description_en = ?, image = ? WHERE id = ?`, [name_fr, name_ar, name_en, description_fr, description_ar, description_en, image_name, id]
                );
            }

            await connection.execute(`DELETE FROM pack_product WHERE pack_id = ?`, [id]);
            const products = productIds.split(",").map((productId) => productId.trim());
            for (let productId of products) {
                await connection.execute(
                    `INSERT INTO pack_product (pack_id, product_id) VALUES (?, ?)`, [id, productId]
                );
            }

            await connection.commit();
            console.log('Pack updated successfully');
            return { success: true };
        } catch (error) {
            await connection.rollback();
            console.log("error => ", error);
            return { success: false, error: error.message };
        } finally {
            connection.release();
        }
    }

    // Delete a pack and its product associations
    static async deletePack(id) {
            const connection = await db.getConnection();
            try {
                await connection.beginTransaction();

                await connection.execute(`DELETE FROM pack_product WHERE pack_id = ?`, [id]);

                const [res] = await connection.execute(`DELETE FROM pack WHERE id = ?`, [id]);

                await connection.commit();
                console.log('Pack deleted successfully:', res);
                return { success: true, data: res };
            } catch (error) {
                await connection.rollback();
                console.log("error => ", error);
                return { success: false, error: error.message };
            } finally {
                connection.release();
            }
        }
        // with client id and the pack id, isert the list of product in the table panier(client_id , product_id , quantity)
    static async addToPanier(clientId, packId) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Get the products in the pack
            const [productsRes] = await connection.execute(
                `SELECT p.id AS product_id, 1 as quantity FROM pack_product pp 
                 JOIN product p ON pp.product_id = p.id 
                 WHERE pp.pack_id = ?`, [packId]
            );

            // Insert each product into the panier table
            for (let product of productsRes) {
                console.log(clientId, product)
                const checkPanier = await PanierModel.find(clientId, product.product_id);
                console.log(checkPanier);

                if (checkPanier == null) {
                    await PanierModel.addToPanier(clientId, product.product_id, product.quantity);
                } else {
                    // var sum = quantity + checkPanier["quantity"];
                    await PanierModel.updatePanier(clientId, product.product_id, product.quantity);
                }
            }

            await connection.commit();
            console.log('Products added to panier successfully');
            return true;
        } catch (error) {
            await connection.rollback();
            console.log("error => ", error);
            return false;
        } finally {
            connection.release();
        }
    }
    static async deleteIMAGE(id) {
        try {
            const [res] = await db.execute(`UPDATE pack SET image = "" WHERE id = ?`, [id]);
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
};