const mysql = require('mysql');
const conf = require('../config/db_config');

module.exports = (() => {
    const pool = mysql.createPool({
        host: conf.host,
        user: conf.user,
        password: conf.password,
        port: conf.port,
        database: conf.database
    });

    return {
        execute: (sql, param) => {
            return new Promise((resolve, reject) => {
                pool.getConnection((err, con) => {
                    if (err) reject(err);
                    con.query(sql, param, (err, result) => {
                        con.release();
                        if (err) reject(err);
                        resolve(result);
                    });
                });
            });
        }
    };
})();