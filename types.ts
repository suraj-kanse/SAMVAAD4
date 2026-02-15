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
