# SmartURL — Intelligent URL Shortening & Analytics Platform

SmartURL is an enterprise-grade URL shortening, QR-code generation, spam detection and analytics platform. The repository contains a Spring Boot backend (smarturl-backend) and a React + TypeScript frontend (smarturl-frontend), along with SRS and run scripts.

Highlights
- Short URL generation (auto-generated Base62 and custom aliases)
- QR-code generation per shortened URL (PNG/Base64)
- Spam & phishing detection and risk classification
- Real-time click analytics (browser, OS, device, location, referrer)
- JWT-based authentication and role-based access control
- OpenAPI / Swagger UI for API exploration

Repository layout
- smarturl-backend/ — Spring Boot (Java 21) backend (REST API, MySQL/H2, JWT, QR generation)
- smarturl-frontend/ — React + TypeScript frontend (Vite)
- SRS.md — Software Requirements Specification (detailed features, DB schema, non-functional requirements)
- presentation.md — Project presentation
- run_project.bat, run_project.ps1 — Convenience scripts to start backend + frontend dev servers

Technologies
- Backend: Java 21, Spring Boot, Spring Data JPA, Spring Security, Springdoc OpenAPI, MySQL (runtime), H2 (dev/test), ZXing (QR), JJWT (JWT)
- Frontend: React, TypeScript, Vite, Tailwind, Recharts, Axios
- Dev: Maven (mvnw wrapper included), npm/yarn

Quick prerequisites
- Java 21 (OpenJDK 21 recommended)
- Maven (optional — project includes the Maven Wrapper `mvnw`)
- Node.js (>=18) and npm
- MySQL (for production) or use the included H2 for local dev
- Git (to clone)

Getting started — development (local)

1) Clone the repository
   git clone https://github.com/hackwith-ankit/urlshortner.git
   cd urlshortner

2) Backend (development)
- Default dev port: 8080
- The backend uses Spring Boot and can run with the Maven wrapper.

Linux / macOS:
  cd smarturl-backend
  ./mvnw spring-boot:run

Windows (PowerShell / cmd):
  cd smarturl-backend
  .\mvnw spring-boot:run

Notes:
- Java 21 must be available on PATH.
- By default the project includes an H2 dependency for local/testing. To use MySQL, configure the datasource environment variables (see Environment variables section).

3) Frontend (development)
- Default dev port: 5173

cd smarturl-frontend
npm install
npm run dev

Open the frontend at: http://localhost:5173/
Backend API default base URL: http://localhost:8080/

Convenience launcher
- For Windows, you can use run_project.bat to open both backend and frontend dev servers in separate consoles.
- PowerShell version: run_project.ps1

Environment variables / configuration

Backend (Spring Boot)
You can set these as environment variables, or use `application.properties` / `application.yml` in the backend.

Common env vars:
- SPRING_DATASOURCE_URL (e.g., jdbc:mysql://localhost:3306/smarturl?serverTimezone=UTC)
- SPRING_DATASOURCE_USERNAME
- SPRING_DATASOURCE_PASSWORD
- SPRING_JPA_HIBERNATE_DDL_AUTO (e.g., update, validate, none)
- JWT_SECRET (secret used to sign JWT tokens)
- JWT_ACCESS_TOKEN_EXPIRY (optional; default: 15m)
- JWT_REFRESH_TOKEN_EXPIRY (optional; default: 7d)
- SPRING_PROFILES_ACTIVE (e.g., dev, prod)

Example (Linux/macOS):
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/smarturl?serverTimezone=UTC"
export SPRING_DATASOURCE_USERNAME="smartuser"
export SPRING_DATASOURCE_PASSWORD="smartpassword"
export JWT_SECRET="change-me-to-a-secure-random-value"

Frontend (Vite)
Create a `.env` in the smarturl-frontend folder with at least:
VITE_API_BASE_URL="http://localhost:8080/api"

Build & production
- Backend: package with Maven and run the produced jar.
  cd smarturl-backend
  ./mvnw clean package
  java -jar target/smarturl-backend-1.0.0.jar

- Frontend: build static assets and deploy to static host or serve through backend static resources.
  cd smarturl-frontend
  npm run build
  # uploaded to CDN/static server or copy into backend resources if configured

API docs
- The backend exposes OpenAPI/Swagger UI via springdoc. Try:
  http://localhost:8080/swagger-ui.html
  or
  http://localhost:8080/swagger-ui/index.html

Database
- Development: H2 is included as a convenient default for tests/dev.
- Production: MySQL is the intended runtime DB. Ensure you create the database and provide the Spring datasource URL/credentials.

Testing
- Backend tests: mvn test (run inside smarturl-backend)
- Frontend tests: depends on project setup (no explicit test scripts in package.json; add as needed)

Common troubleshooting
- Java version mismatch: ensure `java -version` returns 21.
- Port conflicts: backend defaults to 8080, frontend to 5173 — change either with Spring properties or Vite config.
- Maven wrapper permission errors (Unix): chmod +x mvnw

Project ideas & next steps
- Add a top-level README (this file) to the repository (if not already present).
- Add CI workflows to build/test both backend and frontend on each push/pull request.
- Add sample `application.yml.example` and `.env.example` files to streamline local setup.
- Add automated seed scripts to create an admin user for easier manual testing.

Contributing
- Issues and pull requests are welcome. Please follow these guidelines:
  - Open an issue to discuss larger changes before implementing them.
  - Keep commits small and focused.
  - Add/update unit and integration tests when changing business logic.

License
- No license file present in the repository. If this project should be open-source, add an appropriate LICENSE (MIT, Apache-2.0, etc.).

Contact / Author
- See repository owner: hackwith-ankit
- For questions or collaboration, open an issue in this repository.

---

For convenience, here's a minimal example .env (frontend) and a sample backend environment snippet:

```env
# smarturl-frontend/.env
VITE_API_BASE_URL="http://localhost:8080/api"


# example backend env (Linux/macOS)
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/smarturl?serverTimezone=UTC"
export SPRING_DATASOURCE_USERNAME="smartuser"
export SPRING_DATASOURCE_PASSWORD="smartpassword"
export JWT_SECRET="replace-with-a-long-random-secret"
