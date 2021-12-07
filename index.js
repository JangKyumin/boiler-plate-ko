const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");

const config = require("./config/key");

const { User } = require("./models/User");

//application/x_www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());

// mongoDB connection
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// GET Method API
app.get("/", (req, res) => {
  res.send("Hello World! NodeMon 짱 좋다!");
});

// POST Method API
app.post("/register", (req, res) => {
  // 회원 가입 할때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

// 서버 상태 체크?
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
