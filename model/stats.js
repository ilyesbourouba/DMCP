const db = require("../config/DB");

module.exports = class StatsModel {
    constructor() { }

    static async bestCategorySells() {
        try {
            const [res] = await db.execute(`SELECT 
                                                cat.id AS category_id,
                                                cat.name_fr,
                                                SUM(cp.quantity) AS total_sold
                                            FROM 
                                                commande_product cp
                                            JOIN 
                                                commande c ON cp.commande_id = c.id
                                            JOIN 
                                                commande_status cs ON c.status_id = cs.id
                                            JOIN 
                                                product p ON cp.product_id = p.id
                                            JOIN 
                                                category cat ON p.category_id = cat.id
                                            WHERE 
                                                cs.status_fr = 'payé'
                                            GROUP BY 
                                                cat.id, cat.name_fr
                                            ORDER BY 
                                                total_sold DESC
                                            LIMIT 1;

                            `);
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
    static async bestClientSellsByMoney() {
        try {
            const [res] = await db.execute(`SELECT 
                                                cl.id,
                                                cl.name,
                                                cl.phone,
                                                cl.email,
                                                SUM(c.total) AS total_spent
                                            FROM 
                                                commande c
                                            JOIN 
                                                commande_status cs ON c.status_id = cs.id
                                            JOIN client cl ON c.client_id = cl.id
                                            WHERE 
                                                cs.status_fr = 'payé'
                                            GROUP BY 
                                                c.client_id
                                            ORDER BY 
                                                total_spent DESC
                                            LIMIT 5;

                            `);
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
    static async bestClientSellsByQuantity() {
        try {
            const [res] = await db.execute(`SELECT 
                                                cl.id,
                                                cl.name,
                                                cl.phone,
                                                cl.email,
                                                SUM(cp.quantity) AS total_items
                                            FROM 
                                                commande c
                                            JOIN 
                                                commande_product cp ON c.id = cp.commande_id
                                            JOIN 
                                                commande_status cs ON c.status_id = cs.id
                                            JOIN client cl ON c.client_id = cl.id
                                            WHERE 
                                                cs.status_fr = 'payé'
                                            GROUP BY 
                                                c.client_id
                                            ORDER BY 
                                                total_items DESC
                                            LIMIT 5;
                            `);
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
    static async getSellsStatus() {
        try {
            const [res] = await db.execute(`SELECT 
                                                cs.status_fr,
                                                SUM(cp.quantity) AS total_quantity
                                            FROM 
                                                commande c
                                            JOIN 
                                                commande_product cp ON c.id = cp.commande_id
                                            JOIN 
                                                commande_status cs ON c.status_id = cs.id
                                            GROUP BY 
                                                cs.status_fr
                                            ORDER BY 
                                                cs.status_fr DESC;
                            `);
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
    static async getBlacklist() {
        try {
            const [res] = await db.execute(`SELECT 
                                                cl.id,
                                                cl.name,
                                                cl.phone,
                                                cl.email,
                                                COUNT(*) AS cancelled_orders
                                            FROM 
                                                commande c
                                            JOIN 
                                                commande_status cs ON c.status_id = cs.id
                                            JOIN client cl ON c.client_id = cl.id
                                            WHERE 
                                                cs.status_fr = 'annulé'
                                            GROUP BY 
                                                c.client_id
                                            ORDER BY 
                                                cancelled_orders DESC
                                                LIMIT 5; 
                            `);
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
    static async totalRevenueByProduct() {
        try {
            const [res] = await db.execute(` SELECT 
                                                p.id AS product_id,
                                                p.name_fr,
                                                SUM(cp.quantity * p.price) AS total_revenue,
                                                
                                                -- Regular integer percentage
                                                ROUND(
                                                    SUM(cp.quantity * p.price) / (
                                                        SELECT 
                                                            SUM(cp2.quantity * p2.price)
                                                        FROM 
                                                            commande_product cp2
                                                        JOIN 
                                                            commande c2 ON cp2.commande_id = c2.id
                                                        JOIN 
                                                            commande_status cs2 ON c2.status_id = cs2.id
                                                        JOIN 
                                                            product p2 ON cp2.product_id = p2.id
                                                        WHERE 
                                                            cs2.status_fr = 'payé'
                                                    ) * 100, 0
                                                ) AS revenue_percentage,

                                                -- Custom bucket (e.g. 25–29 becomes 30, 71–74 becomes 70)
                                                CASE 
                                                    WHEN ROUND(SUM(cp.quantity * p.price) / (
                                                        SELECT 
                                                            SUM(cp2.quantity * p2.price)
                                                        FROM 
                                                            commande_product cp2
                                                        JOIN 
                                                            commande c2 ON cp2.commande_id = c2.id
                                                        JOIN 
                                                            commande_status cs2 ON c2.status_id = cs2.id
                                                        JOIN 
                                                            product p2 ON cp2.product_id = p2.id
                                                        WHERE 
                                                            cs2.status_fr = 'payé'
                                                    ) * 100, 0) % 10 >= 5
                                                    THEN FLOOR(
                                                        ROUND(SUM(cp.quantity * p.price) / (
                                                            SELECT 
                                                                SUM(cp2.quantity * p2.price)
                                                            FROM 
                                                                commande_product cp2
                                                            JOIN 
                                                                commande c2 ON cp2.commande_id = c2.id
                                                            JOIN 
                                                                commande_status cs2 ON c2.status_id = cs2.id
                                                            JOIN 
                                                                product p2 ON cp2.product_id = p2.id
                                                            WHERE 
                                                                cs2.status_fr = 'payé'
                                                        ) * 100, 0
                                                    ) / 10) * 10 + 10
                                                    ELSE FLOOR(
                                                        ROUND(SUM(cp.quantity * p.price) / (
                                                            SELECT 
                                                                SUM(cp2.quantity * p2.price)
                                                            FROM 
                                                                commande_product cp2
                                                            JOIN 
                                                                commande c2 ON cp2.commande_id = c2.id
                                                            JOIN 
                                                                commande_status cs2 ON c2.status_id = cs2.id
                                                            JOIN 
                                                                product p2 ON cp2.product_id = p2.id
                                                            WHERE 
                                                                cs2.status_fr = 'payé'
                                                        ) * 100, 0
                                                    ) / 10) * 10
                                                END AS rounded_bucket
                                            FROM 
                                                commande_product cp
                                            JOIN 
                                                commande c ON cp.commande_id = c.id
                                            JOIN 
                                                commande_status cs ON c.status_id = cs.id
                                            JOIN 
                                                product p ON cp.product_id = p.id
                                            WHERE 
                                                cs.status_fr = 'payé'
                                            GROUP BY 
                                                p.id, p.name_fr
                                            ORDER BY 
                                                total_revenue DESC
                                                limit 5;

                            `);
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

    static async sellsByMouths() {
        try {
            const [res] = await db.execute(`SELECT 
                                                mois.mois_nom AS mois,
                                                IFNULL(SUM(c.total), 0) AS total_ventes
                                            FROM (
                                                SELECT 1 AS mois_num, 'janvier' AS mois_nom UNION ALL
                                                SELECT 2, 'février' UNION ALL
                                                SELECT 3, 'mars' UNION ALL
                                                SELECT 4, 'avril' UNION ALL
                                                SELECT 5, 'mai' UNION ALL
                                                SELECT 6, 'juin' UNION ALL
                                                SELECT 7, 'juillet' UNION ALL
                                                SELECT 8, 'août' UNION ALL
                                                SELECT 9, 'septembre' UNION ALL
                                                SELECT 10, 'octobre' UNION ALL
                                                SELECT 11, 'novembre' UNION ALL
                                                SELECT 12, 'décembre'
                                            ) AS mois
                                            LEFT JOIN commande c 
                                                ON MONTH(c.date_commande) = mois.mois_num AND YEAR(c.date_commande) = YEAR(CURDATE())
                                            LEFT JOIN commande_status cs ON c.status_id = cs.id
                                            WHERE cs.status_fr IS NULL OR cs.status_fr = 'payé'
                                            GROUP BY mois.mois_num, mois.mois_nom
                                            ORDER BY mois.mois_num;
                            `);
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
    static async chiffreAffaire() {
        try {
            const [res] = await db.execute(`SELECT 
                                                SUM(c.total) AS chiffre_affaire
                                            FROM 
                                                commande c
                                            JOIN 
                                                commande_status cs ON c.status_id = cs.id
                                            WHERE 
                                                cs.status_fr = 'payé';
                            `);
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