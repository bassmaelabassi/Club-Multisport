# Club Multisport Backend API

## Description
Backend API for the Club Multisport platform built with Node.js, Express.js, and MongoDB.

## Features
- User authentication and authorization (JWT)
- Activity management (CRUD operations)
- Reservation system with payment integration
- Coach management and reviews
- Notification system
- Email notifications
- Loyalty points system
- Admin dashboard with statistics

## Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/club_multisport

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Email Configuration (Nodemailer)
MAIL_SERVICE=gmail
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM=your_email@gmail.com

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:3000

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=3600000
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)
- `PUT /api/users/:id/ban` - Ban/unban user (admin only)

### Activities
- `GET /api/activities` - Get all activities
- `GET /api/activities/:id` - Get activity by ID
- `POST /api/activities` - Create activity (admin/coach only)
- `PUT /api/activities/:id` - Update activity (admin/coach only)
- `DELETE /api/activities/:id` - Delete activity (admin only)

### Reservations
- `GET /api/reservations` - Get all reservations (admin) or user reservations
- `GET /api/reservations/:id` - Get reservation by ID
- `POST /api/reservations` - Create reservation
- `PUT /api/reservations/:id/status` - Update reservation status (admin only)
- `DELETE /api/reservations/:id` - Cancel reservation

### Payments
- `POST /api/payments/create-payment-intent` - Create Stripe payment intent
- `POST /api/payments/confirm-payment` - Confirm payment
- `POST /api/payments/refund/:reservationId` - Refund payment (admin only)

### Reviews
- `GET /api/reviews/activity/:activityId` - Get activity reviews
- `GET /api/reviews/coach/:coachId` - Get coach reviews
- `GET /api/reviews/user` - Get user's reviews
- `GET /api/reviews/stats` - Get review statistics
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review

### Coaches
- `GET /api/coaches` - Get all coaches
- `GET /api/coaches/:id` - Get coach by ID
- `POST /api/coaches` - Create coach (admin only)
- `PUT /api/coaches/:id` - Update coach
- `DELETE /api/coaches/:id` - Delete coach (admin only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification
- `POST /api/notifications/send` - Send notification (admin only)

### Statistics
- `GET /api/stats/dashboard` - Get dashboard statistics (admin only)
- `GET /api/stats/activities` - Get activity statistics
- `GET /api/stats/users` - Get user statistics
- `GET /api/stats/revenue` - Get revenue statistics

## Models

### User
- firstName, lastName, email, password
- role (user, coach, admin)
- birthDate, phone, address
- loyaltyPoints, rating, reviewsCount
- isActive, createdAt

### Activity
- name, category, description
- coach (reference to User)
- schedule (array of time slots)
- price, duration, location
- image, isActive, createdAt

### Reservation
- user, activity (references)
- schedule (day, date, startTime, endTime)
- status (pending, confirmed, cancelled, completed)
- paymentStatus, paymentMethod, amountPaid
- transactionId, createdAt

### Review
- user, activity, coach (references)
- rating (1-5), comment
- createdAt

### Notification
- user (reference)
- title, message, type
- isRead, relatedEntity
- createdAt

## Security Features
- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- XSS protection
- MongoDB injection protection
- Input validation and sanitization

## Payment Integration
- Stripe payment processing
- Payment intent creation
- Payment confirmation
- Refund functionality

## Email Notifications
- Welcome emails
- Reservation confirmations
- Payment confirmations
- Cancellation notifications
- Promotional emails
- Password reset emails
- Loyalty points notifications

## Development
```bash
# Start development server
npm run dev

# Start production server
npm start
```

## Production Deployment
1. Set NODE_ENV=production
2. Configure production database
3. Set up proper CORS origins
4. Configure email service
5. Set up Stripe production keys
6. Use PM2 or similar process manager 