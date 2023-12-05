//mysql/sql.js

module.exports={
    userList: `select * from usertable`,
    userIDlist:`SELECT user_id FROM usertable`,
    userLongin:`select * from usertable where user_id=?`,
    userInsert: `insert into usertable value (?,?)`,
    userUpdate: `update usertable set ? where id=?`,
    userDelete: `delete from usertable where id=?`,
}