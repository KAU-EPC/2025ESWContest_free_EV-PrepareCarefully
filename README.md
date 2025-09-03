# 🚗 EV-PrepareCarefully

> **2025 임베디드 소프트웨어 경진대회 자유공모전**  
> 전기차 배터리 관리 및 안전 모니터링 통합 플랫폼

## 📋 프로젝트 개요

**EV-PrepareCarefully**는 전기차의 배터리 상태를 실시간으로 모니터링하고 관리하는 IoT 기반 통합 플랫폼입니다. 하드웨어 센서, 백엔드 서버, 모바일 앱이 유기적으로 연결되어 전기차 배터리의 안전성을 보장하고 최적의 충전 관리를 제공합니다.

### ✨ 주요 기능

- 🔋 **실시간 배터리 모니터링**: 98개 셀 전압, 4개 모듈 온도 실시간 추적
- ⚡ **셀 밸런싱 진단**: 셀 간 전압 편차 분석 및 위험 상황 알림
- 🌡️ **온도 관리**: 배터리 과열/저온 상황 감지 및 경고
- 📍 **스마트 충전소 안내**: GPS 기반 주변 충전소 검색 및 길찾기
- 🤖 **AI 챗봇**: 전기차 관련 질문 및 정비소 정보 제공
- 📅 **완속 충전 스케줄링**: 배터리 수명 연장을 위한 충전 계획 관리


## 📁 프로젝트 구조

```
2025ESWContest_free_1159/
├── 📱 App/                     # Android 모바일 애플리케이션
│   ├── app/src/main/java/com/example/myapplication/
│   │   ├── MainActivity.kt     # 메인 액티비티
│   │   ├── MainScreen.kt       # 대시보드 화면
│   │   ├── BatteryTemperatureScreen.kt  # 배터리 온도 모니터링
│   │   ├── CellBalanceScreen.kt # 셀 밸런싱 진단
│   │   ├── ChatBot/            # AI 챗봇 기능
│   │   ├── Server/             # API 통신 모듈
│   │   └── Settings/           # 설정 화면들
│   └── app/src/main/res/       # 리소스 파일들
├── 🔧 HW/                      # 하드웨어 Arduino 코드
│   ├── 서버통신용 FIN/          # 실제 하드웨어 통신 코드
│   └── 시뮬레이션 FIN/          # 테스트용 시뮬레이션 코드
└── 🖥️ Sever/                   # Node.js 백엔드 서버
    ├── app.js                  # Express 서버 메인
    ├── routes/                 # API 라우트 정의
    ├── models/                 # 데이터 모델 및 DB 처리
    └── bin/www.js             # 서버 실행 파일
```

## 💡 핵심 기술 스택

### 📱 모바일 앱 (Android)

- **언어**: Kotlin
- **UI 프레임워크**: Jetpack Compose
- **아키텍처**: MVVM Pattern
- **네트워킹**: Retrofit2 + OkHttp
- **주요 라이브러리**:
  - `androidx.navigation:navigation-compose` - 화면 네비게이션
  - `com.airbnb.android:lottie-compose` - 애니메이션
  - `androidx.compose.material3` - Material Design 3

### 🖥️ 백엔드 서버 (Node.js)

- **프레임워크**: Express.js
- **데이터베이스**: MySQL
- **주요 라이브러리**:
  - `cors` - CORS 정책 관리
  - `mysql2` - MySQL 연결
  - `morgan` - HTTP 요청 로깅

### 🔧 하드웨어 (ESP32)

- **플랫폼**: Arduino Framework
- **통신 프로토콜**: CAN Bus, Wi-Fi
- **주요 라이브러리**:
  - `ArduinoJson` - JSON 데이터 처리
  - `MCP2515` - CAN 통신
  - `TinyGPS++` - GPS 데이터 파싱

## 📊 주요 화면 및 기능

### 🏠 메인 대시보드

- 실시간 배터리 충전량 표시
- 4개 모듈 온도 순환 표시
- 완속 충전 권장 날짜 알림
- 차량 주행 정보 (거리, 시간, 전비)

### 🌡️ 배터리 온도 모니터링

- 4개 모듈별 온도 실시간 측정
- 과열/저온 경고 시스템
- 온도 이력 조회 기능
- GPS 기반 주변 충전소 검색

### ⚖️ 셀 밸런싱 진단

- 98개 셀 전압 시각화
- 셀 간 전압 편차 분석
- 위험 셀 식별 및 알림
- 밸런싱 상태 종합 진단

### 🤖 AI 챗봇

- 전기차 관련 질문 답변
- 주변 정비소 정보 제공
- GPT 기반 자연어 처리
- 위치 기반 맞춤 정보

## 🎯 프로젝트 특징

### 🔒 안전성

- 실시간 배터리 상태 모니터링
- 위험 상황 즉시 알림
- 다층 안전 검증 시스템

### 🌐 확장성

- 모듈식 아키텍처 설계
- RESTful API 기반 통신
- 다양한 전기차 모델 지원 가능

### 🎨 사용자 경험

- 직관적인 Material Design 3 UI
- 실시간 데이터 시각화
- AI 기반 사용자 지원

## 👥 개발팀

- **하드웨어 개발**: ESP32 기반 CAN 통신 및 센서 데이터 수집
- **백엔드 개발**: Node.js Express 서버 및 MySQL 데이터베이스 설계
- **모바일 앱 개발**: Android Kotlin + Jetpack Compose UI 구현

## 📄 라이선스

이 프로젝트는 2025 임베디드 소프트웨어 경진대회 출품작입니다.

---

⚡ **EV-PrepareCarefully**로 더 안전하고 스마트한 전기차 라이프를 시작하세요!
