# Campus Recruitment Management Portal - Frontend

A React + TypeScript + Material-UI frontend for the Campus Recruitment Management Portal (CRMP).

## Features

- **Modern UI**: Built with Material-UI (MUI) for a professional and responsive design
- **TypeScript**: Full type safety throughout the application
- **Authentication**: JWT-based authentication with role-based access control
- **Role-based Dashboards**: Different interfaces for Admin, Student, and Recruiter roles
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **State Management**: Context API for authentication state management
- **Protected Routes**: Route protection based on authentication and user roles
- **Form Validation**: Client-side validation with error handling

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **State Management**: React Context API

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ProtectedRoute.tsx
├── contexts/            # React contexts for state management
│   └── AuthContext.tsx
├── hooks/               # Custom React hooks
├── pages/               # Page components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── DashboardPage.tsx
├── services/            # API services
│   └── api.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

## User Roles

### Admin
- Manage all users (Students, Recruiters)
- View system statistics
- Access all jobs and applications
- User management capabilities

### Student
- Browse available jobs
- Apply for jobs
- Track application status
- Manage profile

### Recruiter
- Post job openings
- Review applications
- Manage job postings
- Track application statistics

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Environment Configuration

The frontend connects to the backend API at `http://localhost:5000/api/v1` by default. To change this, update the `baseURL` in `src/services/api.ts`.

## Authentication Flow

1. **Login/Register**: Users can authenticate via the login or register pages
2. **Token Storage**: JWT tokens are stored in localStorage
3. **Protected Routes**: Routes are protected based on authentication status
4. **Role-based Access**: Different components are shown based on user role
5. **Auto-logout**: Users are automatically logged out when tokens expire

## API Integration

The frontend communicates with the backend through the `ApiService` class in `src/services/api.ts`. All API calls include:

- Automatic token attachment to requests
- Error handling for authentication failures
- Type-safe request/response handling
- Automatic token refresh handling

## Components

### ProtectedRoute
- Wraps components that require authentication
- Supports role-based access control
- Redirects unauthenticated users to login

### AuthContext
- Manages authentication state
- Provides login, register, logout functions
- Handles token storage and validation

### DashboardPage
- Role-specific dashboard interface
- Shows relevant statistics and quick actions
- Responsive design for all screen sizes

## Styling

- **Material-UI Theme**: Custom theme with primary/secondary colors
- **Responsive Design**: Mobile-first approach with breakpoints
- **Consistent Spacing**: Uses MUI's spacing system
- **Typography**: Roboto font family for consistency

## Development

- **Hot Reload**: Vite provides instant hot module replacement
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Error Boundaries**: Graceful error handling

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow TypeScript best practices
2. Use Material-UI components consistently
3. Implement proper error handling
4. Add loading states for async operations
5. Write responsive components
6. Follow the established folder structure

## Demo Credentials

For testing purposes, you can use these demo credentials:

- **Admin**: admin@campusrecruit.com / admin123
- **Student**: student@example.com / student123
- **Recruiter**: recruiter@example.com / recruiter123

Note: These are demo credentials for development/testing only.