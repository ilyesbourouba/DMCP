// create a model for category
const db = require("../config/DB");
require('dotenv').config();
module.exports = class CategoryModel {
    constructor() {}

    static async getCategories() {
        try {
            const [res] = await db.execute(`SELECT * FROM category ORDER BY id DESC;`);
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
    static async addCategory(name_fr, name_ar, name_en, image_name) {
        var image = process.env.IMAGE_PATH + image_name[0];
        console.log(image);
        try {
            const [res] = await db.execute(`INSERT INTO category (name_fr, name_en, name_ar, image) VALUES (?, ?, ?, ?)`, [name_fr, name_en, name_ar, image]);
            console.log('Category added successfully:', res);
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
    static async getCategoryById(id) {
        try {
            const [res] = await db.execute(`SELECT * FROM category WHERE id = ?`, [id]);
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
    static async updateCategory(id, name_fr, name_en, name_ar, image_name) {
        try {
            if (image_name == "") {
                const [res] = await db.execute(`UPDATE category SET name_fr = ?, name_en = ?, name_ar = ? WHERE id = ?`, [name_fr, name_en, name_ar, id]);
                return {
                    success: true,
                    data: res
                };
            } else {
                var image = process.env.IMAGE_PATH + image_name
                const [res] = await db.execute(`UPDATE category SET name_fr = ?, name_en = ?, name_ar = ?, image = ? WHERE id = ?`, [name_fr, name_en, name_ar, image, id]);
                return {
                    success: true,
                    data: res
                };
            }
        } catch (error) {
            console.log("error => ", error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    static async deleteCategory(id) {
        try {
            const [res] = await db.execute(`DELETE FROM category WHERE id = ?`, [id]);
            console.log('Category deleted successfully:', res);
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
    static async deleteIMAGE(id) {
        try {
            const [res] = await db.execute(`UPDATE category SET image = "" WHERE id = ?`, [id]);
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
}