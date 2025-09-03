const CarStorage = require("./CarStorage");

class Car {
  // 프로퍼티 생성자
  constructor(body) {
    this.body = body;
  }

  // 차량 등록 메서드
  async register() {
    CarStorage.register(this.body);
    return { success: true };
  }

  // 1. battery temp 저장 메서드
  async saveBatteryTemp() {
    CarStorage.saveBatteryTemp(this.body);
    return { success: true };
  }

  // 1. battery temp 전송 메서드
  async sendBatteryTemp() {
    const data = await CarStorage.sendBatteryTemp(this.body);
    return data;
  }

  // 1. battery temp page send
  async sendBatteryTempPage() {
    const data = await CarStorage.sendBatteryTempPage(this.body);
    return data;
  }

  // 2. 전압 저장 메서드
  async saveCellVoltage() {
    CarStorage.saveCellVoltage(this.body);
    return { success: true };
  }

  // 2. 전압 전송 메서드
  async sendCellVoltage() {
    const data = await CarStorage.sendCellVoltage(this.body);
    return data;
  }

  // 2. voltage page send
  async sendCellVoltagePage() {
    const data = await CarStorage.sendCellVoltagePage(this.body);
    return data;
  }

  // 3. 배터리 상태 정보 저장
  async saveBatteryStatus() {
    const data = await CarStorage.saveBatteryStatus(this.body);
    return { success: true };
  }

  // 3. 배터리 상태 정보 전송
  async sendBatteryStatus() {
    const data = await CarStorage.sendBatteryStatus(this.body);
    return data;
  }
}

module.exports = Car;
