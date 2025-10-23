import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { 
  ApiResponse, 
  AuthResponse, 
  User, 
  UserLogin, 
  UserRegistration, 
  UserProfile, 
  ChangePassword,
  Job,
  JobCreation,
  JobUpdate,
  JobFilters,
  Application,
  ApplicationCreation,
  ApplicationUpdate,
  ApplicationFilters,
  UserFilters,
  DashboardStats,
  PaginatedResponse
} from '../types';


class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:5000/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(userData: UserRegistration): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data.data!;
  }

  async login(credentials: UserLogin): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data!;
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get<ApiResponse<{ user: User }>>('/auth/profile');
    return response.data.data!.user;
  }

  async updateProfile(profile: UserProfile): Promise<User> {
    const response = await this.api.put<ApiResponse<{ user: User }>>('/auth/profile', profile);
    return response.data.data!.user;
  }

  async changePassword(passwords: ChangePassword): Promise<void> {
    await this.api.put<ApiResponse>('/auth/change-password', passwords);
  }

  // User endpoints (Admin only)
  async getAllUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    const response = await this.api.get<PaginatedResponse<User>>('/users', { params: filters });
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response = await this.api.get<ApiResponse<{ user: User }>>(`/users/${id}`);
    return response.data.data!.user;
  }

  async createUser(userData: UserRegistration): Promise<User> {
    const response = await this.api.post<ApiResponse<{ user: User }>>('/users', userData);
    return response.data.data!.user;
  }

  async updateUser(id: number, userData: Partial<UserRegistration>): Promise<User> {
    const response = await this.api.put<ApiResponse<{ user: User }>>(`/users/${id}`, userData);
    return response.data.data!.user;
  }

  async deleteUser(id: number): Promise<void> {
    await this.api.delete<ApiResponse>(`/users/${id}`);
  }

  async toggleUserStatus(id: number): Promise<User> {
    const response = await this.api.patch<ApiResponse<{ user: User }>>(`/users/${id}/toggle-status`);
    return response.data.data!.user;
  }

  async getUserStats(): Promise<DashboardStats> {
    const response = await this.api.get<ApiResponse<DashboardStats>>('/users/stats');
    return response.data.data!;
  }

  // Job endpoints
  async getAllJobs(filters?: JobFilters): Promise<PaginatedResponse<Job>> {
    const response = await this.api.get<PaginatedResponse<Job>>('/jobs', { params: filters });
    return response.data;
  }

  async getJobById(id: number): Promise<Job> {
    const response = await this.api.get<ApiResponse<{ job: Job }>>(`/jobs/${id}`);
    return response.data.data!.job;
  }

  async createJob(jobData: JobCreation): Promise<Job> {
    const response = await this.api.post<ApiResponse<{ job: Job }>>('/jobs', jobData);
    return response.data.data!.job;
  }

  async updateJob(id: number, jobData: JobUpdate): Promise<Job> {
    const response = await this.api.put<ApiResponse<{ job: Job }>>(`/jobs/${id}`, jobData);
    return response.data.data!.job;
  }

  async deleteJob(id: number): Promise<void> {
    await this.api.delete<ApiResponse>(`/jobs/${id}`);
  }

  async getJobsByRecruiter(recruiterId?: number): Promise<PaginatedResponse<Job>> {
    const response = await this.api.get<PaginatedResponse<Job>>(`/jobs/recruiter/${recruiterId || ''}`);
    return response.data;
  }

  async getJobStats(): Promise<DashboardStats> {
    const response = await this.api.get<ApiResponse<DashboardStats>>('/jobs/stats');
    return response.data.data!;
  }

  // Application endpoints
  async applyForJob(applicationData: ApplicationCreation): Promise<Application> {
    const response = await this.api.post<ApiResponse<{ application: Application }>>('/applications', applicationData);
    return response.data.data!.application;
  }

  async getAllApplications(filters?: ApplicationFilters): Promise<PaginatedResponse<Application>> {
    const response = await this.api.get<PaginatedResponse<Application>>('/applications', { params: filters });
    return response.data;
  }

  async getApplicationById(id: number): Promise<Application> {
    const response = await this.api.get<ApiResponse<{ application: Application }>>(`/applications/${id}`);
    return response.data.data!.application;
  }

  async updateApplicationStatus(id: number, updateData: ApplicationUpdate): Promise<Application> {
    const response = await this.api.put<ApiResponse<{ application: Application }>>(`/applications/${id}/status`, updateData);
    return response.data.data!.application;
  }

  async deleteApplication(id: number): Promise<void> {
    await this.api.delete<ApiResponse>(`/applications/${id}`);
  }

  async getApplicationsByJob(jobId: number): Promise<PaginatedResponse<Application>> {
    const response = await this.api.get<PaginatedResponse<Application>>(`/applications/job/${jobId}`);
    return response.data;
  }

  async getApplicationStats(): Promise<DashboardStats> {
    const response = await this.api.get<ApiResponse<DashboardStats>>('/applications/stats');
    return response.data.data!;
  }

  // Utility methods
  setAuthToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeAuthToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;
