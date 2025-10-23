# Campus Recruitment Management Portal (CRMP)

A full-stack web application for managing campus recruitment processes, built with React, Node.js, Express, TypeScript, and MySQL.

## 🚀 Features

### Core Functionality
- **JWT-based Authentication** with role-based access control
- **Three User Roles**: Admin, Student, and Recruiter
- **Job Management**: Post, browse, and manage job openings
- **Application System**: Students can apply for jobs with cover letters
- **Dashboard Analytics**: Role-specific dashboards with statistics
- **Responsive Design**: Mobile-friendly interface using Material-UI

### Admin Features
- Manage all user accounts (Students, Recruiters)
- View system-wide statistics
- Access all jobs and applications
- User account activation/deactivation

### Student Features
- Browse available job openings
- Apply for jobs with cover letters
- Track application status
- Manage personal profile

### Recruiter Features
- Post new job openings
- Review and manage applications
- Track application statistics
- Manage job postings

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Axios** for API communication
- **Vite** for build tooling

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MySQL** database
- **Sequelize** ORM
- **JWT** for authentication
- **bcryptjs** for password hashing

## 📁 Project Structure

```
CampusRecruitmentSystem/
├── campus-recruit-app/          # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── contexts/           # React contexts
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # Utility functions
│   └── package.json
├── campus-recruit-backend/      # Node.js backend
│   ├── src/
│   │   ├── config/             # Database configuration
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Custom middleware
│   │   ├── models/             # Sequelize models
│   │   ├── routes/             # API routes
│   │   └── utils/              # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CampusRecruitmentSystem
```

### 2. Backend Setup

```bash
cd campus-recruit-backend

# Install dependencies
npm install

# Create MySQL database
mysql -u root -p
CREATE DATABASE campus_recruit_db;

# Update environment variables in config.env
# Set your database credentials and JWT secret

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd campus-recruit-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

## 🔐 Default Credentials

A default admin user is created automatically:

- **Email**: admin@campusrecruit.com
- **Password**: admin123
- **Role**: admin

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile
- `PUT /api/v1/auth/change-password` - Change password

### User Management (Admin Only)
- `GET /api/v1/users` - Get all users
- `POST /api/v1/users` - Create new user
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `PATCH /api/v1/users/:id/toggle-status` - Toggle user status

### Job Management
- `GET /api/v1/jobs` - Get all jobs
- `POST /api/v1/jobs` - Create job (Recruiter/Admin)
- `GET /api/v1/jobs/:id` - Get job by ID
- `PUT /api/v1/jobs/:id` - Update job (Recruiter/Admin)
- `DELETE /api/v1/jobs/:id` - Delete job (Recruiter/Admin)

### Application Management
- `POST /api/v1/applications` - Apply for job (Student)
- `GET /api/v1/applications` - Get applications
- `PUT /api/v1/applications/:id/status` - Update application status
- `GET /api/v1/applications/job/:jobId` - Get applications for job

## 🗄 Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `firstName`, `lastName`
- `role` (admin, student, recruiter)
- `isActive` (Boolean)
- `createdAt`, `updatedAt`

### Jobs Table
- `id` (Primary Key)
- `title`, `description`, `requirements`
- `location`, `salaryMin`, `salaryMax`
- `jobType` (full_time, part_time, internship, contract)
- `status` (active, inactive, closed)
- `recruiterId` (Foreign Key)
- `applicationDeadline`
- `createdAt`, `updatedAt`

### Applications Table
- `id` (Primary Key)
- `studentId`, `jobId` (Foreign Keys)
- `status` (pending, reviewed, shortlisted, rejected, accepted)
- `coverLetter`, `resumeUrl`
- `appliedAt`, `reviewedAt`
- `notes`
- `createdAt`, `updatedAt`

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=campus_recruit_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
```

## 🧪 Testing

### Backend Testing
```bash
cd campus-recruit-backend
npm test
```

### Frontend Testing
```bash
cd campus-recruit-app
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to your preferred hosting service (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to a static hosting service (Netlify, Vercel, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information
4. Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with basic CRUD operations
- **v1.1.0** - Added role-based dashboards
- **v1.2.0** - Enhanced UI with Material-UI
- **v1.3.0** - Added application management features

## 🎯 Roadmap

- [ ] Email notifications for application status changes
- [ ] Resume upload and parsing
- [ ] Advanced search and filtering
- [ ] Interview scheduling system
- [ ] Analytics and reporting dashboard
- [ ] Mobile app development
- [ ] Integration with external job boards
