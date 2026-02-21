export enum RequestStatus {
  NEW = "new",
  IN_PROGRESS = "in_progress",
  SCHEDULED = "scheduled",
  ARCHIVED = "archived"
}

export interface StudentRequest {
  id: string;
  studentPhone: string;
  studentName?: string;
  department?: string;
  gender?: string;
  issue?: string;
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
  topic: string;
  problems: string;
  feedback: string;
  privateNote?: string;
  attachmentUrl?: string; // Mock URL for visual demo
  date: number;
}

// --- Auth Types ---
export type UserRole = 'admin' | 'counsellor';
export type UserStatus = 'pending' | 'approved' | 'blocked';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
}

export interface Counsellor {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  createdAt: string;
}
