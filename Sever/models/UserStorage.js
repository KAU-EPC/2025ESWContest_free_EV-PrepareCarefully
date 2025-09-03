const db = require("../config/db");

class UserStorage {
  // 유저의 모든 속성을 얻는 함수
  static async getUsersInfo(email) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM user WHERE email=?";
      db.query(query, [email], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  }

  // 유저의 정보를 저장하는 함수
  static async save(userInfo) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO user(nickname, email, password) VALUES(?,?,?);";
      db.query(
        query,
        [userInfo.nickname, userInfo.email, userInfo.password],
        (err) => {
          if (err) reject(err);
          resolve({ success: true });
        }
      );
    });
  }
}

module.exports = UserStorage;
