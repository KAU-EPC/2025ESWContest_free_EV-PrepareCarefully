const Car = require("../../models/Car");

// 객체 메서드
const process = {
  register: async (req, res) => {
    const car = new Car(req.body);
    const response = await car.register();
    return res.json(response);
  },

  saveTemp: async (req, res) => {
    const car = new Car(req.body);
    const response = await car.saveBatteryTemp();
    return res.json(response);
  },

  sendTemp: async (req, res) => {
    const car = new Car(req.body);
    const response = await car.sendBatteryTemp();
    return res.json(response);
  },

  sendTempPage: async (req, res) => {
    const car = new Car(req.body);
    const response = await car.sendBatteryTempPage();
    return res.json(response);
  },

  saveVoltage: async (req, res) => {
    const car = new Car(req.body);
    const response = await car.saveCellVoltage();
    return res.json(response);
  },

  sendVoltage: async (req, res) => {
    const car = new Car(req.body);
    const response = await car.sendCellVoltage();
    return res.json(response);
  },
  sendVoltagePage: async (req, res) => {
    const car = new Car(req.body);
    const response = await car.sendCellVoltagePage();
    return res.json(response);
  },

  savebattery_status: async (req, res) => {
    const car = new Car(req.body);
    const response = await car.saveBatteryStatus();
    return res.json(response);
  },

  sendbattery_status: async (req, res) => {
    const car = new Car(req.body);
    const response = await car.sendBatteryStatus();
    return res.json(response);
  },

  sendVoltageBalance: async (req, res) => {
    const car = new Car(req.body);
    const response = await car.sendVoltageBalance();
    return res.json(response);
  },
};

module.exports = { process };
