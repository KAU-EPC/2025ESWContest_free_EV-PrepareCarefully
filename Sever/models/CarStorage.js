const twilio = require("twilio");
const db = require("../config/db");
require("dotenv").config();

class CarStorage {
  // 차량 정보를 저장하는 함수
  static async register(carInfo) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO car(email, device_number, car_type) VALUES(?,?,?);";
      db.query(
        query,
        [carInfo.email, carInfo.device_number, carInfo.car_type],
        (err) => {
          if (err) reject(err);
          resolve({ success: true });
        }
      );
    });
  }

  // battery temp를 저장하는 함수
  static async saveBatteryTemp(data) {
    return new Promise((resolve, reject) => {
      const tableName = `battery_temp_0${data.module_number}`;
      const query = `INSERT INTO ${tableName}(device_number, module_number, module_temp) VALUES(?,?,?);`;

      //문자보내기
      if (data.module_temp >= 50) {
        // 최신 GPS 위치 조회
        const locationQuery = `
          SELECT latitude, longitude 
          FROM battery_status 
          WHERE device_number = ? 
          ORDER BY created_at DESC 
          LIMIT 1
        `;

        db.query(
          locationQuery,
          [data.device_number],
          async (locationErr, locationResults) => {
            console.log("=== GPS 위치 조회 디버그 ===");
            console.log("locationErr:", locationErr);
            console.log("locationResults:", locationResults);

            const accountSid = process.env.TWILIO_ACCOUNT_SID; // Twilio 계정 SID
            const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio 인증 토큰
            const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // Twilio 발신 번호
            const client = twilio(accountSid, authToken);
            const phoneNumber = process.env.NOTIFICATION_PHONE_NUMBER; // 메세지 보낼 번호

            let locationInfo = "";
            if (!locationErr && locationResults && locationResults.length > 0) {
              const { latitude, longitude } = locationResults[0];
              const lat = parseFloat(latitude).toFixed(4);
              const lng = parseFloat(longitude).toFixed(4);
              locationInfo = ` 위치: 위도 ${lat}, 경도 ${lng}`;
              console.log("GPS 위치 정보 찾음:", locationInfo);
            } else {
              console.log(
                "GPS 위치 정보 없음 - Error:",
                locationErr,
                "Results length:",
                locationResults ? locationResults.length : 0
              );
            }

            // SMS 메시지 내용 (위치 정보 포함)
            const smsMessage = `차량 화재 발생! 출동 부탁드립니다.${locationInfo}`;
            console.log("전송할 SMS 메시지:", smsMessage);

            try {
              // SMS 전송
              await client.messages.create({
                to: phoneNumber,
                from: twilioPhoneNumber,
                body: smsMessage,
              });

              // 전화 통화 발신 (위치 정보 포함)
              const twimlMessage = locationInfo
                ? `차량 화재가 발생했습니다. 위치는 위도 ${parseFloat(
                    locationResults[0].latitude
                  ).toFixed(4)}, 경도 ${parseFloat(
                    locationResults[0].longitude
                  ).toFixed(4)}입니다. 즉시 출동해 주세요.`
                : "차량 화재가 발생했습니다. 즉시 출동해 주세요.";

              await client.calls.create({
                to: phoneNumber,
                from: twilioPhoneNumber,
                twiml: `<Response><Say voice="alice" language="ko-KR">${twimlMessage}</Say></Response>`,
              });
            } catch (twilioError) {
              console.error("Twilio 알림 전송 오류:", twilioError);
            }
          }
        );
      }

      db.query(
        query,
        [data.device_number, data.module_number, data.module_temp],
        (err) => {
          if (err) reject(err);
          resolve({ success: true });
        }
      );
    });
  }

  // battery temp를 전송하는 함수
  static async sendBatteryTemp(data) {
    return new Promise((resolve, reject) => {
      // module_number에 따라 테이블 이름 결정
      const tableName = `battery_temp_0${data.module_number}`;

      const query = `
        SELECT 
          device_number, 
          module_number, 
          module_temp, 
          created_at
        FROM ${tableName}
        WHERE device_number = ?
        ORDER BY created_at DESC
        LIMIT 1;
      `;
      db.query(query, [data.device_number], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0]);
      });
    });
  }

  // battery temp를 페이지 단위로 전송하는 함수
  static async sendBatteryTempPage(data) {
    return new Promise((resolve, reject) => {
      // module_number에 따라 테이블 이름 결정
      const tableName = `battery_temp_0${data.module_number}`;

      // 페이지당 10개의 데이터를 가져오기 위한 쿼리
      const limit = 10;
      const offset = (data.page - 1) * limit;
      const query = `
        SELECT 
          device_number, 
          module_number, 
          module_temp, 
          created_at
        FROM ${tableName}
        WHERE device_number = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?;
      `;
      db.query(query, [data.device_number, limit, offset], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }

  // cell voltage를 저장하는 함수
  static async saveCellVoltage(data) {
    return new Promise((resolve, reject) => {
      // ten_num에 따라 테이블명 설정
      const tableIndex = data.ten_num; // "0" ~ "9" 범위의 문자열로 예상
      const tableName = `cell_voltage_${tableIndex}`;

      // 테이블별로 삽입할 컬럼 설정 (00부터 97까지, 10씩 증가)
      const columns = {
        0: [
          "cell_00",
          "cell_01",
          "cell_02",
          "cell_03",
          "cell_04",
          "cell_05",
          "cell_06",
          "cell_07",
          "cell_08",
          "cell_09",
        ],
        1: [
          "cell_10",
          "cell_11",
          "cell_12",
          "cell_13",
          "cell_14",
          "cell_15",
          "cell_16",
          "cell_17",
          "cell_18",
          "cell_19",
        ],
        2: [
          "cell_20",
          "cell_21",
          "cell_22",
          "cell_23",
          "cell_24",
          "cell_25",
          "cell_26",
          "cell_27",
          "cell_28",
          "cell_29",
        ],
        3: [
          "cell_30",
          "cell_31",
          "cell_32",
          "cell_33",
          "cell_34",
          "cell_35",
          "cell_36",
          "cell_37",
          "cell_38",
          "cell_39",
        ],
        4: [
          "cell_40",
          "cell_41",
          "cell_42",
          "cell_43",
          "cell_44",
          "cell_45",
          "cell_46",
          "cell_47",
          "cell_48",
          "cell_49",
        ],
        5: [
          "cell_50",
          "cell_51",
          "cell_52",
          "cell_53",
          "cell_54",
          "cell_55",
          "cell_56",
          "cell_57",
          "cell_58",
          "cell_59",
        ],
        6: [
          "cell_60",
          "cell_61",
          "cell_62",
          "cell_63",
          "cell_64",
          "cell_65",
          "cell_66",
          "cell_67",
          "cell_68",
          "cell_69",
        ],
        7: [
          "cell_70",
          "cell_71",
          "cell_72",
          "cell_73",
          "cell_74",
          "cell_75",
          "cell_76",
          "cell_77",
          "cell_78",
          "cell_79",
        ],
        8: [
          "cell_80",
          "cell_81",
          "cell_82",
          "cell_83",
          "cell_84",
          "cell_85",
          "cell_86",
          "cell_87",
          "cell_88",
          "cell_89",
        ],
        9: [
          "cell_90",
          "cell_91",
          "cell_92",
          "cell_93",
          "cell_94",
          "cell_95",
          "cell_96",
          "cell_97",
        ],
      };

      const selectedColumns = columns[tableIndex];
      const placeholders = selectedColumns.map(() => "?").join(", ");

      // device_number와 해당 컬럼들에 맞는 쿼리 작성
      const query = `
            INSERT INTO ${tableName} (
                device_number, ${selectedColumns.join(", ")}
            ) VALUES (?, ${placeholders});
        `;

      // device_number와 셀 값 배열 생성
      const values = [
        data.device_number,
        ...selectedColumns.map((col) => data[col]),
      ];

      db.query(query, values, (err) => {
        if (err) {
          console.error("Query Error:", err);
          return reject(err);
        }
        resolve({ success: true });
      });
    });
  }

  //전압을 보내는 함수
  static async sendCellVoltage(data) {
    return new Promise((resolve, reject) => {
      // 테이블 번호를 결정합니다 (ten_num이 0이면 cell_voltage_0, 9면 cell_voltage_9와 같은 방식)
      const tableNumber = data.ten_num;
      const tableName = `cell_voltage_${tableNumber}`;

      // 셀 컬럼 범위를 설정합니다 (예: 0이면 cell_00~cell_09, 9면 cell_90~cell_97)
      // 마지막 테이블의 경우 endCell을 97로 설정하여 cell_90부터 cell_97까지만 가져오도록 수정
      const startCell = tableNumber * 10;
      const endCell = tableNumber === 9 ? 97 : startCell + 9;
      let cellColumns = Array.from(
        { length: endCell - startCell + 1 },
        (_, i) => `cell_${String(startCell + i).padStart(2, "0")}`
      ).join(", ");

      console.log(cellColumns);
      if (data.ten_num == 9) cellColumns = cellColumns.substring(0, 70);
      console.log(cellColumns);
      // SQL 쿼리 작성
      const query = `
        SELECT 
            device_number, ${cellColumns}, created_at
        FROM ${tableName}
        WHERE device_number = ?
        ORDER BY created_at DESC
        LIMIT 1;
      `;

      // 쿼리 실행
      db.query(query, [data.device_number], (err, results) => {
        if (err) {
          return reject(err);
        }
        if (results.length === 0) {
          return resolve({ message: "No data found" });
        }
        resolve(results[0]); // 최신 데이터 1개 반환
      });
    });
  }

  //cell 전압 page
  static async sendCellVoltagePage(data) {
    return new Promise((resolve, reject) => {
      // cell_number에 따라 테이블 이름 결정
      const tableIndex = Math.floor(data.cell_number / 10); // 예: cell_number 3 -> tableIndex 0
      const tableName = `cell_voltage_${tableIndex}`;

      // cell_number에 따라 컬럼명 결정
      const cellColumn = `cell_${String(data.cell_number).padStart(2, "0")}`; // 예: cell_03

      const limit = 10; // 한 번에 가져올 데이터 수
      const offset = (data.page - 1) * limit; // 페이지 계산

      // 동적으로 생성된 쿼리
      const query = `
        SELECT  
          ${cellColumn} AS cell_value, 
          created_at
        FROM ${tableName}
        WHERE device_number = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?;
      `;

      // 쿼리 실행
      db.query(query, [data.device_number, limit, offset], (err, results) => {
        if (err) {
          return reject(err); // 쿼리 오류 처리
        }

        if (results.length === 0) {
          return resolve({ message: "No data found" }); // 데이터가 없을 경우
        }

        resolve(results); // 결과 반환
      });
    });
  }

  // battery status를 저장하는 함수 위도 경도 추가
  static async saveBatteryStatus(data) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO battery_status(device_number, charging_percent, battery_power,charging,latitude,longitude) VALUES(?,?,?,?,?,?);";
      db.query(
        query,
        [
          data.device_number,
          data.charging_percent,
          data.battery_power,
          data.charging,
          data.latitude,
          data.longitude,
        ],
        (err) => {
          if (err) reject(err);
          resolve({ success: true });
        }
      );
    });
  }
  // // battery status를 저장하는 함수
  // static async saveBatteryStatus(data) {
  //   return new Promise((resolve, reject) => {
  //     const query =
  //       "INSERT INTO battery_status(device_number, charging_percent, battery_power,charging) VALUES(?,?,?,?);";
  //     db.query(
  //       query,
  //       [
  //         data.device_number,
  //         data.charging_percent,
  //         data.battery_power,
  //         data.charging,
  //       ],
  //       (err) => {
  //         if (err) reject(err);
  //         resolve({ success: true });
  //       }
  //     );
  //   });
  // }

  static async sendBatteryStatus(data) {
    const BATTERY_CAPACITY = 64; // 배터리 총 용량 (kWh)

    return new Promise((resolve, reject) => {
      const query =
        "SELECT charging_percent, battery_power FROM battery_status WHERE device_number = ? ORDER BY created_at DESC LIMIT 1;";

      db.query(query, data.device_number, (err, results) => {
        if (err) return reject(err); // 쿼리 실행 중 오류 처리

        if (results.length > 0) {
          // 쿼리 결과에서 변수에 저장
          const charging_percent = results[0].charging_percent; // 충전 퍼센트
          const battery_power = results[0].battery_power; // 배터리 파워
          console.log(results);

          // SOC 계산 (충전 퍼센트를 소수로 변환)
          const soc = charging_percent / 100;

          // 남은 충전 용량 계산 (kWh)
          const remaining_capacity = BATTERY_CAPACITY * (1 - soc);

          // 충전 속도 절대값 계산 (kW)
          const charging_speed = Math.abs(battery_power);

          // 남은 충전 시간 계산 (시간)
          const remaining_time =
            charging_speed > 0 ? remaining_capacity / charging_speed : Infinity; // 충전 속도가 0이면 무한대 반환

          // 남은 충전 시간을 시간과 분으로 변환
          const totalMinutes = Math.floor(remaining_time * 60); // 전체 분
          const Hour = Math.floor(totalMinutes / 60); // 시간
          const Minit = totalMinutes % 60; // 분

          // 결과 반환 (요청한 형식으로)
          resolve({
            Hour, // 남은 시간
            Minit, // 남은 분
          });
        } else {
          // 데이터가 없을 경우 처리
          resolve({ message: "No battery status found for this device." });
        }
      });
    });
  }
}

module.exports = CarStorage;
