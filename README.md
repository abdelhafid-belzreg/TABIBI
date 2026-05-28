<p align="center">
  <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="200" alt="Laravel Logo">&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="180" alt="React Logo">
</p>

<h1 align="center">TABIBI — Doctor Appointment Booking Platform</h1>

<p align="center">
  <strong>طبيبي</strong> — "My Doctor" in Arabic/Darija
  <br>
  A full-stack web application connecting patients with doctors in Morocco.
</p>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [System Roles](#system-roles)
- [Features](#features)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Installation](#installation)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

TABIBI is a **doctor appointment booking platform** tailored for the Moroccan healthcare market. It provides a three-role system:

| Role | Description |
|------|-------------|
| **Patient** | Browse doctors, book appointments, manage profile |
| **Doctor** | Manage availability, handle appointments, update profile |
| **Admin** | Oversee platform, validate doctors, view reports & charts |

---

## Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **Laravel 12** (PHP ^8.2) | API framework |
| **Laravel Sanctum** | API token authentication |
| **MySQL / SQLite** | Database (SQLite default for dev) |
| **Mail (SMTP / Log)** | Email notifications (verification, password reset, contact) |
| **Database Queue** | Async job processing |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **Vite 7** | Build tool & dev server |
| **React Router DOM v7** | Client-side routing |
| **Bootstrap 5.3** | UI components & responsive design |
| **Axios** | HTTP client with interceptor |
| **Chart.js** | Admin dashboard charts |
| **Lucide React** | Icons |

---

## System Roles

### Patient
- Browse doctors by specialty, city, or availability day
- View doctor profiles (bio, qualifications, fees, clinic info)
- Book appointments with a date picker (14-day window) and 30-min time slots
- Manage upcoming and past appointments
- Cancel appointments
- Edit profile (phone, date of birth, medical notes)

### Doctor
- Manage profile (bio, qualifications, consultation fee, clinic, city)
- Set weekly availability schedule (per day-of-week with time ranges)
- View and manage appointment requests (accept, cancel, complete)
- Update password and delete account

### Admin
- Dashboard with stats cards and charts (users, doctors, appointments)
- User management (search, filter, view, delete)
- Doctor validation workflow (approve, reject, or reset to pending)
- Specialty management (add / delete specialties)
- Reports page (completion rate, cancellation rate, revenue, appointments per doctor, trends)

---

## Features

- **Email Verification** — Custom flow with signed URLs, blocking unverified users
- **Password Reset** — Custom reset flow via email token
- **Moroccan Validation** — Phone (`+212`/`0` pattern), CIN (Moroccan ID format), minimum age 18
- **Double-Booking Prevention** — Server-side check before creating appointments
- **Dark / Light Mode** — Toggle persisted in localStorage via Bootstrap `data-bs-theme`
- **Responsive Design** — Bootstrap 5.3 with mobile-friendly layouts
- **Admin Charts** — Bar, Pie, Doughnut, Line charts (Chart.js)

---

## Database Schema

### Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `users` | All platform users | id, name, email, password, role (patient/doctor/admin), cin, phone, email_verified_at |
| `doctor_profiles` | Doctor-specific data | user_id, specialty, bio, qualifications, consultation_fee, clinic_name, city, location, status (pending/approved/rejected) |
| `patient_profiles` | Patient-specific data | user_id, date_of_birth, medical_notes |
| `appointments` | Appointment records | doctor_id, patient_id, appointment_date, appointment_time, status (pending/accepted/cancelled/completed), notes |
| `availabilities` | Doctor weekly schedule | doctor_id, day_of_week (0-6), start_time, end_time |
| `specialties` | Medical specialties | name (unique) |

### Relationships

```
User (1) ── (1) DoctorProfile
User (1) ── (1) PatientProfile
User (1) ── (*) Availability
User (1) ── (*) Appointment (as doctor)
User (1) ── (*) Appointment (as patient)
```

---

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register (patient or doctor) |
| POST | `/api/login` | Login, returns Sanctum token |
| POST | `/api/email/resend` | Resend verification email |
| POST | `/api/forgot-password` | Send password reset link |
| POST | `/api/reset-password` | Reset password |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/doctors` | List approved doctors |
| GET | `/api/doctors/{id}` | Doctor details |
| GET | `/api/doctors/{id}/availability` | Doctor's availability |
| GET | `/api/doctors/{id}/booked-slots` | Booked slots for a date |
| GET | `/api/specialties` | All specialties |
| GET | `/api/stats` | Platform stats |

### Authenticated (Patient / Doctor / Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/logout` | Logout |
| GET | `/api/user` | Current user info |
| GET | `/api/email/verify/{id}/{hash}` | Verify email |

### Doctor Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/doctor/profile` | Get profile |
| PUT | `/api/doctor/profile` | Update profile |
| PUT | `/api/doctor/password` | Change password |
| DELETE | `/api/doctor/account` | Delete account |
| GET | `/api/doctor/availability` | List availability |
| POST | `/api/doctor/availability` | Add slot |
| DELETE | `/api/doctor/availability/{id}` | Delete slot |
| GET | `/api/doctor/appointments` | List appointments |
| PATCH | `/api/doctor/appointments/{id}/status` | Update status |

### Patient Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/patient/profile` | Get profile |
| PUT | `/api/patient/profile` | Update profile |
| PUT | `/api/patient/password` | Change password |
| DELETE | `/api/patient/account` | Delete account |
| GET | `/api/patient/appointments` | List appointments |
| POST | `/api/patient/appointments` | Book appointment |
| PUT | `/api/patient/appointments/{id}/cancel` | Cancel appointment |

### Admin Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/users` | List users |
| DELETE | `/api/admin/users/{id}` | Delete user |
| GET | `/api/admin/doctors/pending` | List doctors (validation) |
| PATCH | `/api/admin/doctors/{id}/status` | Approve/reject doctor |
| GET | `/api/admin/specialties` | List specialties |
| POST | `/api/admin/specialties` | Add specialty |
| DELETE | `/api/admin/specialties/{id}` | Delete specialty |
| GET | `/api/admin/appointments` | All appointments |
| GET | `/api/admin/reports` | Report data with charts |

---

## Frontend Pages

### Public

| Route | Page |
|-------|------|
| `/` | Home (hero, specialties grid, how-it-works, stats, CTA) |
| `/about` | About the platform |
| `/contact` | Contact form |
| `/doctors` | Doctor listing with filters (specialty, city, day) |
| `/doctors/:id` | Doctor profile details |
| `/login` | Login with email verification & password reset |
| `/signup` | Registration with role toggle & Moroccan validation |
| `/email/verify/:id/:hash` | Email verification |
| `/forgot-password` | Forgot password |
| `/reset-password` | Reset password |

### Patient Area (`/patient/*`)

| Route | Page |
|-------|------|
| `/patient/dashboard` | Overview (stats, upcoming appointments) |
| `/patient/appointments` | Appointment list |
| `/patient/book/:doctorId` | Book (date picker, time slots, notes, confirmation) |
| `/patient/profile` | Edit profile |
| `/patient/doctors` | Find doctors (filtered listing) |

### Doctor Area (`/doctor/*`)

| Route | Page |
|-------|------|
| `/doctor/dashboard` | Overview (today's appointments, pending/confirmed counts, quick actions) |
| `/doctor/appointments` | Full appointment list |
| `/doctor/availability` | Weekly schedule (add/delete time slots) |
| `/doctor/profile` | Edit profile |
| `/doctor/password` | Change password |

### Admin Area (`/admin/*`)

| Route | Page |
|-------|------|
| `/admin/dashboard` | Stats cards + charts (users, roles, appointments, trends) |
| `/admin/users` | User management (search, filter, view, delete) |
| `/admin/doctors` | Doctor validation (approve/reject) |
| `/admin/specialties` | Specialty management (add/delete) |
| `/admin/stats` | Detailed statistics with charts |
| `/admin/reports` | Full reports (summary cards, charts, filtered table) |

---

## Installation

### Prerequisites

- PHP ^8.2
- Composer
- Node.js & npm
- Database (SQLite for dev — no setup needed)

### Quick Setup

```bash
git clone <repo-url> tabibi
cd tabibi
composer setup
```

The `composer setup` script runs:
1. `composer install`
2. Creates `.env` from `.env.example` (if not exists)
3. `php artisan key:generate`
4. `php artisan migrate --force`
5. `npm install`
6. `npm run build`

### Manual Setup

```bash
git clone <repo-url> tabibi
cd tabibi

# Backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate

# Frontend
cd frontend && npm install && cd ..
npm run build
```

### Environment

Key `.env` variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_URL` | `http://localhost:8000` | Backend URL |
| `FRONTEND_URL` | `http://localhost:3000` | Frontend URL (CORS) |
| `DB_CONNECTION` | `mysql` | Set to `sqlite` for dev |
| `DB_DATABASE` | `tabibi_db` | MySQL database name |
| `MAIL_MAILER` | `smtp` | Set to `log` to print emails |
| `SESSION_DRIVER` | `database` | Session storage |
| `QUEUE_CONNECTION` | `sync` | Set to `database` for async |

---

## Development

### Run all services (recommended)

```bash
composer dev
```

This runs (via `npx concurrently`):
- `php artisan serve` — Laravel on port **8000**
- `php artisan queue:listen` — Queue worker for emails
- `php artisan pail` — Log viewer
- `npm run dev` — Vite dev server on port **3000**

### Run individually

```bash
# Terminal 1: Backend
php artisan serve

# Terminal 2: Queue worker
php artisan queue:listen --tries=1

# Terminal 3: Logs
php artisan pail

# Terminal 4: Frontend
cd frontend && npm run dev
```

### Testing

```bash
composer test
```

---

## Project Structure

```
TABIBI/
├── app/                    # Laravel backend
│   ├── Http/
│   │   ├── Controllers/    # API controllers (Auth, Doctor, Patient, Admin)
│   │   └── Middleware/     # Admin middleware
│   ├── Models/             # Eloquent models
│   └── Notifications/      # Email notifications
├── bootstrap/              # Laravel bootstrap
├── config/                 # Configuration files
├── database/
│   ├── migrations/         # Schema migrations
│   └── seeders/            # Database seeders
├── frontend/               # React frontend (SPA)
│   ├── src/
│   │   ├── components/     # Shared React components
│   │   ├── contexts/       # React contexts (Auth, Theme)
│   │   ├── pages/          # Page components
│   │   │   ├── admin/
│   │   │   ├── doctor/
│   │   │   └── patient/
│   │   └── App.jsx         # Root component with routing
│   └── package.json
├── routes/                 # API & web routes
│   ├── api.php
│   └── web.php
├── storage/                # Logs, cache, sessions
└── tests/                  # PHPUnit tests
```

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

This project is open-sourced under the [MIT license](LICENSE).
