# MoneyMate 배포 가이드

MoneyMate를 프로덕션 환경에 배포할 때 참고할 설정과 절차입니다.

---

## 목차

1. [개요](#1-개요)
2. [배포 아키텍처](#2-배포-아키텍처)
3. [백엔드 배포](#3-백엔드-배포)
4. [프론트엔드 배포](#4-프론트엔드-배포)
5. [데이터베이스](#5-데이터베이스)
6. [환경 변수·설정](#6-환경-변수설정)
7. [CORS·보안](#7-cors보안)
8. [체크리스트](#8-체크리스트)

---

## 1. 개요

- **백엔드**: Spring Boot JAR로 실행. JDK 21, MySQL 연결 필요.
- **프론트엔드**: 정적 빌드 결과물(HTML/JS/CSS)을 웹 서버(Nginx, Apache, S3+CloudFront 등)로 서빙.
- **DB**: MySQL 8.x 권장. 별도 서버 또는 관리형 DB 사용.

---

## 2. 배포 아키텍처

```
[ 사용자 ]
     │
     ▼
[ 웹 서버 / CDN ]  ←  React 빌드 결과 (정적 파일)
     │
     │  API 요청
     ▼
[ Spring Boot (JAR) ]  ←  포트 8080 (또는 역방향 프록시 뒤)
     │
     ▼
[ MySQL ]
```

- React 앱과 API를 같은 도메인에서 서빙하려면 Nginx 등에서 `/api` 를 백엔드로 프록시하는 구성이 일반적입니다.

---

## 3. 백엔드 배포

### 3.1 JAR 빌드

```bash
cd money-mate-server
./gradlew clean build -x test
```

- `build/libs/money_mate_server-0.0.1-SNAPSHOT.jar` (또는 해당 JAR) 생성.

### 3.2 실행

```bash
java -jar build/libs/money_mate_server-0.0.1-SNAPSHOT.jar
```

- DB 등 설정은 `application.properties` 또는 환경 변수로 오버라이드 (아래 참고).

### 3.3 systemd 예시 (Linux)

```ini
[Unit]
Description=MoneyMate Backend
After=network.target mysql.service

[Service]
Type=simple
User=app
WorkingDirectory=/opt/moneymate
ExecStart=/usr/bin/java -jar /opt/moneymate/money_mate_server.jar
Environment=SPRING_PROFILES_ACTIVE=prod
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

---

## 4. 프론트엔드 배포

### 4.1 빌드 시 API URL

- 프로덕션 API 주소를 빌드에 반영하려면 `REACT_APP_API_URL` 등 환경 변수를 사용합니다.
- 예: `.env.production` 에 `REACT_APP_API_URL=https://api.example.com` 설정 후 `npm run build`.

### 4.2 정적 파일 서빙

- `npm run build` 후 `build/` 디렉터리를 Nginx, Apache, S3+CloudFront 등에 올립니다.
- SPA이므로 모든 경로를 `index.html` 로 fallback 하도록 설정합니다 (Nginx: `try_files $uri /index.html`).

---

## 5. 데이터베이스

- MySQL을 별도 서버에 두는 경우 `application.properties` 의 `spring.datasource.url` 등을 프로덕션 DB로 변경.
- 스키마는 `docs/DATABASE_SCHEMA.md` 의 DDL로 생성하거나, 기존 마이그레이션 정책에 맞춥니다.
- 백업·복구 정책을 수립하고 정기 백업을 권장합니다.

---

## 6. 환경 변수·설정

### 6.1 백엔드 (Spring Boot)

- `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` 등으로 DB 오버라이드 가능.
- `SPRING_PROFILES_ACTIVE=prod` 로 프로파일 분리 권장.

### 6.2 프론트엔드

- Create React App 기준 `REACT_APP_*` 변수가 빌드 시 코드에 주입됩니다.
- API 베이스 URL을 `REACT_APP_API_URL` 로 두고, 각 api 모듈에서 사용하도록 수정하면 됩니다.

---

## 7. CORS·보안

- 백엔드에서 프로덕션 프론트 도메인(예: `https://moneymate.example.com`)을 CORS에 허용하도록 설정합니다.
- 인증을 도입할 경우 JWT/세션 도메인·쿠키 설정을 확인합니다.
- HTTPS 사용을 권장합니다.

---

## 8. 체크리스트

- [ ] MySQL 프로덕션 DB 생성·접속 정보 반영
- [ ] 백엔드 JAR 빌드 및 실행 확인
- [ ] 프론트엔드 빌드 시 API URL 프로덕션으로 설정
- [ ] 정적 파일 서빙 및 SPA fallback 설정
- [ ] CORS 허용 Origin 프로덕션 도메인으로 제한
- [ ] (선택) 역방향 프록시(Nginx)에서 API 경로를 백엔드로 프록시
- [ ] 로그·모니터링·백업 정책 수립

---

*문서 버전: 1.0 | MoneyMate 배포 가이드*
