# FullStack Intern Coding Challenge - Deliverable

Stacks:
- Backend: Express.js + Sequelize (Postgres)
- Frontend: React
- Database: PostgreSQL (can use Docker or local PG)

What is included:
- `backend/` : Express API with Sequelize models for User, Store, Rating, role-based auth (JWT).
- `frontend/` : React app with signup/login, store listing, rating submit/edit, and basic admin/store-owner dashboards.
- `.env.example` files to configure.

Important notes:
- This is a minimal but complete starter implementation. For development convenience the backend will `sequelize.sync()` on start.
- Passwords are hashed using bcrypt. Authentication uses JWT.
- Form validations (name length, address length, password rules, email pattern) enforced server-side and basic client-side.
- Sorting and filtering endpoints are provided.
- To run locally:
  1. Create a PostgreSQL database (e.g. `fs_challenge_dev`) and export credentials in `backend/.env`.
  2. From `backend/`: `npm install` then `npm run dev` (uses nodemon) or `node src/index.js`
  3. From `frontend/`: `npm install` then `npm start`
