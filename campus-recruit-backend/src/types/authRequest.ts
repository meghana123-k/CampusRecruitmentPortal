  import { Request } from "express";
  import { UserRole } from "../models/User";

  export interface AuthRequest extends Request {
    userId?: number;
    userRole?: UserRole;
  }
