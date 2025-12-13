# Finance Tracker - Updated

This repo contains a Spring Boot backend and a static frontend (simple HTML/CSS/JS).
Updates performed:
- Modern frontend with theme switching and dynamic sidebar (see Frontend/).
- JWT-based auth demo endpoints (returns token on login/register).
- New endpoints for expenses, CSV/PDF export, and summary.
- Demo localStorage integration for frontend while unauthenticated.

## Run locally (backend)

Requirements: Java 17+, Maven

1. From `project/` run:
   ```bash
   mvn spring-boot:run
   ```
   The backend runs on port 8080 by default.

2. The frontend files are static in `Frontend/`. You can serve them by opening `Frontend/index.html` in your browser or serve via a simple HTTP server:
   ```bash
   cd Frontend
   python3 -m http.server 63342
   ```

## API (quick)

- `POST /api/auth/register` -> `{ "email":"a@b.com", "password":"secret" }` returns `{ "token":"..." }`
- `POST /api/auth/login` -> returns `{ "token":"..." }`
- `GET /api/expenses` (Authorization: Bearer <token>) -> list
- `POST /api/expenses` (Authorization) -> create expense (ExpenseDTO)
- `GET /api/expenses/export/csv` -> download CSV
- `GET /api/expenses/export/pdf` -> download PDF
- `GET /api/expenses/summary` -> totals, by category

## Notes & next steps
- Passwords are stored plaintext in this demo — **hash passwords** before production.
- JwtUtil uses an in-memory generated key — for production persist a secret.
- The current demo associates expenses with a user by prefixing the `description` field — ideally add a `userEmail` column / relationship.
- Replace localStorage demo usage in frontend with API calls to the backend endpoints (main.js and charts.js).

