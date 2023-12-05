// index.js

const express = require("express");
const router = express.Router();
const fs = require("fs");
const jwt = require('jsonwebtoken');
// 
// process.env.JWT_SECRET;

/* GET home page. */

router.get("/",(req,res,next)=>{
  fs.readFile('./views/index.html','utf8',(err,data)=>{
    if (err) {
      return res.status(500).send('Internal Server Error');
  }
  res.send(data);
});
});


  


module.exports = router;
