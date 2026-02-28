# Hotel Management and Reservation System

Full-stack hotel management web application with role-based access for guests and admins.  
Guests can browse rooms, register/login, book rooms, and pay via Stripe.  
Admins can manage rooms, room types, amenities, reservations, and users.

## Tech Stack

- **Frontend**: React 19, Vite, React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express, Sequelize
- **Database**: PostgreSQL
- **Auth**: JWT (Bearer token)
- **Payments**: Stripe Checkout
- **Email**: Nodemailer (verification + password reset flows)
- **Testing**: Jest + Supertest (backend)

## Repository Structure

```text
Hotel_Management_and_Reservation_System/
  backend/
    controllers/
    models/
    routes/
    helpers/
    database/
  frontend/
    src/
    public/
```
Key Features

- User registration and login
- Email verification and forgot/reset password
- Role-based authorization (user, admin)
- Room and room type management
- Room amenity management
- Reservation creation and lifecycle updates
- Availability search for rooms
- Stripe checkout and payment verification
- Admin dashboard pages (inventory, housekeeping, expenses, invoices, reviews, users)

Prerequisites
- Node.js 18+ (recommended)
- npm 9+
- PostgreSQL 14+ (or compatible)
- Stripe account (for payment flow)
  
**Environment Variables**

Create backend/.env:

```text
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotel_management
TEST_DB_NAME=hotel_management_test
DB_USER=postgres
DB_PASS=your_db_password

# Auth
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Email (Nodemailer)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx

# Optional
PORT=3000
NODE_ENV=development
```

Create frontend/.env:
```text
VITE_API_BASE_URL=http://localhost:3000
```

**Installation**

- Install backend dependencies:
```text
cd backend
npm install
```
- Install frontend dependencies:
```text
cd ../frontend
npm install
```

**Run Locally**

- Start backend Server
```text
cd backend
npm start
```

- Start frontend Server
```text
cd frontend
npm run dev
```

- Open

  - Frontend: http://localhost:5173
  - Backend: http://localhost:3000
 
**Available Scripts**

- Backend (/backend)

  - npm start - run server with nodemon

  - npm test - run Jest tests

- Frontend (/frontend)

  - npm run dev - start Vite dev server

  - npm run build - production build

  - npm run preview - preview production build

  - npm run lint - run ESLint

- API Base Routes

  - /api/user - auth, profile, password flows

  - /api/admin - admin user management

  - /api/rooms - room CRUD and availability

  - /api/room-types - room type CRUD

  - /api/room-amenities - amenity CRUD

  - /api/reservations - reservation operations

  - /api/payments - Stripe checkout + verification

- Notes

  - Backend currently allows CORS from http://localhost:5173 and http://localhost:5174.

  - Stripe success/cancel redirect URLs are currently hardcoded for local frontend URLs in backend/controllers/paymentController.js.

  - Some backend tests assume specific seed users (for login test cases).

- Future Improvements

  - Add Docker setup for one-command local environment

  - Add migration/seed scripts for consistent DB initialization

  - Add centralized error handling and request validation

  - Add CI pipeline for lint + test + build
