# Smart County Development Portal

Smart County Development Portal is a county development operations system built from the supplied MySQL schema and ERD image.

## Structure

- `frontend/` - React, TypeScript, Tailwind CSS portal UI.
- `backend/` - Laravel-compatible API source, models, controllers, migrations, and seeders.
- `database/` - Original `mysql.sql` schema reference.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The local dev server is currently running at `http://127.0.0.1:5173`.

## Backend

The Laravel API is configured for XAMPP MySQL/MariaDB:

```text
API: http://127.0.0.1:8000
Database: governor_project
User: root
Password: empty
```

Composer is available locally as `backend/composer.phar` if it is not installed globally.
