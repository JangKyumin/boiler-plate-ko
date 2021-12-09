const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth");

const config = require("./config/key");

const { User } = require("./models/User");

//application/x_www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

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
app.post("/api/users/register", (req, res) => {
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

// POST Method API
app.post("/api/users/login", (req, res) => {
  // 요청된 이메일을 DB에서 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccese: false,
        message: "제공된 이메일이 존재하지 않습니다.",
      });
    }

    // 이메일이 있다면 비밀번호가 일치하는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSucces: false,
          message: "비밀번호가 틀렸습니다.",
        });
      }

      // 비밀번호까지 맞다면 토큰 생성하기
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //토큰을 저장한다. 쿠키? 로컬스토리지?
        res.cookie("x_auth", user.token).status(200).json({
          loginSucces: true,
          userId: user._id,
        });
      });
    });
  });
});

// role 1 어드민    role 2 특정 부서 어드민
// role 0 -> 일반유저   role 0이 아니면  관리자
app.get("/api/users/auth", auth, (req, res) => {
  //여기 까지 미들웨어를 통과해 왔다는 얘기는  Authentication 이 True 라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  // console.log('req.user', req.user)
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

// 서버 상태 체크?
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
