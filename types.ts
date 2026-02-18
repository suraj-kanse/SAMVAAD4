export enum RequestStatus {
  NEW = "new",
  CONTACTED = "contacted",
  SCHEDULED = "scheduled",
  ARCHIVED = "archived"
}

export interface StudentRequest {
  id: string;
  studentPhone: string;
  studentName?: string;
  status: RequestStatus;
  timestamp: number;
}

export interface Student {
  id: string;
  fullName: string;
  branch: string;
  mobile: string;
  email?: string;
  parentName: string;
  parentMobile: string;
  parentOccupation: string;
  joinedAt: number;
}

export interface Session {
  id: string;
  studentId: string;
  topics: string[];
  reason: string;
  description: string;
  privateNote?: string;
  attachmentUrl?: string; // Mock URL for visual demo
  date: number;
}

// --- Auth Types ---
export type UserRole = 'admin' | 'counselor';
export type UserStatus = 'pending' | 'approved' | 'blocked';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
}

export interface Counselor {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  createdAt: string;
}
