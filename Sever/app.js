const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./routes/index"); // routes 폴더에서 router

const app = express();
const PORT = 4000;

app.use(morgan("dev")); //배포환경이면 combined 개발환경이면 dev
app.use(cors());
app.use(express.json()); // POST에서 body를 JSON 형식으로 사용할 수 있게 도와주는 코드
app.use(express.urlencoded({ extended: true }));
app.use("/", router); // 라우터와 연동

module.exports = { app, PORT };
