
var express = require('express');
var router = express.Router();
const fs = require("fs");
const mysql = require("../mysql/index.js");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');


const secretKey = process.env.SECRET_KEY;


/* GET users listing. */
router.get('/', function(req, res, next) {
    fs.readFile("./views/login.html", (err, data) => {
        if (err) {
          res.send("error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
        }
    });
});

router.post('/doLogin',async(req,res)=>{
  try {
    const user_id = req.body.user_id;
    const password = req.body.password;
 
    console.log(user_id)
    if (!user_id || !password) {
      return res.status(400).json({ success: false, message: 'id와 password를 모두 입력해주세요.' });
    }

    console.log(user_id, password);
    const result = await mysql.query("userLongin", [user_id]);
    console.log('Inserted user:', user_id);

    if (result.length) {
      const storedHashedPassword = result[0].password;
      // 사용자가 입력한 비밀번호를 해시화하여 저장된 해시된 비밀번호와 비교
      const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

      if (passwordMatch) {
        console.log('login 성공');
        const userData ={user_id,role: 'user_id'};
        console.log(userData);
        const token = jwt.sign({data: userData}, secretKey,{expiresIn: '1m'});
        //토큰 생성은 된 듯 프론트에서받지를 못한건가가
        console.log(token)

        res.status(200).json({
          success: true,
          message: '로그인 성공',
          token,
          redirect: '/'
        });
      } else {
        console.log('login 실패');
        res.status(401).json({ success: false, message: 'id와 password를 확인해주세요.' });
      }
    } else {
      console.log('사용자를 찾을 수 없음');
      res.status(404).json({ success: false, message: '사용자를 찾을 수 없음' });
    }
  } catch (error) {
    console.error('로그인 중 에러 발생:', error);
    res.status(500).json({ success: false, message: '서버 에러' });
  }
});

module.exports = router;
