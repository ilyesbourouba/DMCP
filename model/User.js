// const db = require("../config/DB");

const USERS = [
    {
      id: 1,
      username: "admin",
      password: "$2a$12$ghpWD1QViOgPy3mGQqhLPO7Fp39GI6d/wHO9kVCNk4DS2Pl56pUhK",
    },
    {
      id: 2,
      username: "user",
      password: "$2a$12$9TwRQuCSpp4lR5tDpdMx/eOwQnE1dxM/xGu4.DJ6KKCSnPDvi1ohC"
    }
]

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

  
    static async getUserByUsername(username) {
        try {

            return await USERS.find(user => user.username === username);
        } catch (error) {
            return error;
        }
    //   try {
    //     const sql = `select user.* from user where username = ?`;
  
    //     const [res] = await db.execute(sql, [username]);
    //     if (res.length > 0) return res[0];
    //     return null;
    //   } catch (error) {
    //     return error;
    //   }
    }
  
    static async getUserById(id) {
      try {
        const sql = `select user.* from user where id = ?`;
  
        const [res] = await db.execute(sql, [id]);
        if (res.length > 0) 
          return {
            success: true,
            data: res[0]
          };
        return {
          success: false,
          message: "No user found",
          data: []
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        }
      }
    }
  
    static async checkUsername(username) {
      try {
        const sql = `select user.* from user where username = ?`;
  
        const [res] = await db.execute(sql, [username]);
        if (res.length > 0) return true;
        return false;
      } catch (error) {
        return error;
      }
    }
    
  };
  