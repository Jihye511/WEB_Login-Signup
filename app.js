var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const bodyParser = require('body-parser');
const port=3010;

var indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const joinRouter = require("./routes/join");

//토큰 생성
// const jwt = require("jsonwebtoken");
// const token = jwt.sign({})

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({extended: true}));

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/join", joinRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("something wrong!");
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});

module.exports = app;
