# Smart County Development Portal API

This folder contains Laravel-compatible API source for the county portal.

The local machine used to generate this project did not have PHP or Composer in `PATH`, so this backend is provided as source files ready to drop into a Laravel application.

## XAMPP Database

The project database can run on XAMPP MySQL/MariaDB with the default local credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=governor_project
DB_USERNAME=root
DB_PASSWORD=
```

Import the provided SQL through phpMyAdmin or with:

```powershell
C:\xampp\mysql\bin\mysql.exe -uroot --execute="source C:/Users/maxwel/Desktop/SCDP/database/mysql.sql"
```

## Local Setup

1. Start XAMPP MySQL.
2. Run:

```powershell
C:\xampp\php\php.exe composer.phar install
C:\xampp\php\php.exe artisan migrate:fresh --seed
C:\xampp\php\php.exe artisan serve --host=127.0.0.1 --port=8000
```

The API routes are defined in `routes/api.php`.
