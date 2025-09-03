const { app, PORT } = require("../app");

app.listen(PORT, (err) => {
  if (err) {
    console.error("서버 실행 중 오류 발생:", err);
  } else {
    console.log(`${PORT}번 포트 서버가 열렸습니다`);
  }
});
