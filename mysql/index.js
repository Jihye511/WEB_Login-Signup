//mysql/index.js

const mysql = require('mysql');
const sql = require('./sql');

require("dotenv").config({
    path:".env",
});

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    connectionLimit: process.env.MYSQL_LIMIT,
});
pool.on('error', (err) => {
    console.error('MySQL 연결 오류:', err.message);
});

module.exports={
    userList: `select * from usertable`,
    userInsert: `insert into usertable set ?`,
    userUpdate: `update usertable set ? where id=?`,
    userDelete: `delete from usertable where id=?`,
}

const query = async(alias, values) =>{
    return new Promise((resolve, reject)=>{
        pool.query(sql[alias],values,(error,results)=>{
            if(error){
                console.log(error);
                reject({
                    error,
                });
            }else resolve(results);
        })
    })
}
module.exports={
    query,
};

