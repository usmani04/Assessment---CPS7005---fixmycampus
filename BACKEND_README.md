# FixMyCampus Backend

Backend API for the FixMyCampus maintenance reporting system built with Node.js, Express, and MongoDB.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web framework for building REST APIs
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **Bcryptjs**: Password hashing and encryption
- **Nodemailer**: Email notifications
- **Axios**: HTTP client for external API calls
- **CORS**: Cross-Origin Resource Sharing middleware

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

3. Start the server:
```bash
npm run server         # Production
npm run server:dev     # Development with auto-reload
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires token)

### Reports
- `POST /api/reports` - Create new report (requires token)
- `GET /api/reports` - Get all reports (requires token)
- `GET /api/reports/my-reports` - Get user's own reports (requires token)
- `GET /api/reports/:id` - Get specific report (requires token)
- `PUT /api/reports/:id` - Update report (requires token)

## Authentication

Include JWT token in request header:
```
Authorization: Bearer <token>
```

## Database Schema

### User
- name, email, password, studentId, department, role, timestamps

### Report
- title, category, location, description, priority, status, reporter, assignedTo, updates, timestamps
