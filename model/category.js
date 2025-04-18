// create a model for category
const db = require("../config/DB");

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
    static async addCategory(name, description) {
        try {
            const [res] = await db.execute(`INSERT INTO category (name, description)
                                            VALUES (?, ?)`, [name, description]);
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
    static async updateCategory(id, name, description) {
        try {
            const [res] = await db.execute(`UPDATE category SET name = ?, description = ? WHERE id = ?`, [name, description, id]);
            console.log('Category updated successfully:', res);
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
}