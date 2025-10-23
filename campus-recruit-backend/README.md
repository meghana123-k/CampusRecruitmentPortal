# Campus Recruitment Management Portal - Backend

A Node.js + Express + TypeScript backend for the Campus Recruitment Management Portal (CRMP).

## Features

- **JWT-based Authentication**: Secure user authentication with role-based access control
- **Role-based Authorization**: Support for Admin, Student, and Recruiter roles
- **RESTful API**: Well-structured API endpoints for all CRUD operations
- **Database Integration**: MySQL database with Sequelize ORM
- **Input Validation**: Comprehensive request validation using express-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Security**: Helmet for security headers, CORS configuration, rate limiting
- **Logging**: Morgan for HTTP request logging

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors
- **Logging**: morgan

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get current user profile (protected)
- `PUT /profile` - Update user profile (protected)
- `PUT /change-password` - Change password (protected)

### Users (`/api/v1/users`) - Admin Only
- `GET /` - Get all users (with pagination and filtering)
- `GET /stats` - Get user statistics
- `POST /` - Create new user
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user
- `PATCH /:id/toggle-status` - Toggle user active status

### Jobs (`/api/v1/jobs`)
- `GET /` - Get all jobs (public, with pagination and filtering)
- `GET /stats` - Get job statistics (public)
- `GET /:id` - Get job by ID (public)
- `POST /` - Create new job (Recruiter/Admin)
- `PUT /:id` - Update job (Recruiter/Admin)
- `DELETE /:id` - Delete job (Recruiter/Admin)
- `GET /recruiter/:recruiterId?` - Get jobs by recruiter (Recruiter/Admin)

### Applications (`/api/v1/applications`)
- `POST /` - Apply for a job (Student/Admin)
- `GET /` - Get applications (role-based filtering)
- `GET /stats` - Get application statistics
- `GET /:id` - Get application by ID
- `PUT /:id/status` - Update application status (Recruiter/Admin)
- `DELETE /:id` - Delete application (Student/Admin)
- `GET /job/:jobId` - Get applications for a job (Recruiter/Admin)

## Database Models

### User
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `firstName`
- `lastName`
- `role` (admin, student, recruiter)
- `isActive` (Boolean)
- `createdAt`, `updatedAt`

### Job
- `id` (Primary Key)
- `title`
- `description`
- `requirements`
- `location`
- `salaryMin`, `salaryMax`
- `jobType` (full_time, part_time, internship, contract)
- `status` (active, inactive, closed)
- `recruiterId` (Foreign Key to User)
- `applicationDeadline`
- `createdAt`, `updatedAt`

### Application
- `id` (Primary Key)
- `studentId` (Foreign Key to User)
- `jobId` (Foreign Key to Job)
- `status` (pending, reviewed, shortlisted, rejected, accepted)
- `coverLetter`
- `resumeUrl`
- `appliedAt`
- `reviewedAt`
- `notes`
- `createdAt`, `updatedAt`

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `config.env` and update the values:
   ```env
   NODE_ENV=development
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=campus_recruit_db
   DB_USER=root
   DB_PASSWORD=your_password
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   FRONTEND_URL=http://localhost:5173
   ```

3. **Database Setup**
   - Create MySQL database: `campus_recruit_db`
   - The application will automatically create tables on startup

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Default Admin User

A default admin user is created automatically:
- **Email**: admin@campusrecruit.com
- **Password**: admin123
- **Role**: admin

## API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Pagination

Use query parameters for pagination:
- `?page=1` - Page number (default: 1)
- `?limit=10` - Items per page (default: 10)

## Filtering

Use query parameters for filtering:
- `?role=student` - Filter by user role
- `?status=active` - Filter by job/application status
- `?search=keyword` - Search in relevant fields
- `?location=city` - Filter by location

## Development

- **TypeScript**: Full TypeScript support with strict type checking
- **Hot Reload**: Nodemon for automatic server restart during development
- **Linting**: ESLint configuration for code quality
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Sequelize ORM prevents SQL injection
- **CORS**: Configurable Cross-Origin Resource Sharing
- **Rate Limiting**: Basic rate limiting to prevent abuse
- **Security Headers**: Helmet for security headers
