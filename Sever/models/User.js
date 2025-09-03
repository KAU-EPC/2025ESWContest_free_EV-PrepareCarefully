const UserStorage = require("./UserStorage");

class User {
  // 프로퍼티 생성자
  constructor(body) {
    this.body = body;
  }

  // 로그인 메서드
  async login() {
    const { email, password } = await UserStorage.getUsersInfo(this.body.email);

    if (email) {
      if (email === this.body.email && password === this.body.password)
        return { success: true };
    }
    return { success: false };
  }

  // 회원가입 메서드
  async register() {
    UserStorage.save(this.body);
    return { success: true };
  }
}

module.exports = User;
