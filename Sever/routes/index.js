const express = require("express");
const userCtrl = require("./home/homectrl");
const carCtrl = require("./home/carctrl");
const db = require("../config/db");
const axios = require("axios");
const router = express.Router();

router.post("/login", userCtrl.process.login);
router.post("/register", userCtrl.process.register);

router.post("/cars", carCtrl.process.register);

router.post("/cars/batteryTemp", carCtrl.process.saveTemp);
router.post("/cars/batteryTemp/app", carCtrl.process.sendTemp);
router.post("/cars/batteryTemp/list/app", carCtrl.process.sendTempPage);

router.post("/cars/cellVoltage", carCtrl.process.saveVoltage);
router.post("/cars/cellVoltage/app", carCtrl.process.sendVoltage);
router.post("/cars/cellVoltage/list/app", carCtrl.process.sendVoltagePage); // 구현해야됨

router.post("/cars/batteryStatus", carCtrl.process.savebattery_status);
router.post("/cars/batteryStatus/app", carCtrl.process.sendbattery_status);

router.get("/save-chargers", async (req, res) => {
  try {
    const API_URL = "http://apis.data.go.kr/B552584/EvCharger/getChargerInfo";
    const SERVICE_KEY =
      "p91%2BSyjEQfxAurGZAEmAKOODxtLaLJVZdpJC1%2BDSo1ZrVKPKxyWJRCvWut7iI8wR%2Bk8kiKtskEVQME5n5efftQ%3D%3D"; // 발급받은 서비스 키

    let pageNo = 1;
    const numOfRows = 1000; // 한 번에 가져올 데이터 수

    while (true) {
      // API 호출
      const response = await axios.get(
        `${API_URL}?serviceKey=${SERVICE_KEY}&dataType=JSON&pageNo=${pageNo}&numOfRows=${numOfRows}&zcode=11`
      );

      const data = response.data.items?.item || [];
      if (data.length === 0) {
        console.log(`No more data to fetch. Stopping at page ${pageNo}.`);
        break;
      }

      // 충전소 데이터를 DB에 저장
      const values = data.map((item) => [
        item.statNm, // 충전소 이름
        item.addr, // 주소
        parseFloat(item.lat), // 위도
        parseFloat(item.lng), // 경도
      ]);

      db.query(
        "INSERT IGNORE INTO chargers (name, address, latitude, longitude) VALUES ?",
        [values]
      );

      console.log(`Page ${pageNo} data saved (${data.length} records).`);
      pageNo++;
    }

    res.status(200).json({ message: "서울 충전소 데이터 저장 완료" });
  } catch (error) {
    console.error("Error saving data:", error.message);
    res
      .status(500)
      .json({ error: "서울 충전소 데이터를 저장하는 데 실패했습니다." });
  }
});

router.post("/find-charger", (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: "위도와 경도를 입력하세요." });
  }

  try {
    // 모든 충전소 데이터 가져오기
    db.query(
      `
          SELECT name, address, latitude, longitude
          FROM chargers
        `,
      (err, results) => {
        if (err) {
          console.error("Database Error:", err.message);
          return res
            .status(500)
            .json({ error: "가까운 충전소를 찾는 데 실패했습니다." });
        }

        // 가장 가까운 충전소 찾기 함수
        const findNearestCharger = (chargers, latitude, longitude) => {
          let nearestCharger = null;
          let minDistance = Infinity;

          for (const charger of chargers) {
            const distance = Math.sqrt(
              Math.pow(charger.latitude - latitude, 2) +
                Math.pow(charger.longitude - longitude, 2)
            );

            if (distance < minDistance) {
              minDistance = distance;
              nearestCharger = charger;
            }
          }

          return nearestCharger;
        };

        // 가장 가까운 충전소 계산
        const nearestCharger = findNearestCharger(results, latitude, longitude);

        if (!nearestCharger) {
          return res
            .status(404)
            .json({ error: "가까운 충전소를 찾을 수 없습니다." });
        }

        // 결과 반환
        res.status(200).json({
          name: nearestCharger.name,
          address: nearestCharger.address,
          latitude: nearestCharger.latitude,
          longitude: nearestCharger.longitude,
        });
      }
    );
  } catch (error) {
    console.error("Unexpected Error:", error.message);
    res.status(500).json({ error: "가까운 충전소를 찾는 데 실패했습니다." });
  }
});

module.exports = router; // 이 코드는 나중에 use에 들어간다
