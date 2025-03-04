const db = require("../config/DB");

module.exports = class PackModel {
    constructor() {}

    // Get all packs
    static async getPacks() {
        try {

            const [packs] = await db.execute(`SELECT * FROM pack ORDER BY id DESC;`);


            const [packProducts] = await db.execute(`
                SELECT pp.pack_id, p.id AS product_id, p.name AS product_name, p.price 
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
                        id: product.product_id,
                        name: product.product_name,
                        price: product.price
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
    static async addPack(name, description, productIds) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            console.log("model", name, description, productIds)
            const [packRes] = await connection.execute(
                `INSERT INTO pack (name, description) VALUES (?, ?)`, [name, description]
            );

            const packId = packRes.insertId;

            for (let productId of productIds) {
                await connection.execute(
                    `INSERT INTO pack_product (pack_id, product_id) VALUES (?, ?)`, [packId, productId]
                );
            }

            await connection.commit();
            console.log('Pack added successfully:', packRes);
            return { success: true, data: packRes };
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
                `SELECT p.id AS product_id, p.name AS product_name, p.price FROM product p 
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
    static async updatePack(id, name, description, productIds) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            await connection.execute(
                `UPDATE pack SET name = ?, description = ? WHERE id = ?`, [name, description, id]
            );

            await connection.execute(`DELETE FROM pack_product WHERE pack_id = ?`, [id]);

            for (let productId of productIds) {
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
};