const db = require("../config/DB");

module.exports = class UserModel {
    constructor() {}

    static async getAll() {
        try {

            const [res] = await db.execute(`SELECT user.* FROM user`);
            if (res.length > 0) return {
                success: true,
                data: res
            };
            return {
                success: true,
                message: "Aucun utilisateur trouvé",
                data: [],
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