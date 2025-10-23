// User types
export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  RECRUITER = 'recruiter'
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRegistration {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}

// Job types
export enum JobStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CLOSED = 'closed'
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  INTERNSHIP = 'internship',
  CONTRACT = 'contract'
}

export interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType: JobType;
  status: JobStatus;
  recruiterId: number;
  applicationDeadline?: string;
  createdAt: string;
  updatedAt: string;
  recruiter?: User;
}

export interface JobCreation {
  title: string;
  description: string;
  requirements: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType: JobType;
  applicationDeadline?: string;
}

export interface JobUpdate extends Partial<JobCreation> {
  status?: JobStatus;
}

// Application types
export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted'
}

export interface Application {
  id: number;
  studentId: number;
  jobId: number;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  appliedAt: string;
  reviewedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  student?: User;
  job?: Job;
}

export interface ApplicationCreation {
  jobId: number;
  coverLetter?: string;
  resumeUrl?: string;
}

export interface ApplicationUpdate {
  status: ApplicationStatus;
  notes?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Auth types
export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: UserLogin) => Promise<void>;
  register: (userData: UserRegistration) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: UserProfile) => Promise<void>;
  changePassword: (passwords: ChangePassword) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Dashboard types
export interface DashboardStats {
  totalUsers?: number;
  activeUsers?: number;
  inactiveUsers?: number;
  students?: number;
  recruiters?: number;
  admins?: number;
  totalJobs?: number;
  activeJobs?: number;
  inactiveJobs?: number;
  closedJobs?: number;
  totalApplications?: number;
  pendingApplications?: number;
  reviewedApplications?: number;
  shortlistedApplications?: number;
  rejectedApplications?: number;
  acceptedApplications?: number;
}

// Filter types
export interface JobFilters {
  page?: number;
  limit?: number;
  status?: JobStatus;
  jobType?: JobType;
  location?: string;
  search?: string;
  recruiterId?: number;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
}

export interface ApplicationFilters {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
  jobId?: number;
  studentId?: number;
}

// Form types
export interface FormErrors {
  [key: string]: string;
}

export interface LoadingState {
  [key: string]: boolean;
}
