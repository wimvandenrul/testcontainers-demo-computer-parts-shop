# Testcontainers Demo — Computer Parts Shop

This repository is a demo application showing how to use Testcontainers with a .NET 10 Web API, an Angular frontend, Microsoft SQL Server as a containerized database, and end-to-end (E2E) tests using Playwright.

The goal: provide a compact, runnable example of local development, automated tests that spin up disposable database containers (Testcontainers), and E2E browser tests.

Contents
- backend/ — .NET 10 Web API
- frontend/ — Angular app
- tests/ — Playwright E2E tests and integration tests
- .github/workflows - Example CI workflow to run the integration tests + E2E browser tests 

Overview
--------
This demo application shows how you can create integration tests using Testcontainers for automated testing. Integration tests and E2E (End-to-end) tests are using Testcontainers to programmatically start an ephemeral MSSQL container so tests run against a fresh database without manual setup. 
This demo project is not intended as a final production reference but rather as an evolving implementation used to explore architecture, testing strategies, and development workflows.

Prerequisites
-------------
- Windows, macOS, or Linux
- Docker (desktop or engine) running and accessible
- .NET 10 SDK
- Node.js (16+) and npm/yarn
- (Optional) Angular CLI: npm install -g @angular/cli
- Playwright tools (installed by npm when running tests)

Environment / Important variables
--------------------------------
- Connection string used by the backend (example):

  Server=localhost,1433;Database=ComputerPartsDb;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True;Encrypt=False;

- Typical environment variables:
  - ASPNETCORE_ENVIRONMENT=Development
  - ConnectionStrings__DefaultConnection (or set via appsettings.Development.json)
  - SA_PASSWORD (only when starting SQL Server container manually)

Running the app locally (for development)
-------------------------------------
Two approaches: using a local (manual) SQL Server instance or use Docker to run a MSSQL instance.

Quickstart (Docker approach):

1. Run backend:

```powershell
cd backend
docker-compose up
```

By default the API will bind to the ports configured in the project (check docker-compose.yml). Open http://localhost:5000 or https://localhost:5001.

2. Create database:
do HTTP GET to /test/reset-db (you can do it easily via Swagger https://localhost:5001/swagger/index.html)

3. Run frontend:

```powershell
cd frontend
npm install
npm start   # or ng serve --open
```


Running tests with Testcontainers
-------------------------------------
A. Backend integration tests (with Testcontainers)

The backend test projects are configured to use Testcontainers. Testcontainers will programmatically pull and start an MSSQL container for the duration of the tests, initialize a fresh database, and dispose the container afterwards.

Run .NET tests:

```powershell
cd backend
dotnet test ComputerPartsShop.sln
```

Notes:
- No manual DB setup is required for integration tests — Testcontainers handles lifecycle and isolation.
- Make sure Docker is running; otherwise tests will fail to start containers.

B. Playwright E2E tests

Playwright tests are located in the tests/ folder and exercise the running app via a real browser. Typical flow:

1. Ensure the backend and frontend are running (see Running the app above). For CI, you can run the server in Docker.
2. Install dependencies and Playwright browsers:

```powershell
cd frontend
npm install
npm run e2e
```

Continuous Integration
----------------------
- In CI pipelines, ensure Docker is available and the runners support starting containers.
- Backend integration tests rely on Testcontainers — allow Docker daemon access.
- For Playwright, install the Playwright browsers in CI via npx playwright install --with-deps (Linux) or npx playwright install.
- There are 2 examples of Github workflows included in this repo (see \\.github folder)

Project structure
-----------------
- backend/ — .NET 10 solution, Web API, EF Core migrations, integration tests using Testcontainers
- frontend/ — Angular application and configuration
- tests/ — Playwright E2E tests and related test runner configuration

Design notes
------------
- Testcontainers provides reproducible integration test environments by launching ephemeral containers per test session. This avoids shared DB state and reduces flakiness.
- Playwright provides reliable browser automation for E2E tests, including headless CI runs and debug-friendly headed runs locally.
- Some trade-offs have been made in favor of speed of iteration and clarity of learning outcomes.
- The frontend was initially generated using AI tools to accelerate development and focus on backend architecture and integration testing strategies with Testcontainers.


Troubleshooting
---------------
- "Docker not running": start Docker Desktop or the Docker daemon.
- "Port already in use": change port mapping (e.g., do not bind MSSQL to 1433 if a local SQL Server is present).
- Permissions: On Linux, Docker may require sudo or appropriate user group membership.

Security notes
--------------
- Sample passwords like "YourStrong!Passw0rd" are for local testing only. Use secure secrets and avoid committing credentials.
- In CI, store passwords and secrets in secure variables/secrets stores.

Contributing
------------
Contributions welcome. Open issues or PRs for improvements, documentation clarifications, or test cases.

License
-------
This project is provided as-is for demo purposes. No explicit license included

Contact
-------
For questions about this demo, open an issue in the repository.

---

End of README
