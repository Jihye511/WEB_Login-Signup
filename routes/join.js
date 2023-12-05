const { log } = require('console');
const express = require('express');
const router = express.Router();
const fs = require("fs");
const { nextTick } = require('process');
const mysql = require("../mysql/index.js");
const bcrypt = require('bcrypt');



// 회원가입 페이지 라우트
router.get('/', function(req, res, next) {
    fs.readFile("./views/join.html", (err, data) => {
        if (err) {
          res.send("error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
        }
    });
    
});

// 가상의 데이터베이스 역할을 하는 배열
const registeredUsernames = [];
// "ds" 값을 배열에 추가
registeredUsernames.push("ds");


//아이디 중복확인
router.get('/checkDuplicate', async(req,res)=>{
  try { 
    const user_id = req.query.username;
    console.log(user_id);
    if (!user_id) {
      return res.status(400).json({ error: '아이디를 입력하세요.' });
    }
    //db에서 id만 불러오기
    const userList = await mysql.query("userIDlist");
    console.log("userlist: ",userList);
    
    //중복여부 확인
    const isDuplicate = userList.some(user => user.user_id === user_id);

    console.log("중복이면 ture: ",isDuplicate);
    res.send({ duplicate: isDuplicate });
  }catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Internal Server Error');
  }
}); 

// 비밀번호 해시화 함수
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};
//회원가입 
router.post('/register', async (req, res) => {
    try {
      console.log("/register로 전달 성공");
      const user_id = req.body.user_id;
      const password = req.body.password;
      

      //const { user_id, password } = req.body; 
      console.log(user_id,password);
      // 비밀번호를 해시화한 후 DB에 저장
      const hashedPassword = await hashPassword(password);
      const result = await mysql.query("userInsert", [user_id, hashedPassword]);
        console.log('Inserted user:', user_id);
        res.json({ success: result });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;


