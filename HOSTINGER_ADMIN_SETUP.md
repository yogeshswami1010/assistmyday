# Assistmyday admin setup on Hostinger

The admin area is available at `/admin`. It manages portfolio projects, services, and blog articles stored in Hostinger MySQL.

## 1. Create the database

In Hostinger hPanel, open **Databases → MySQL Databases** and create a database and database user. Save the host, database name, username, and password. The application creates its content tables and imports the existing site content on its first database connection.

## 2. Add environment variables

Open the Node.js website in hPanel, choose **Settings & Redeploy**, and add:

- `DB_HOST`
- `DB_PORT` (normally `3306`)
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_AUTH_SECRET` (a random value of at least 32 characters)

Do not put real passwords in GitHub or commit a `.env` file.

## 3. Redeploy and sign in

Redeploy the application, open `https://your-domain.com/admin`, and sign in using `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

The public site uses the original built-in content when no database is configured. After MySQL is connected, the existing portfolio, services, and articles are seeded automatically and all subsequent changes are managed from the admin dashboard.
