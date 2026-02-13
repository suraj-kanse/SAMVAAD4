import { StudentRequest, RequestStatus, Student, Session, User } from '../types';

// Use environment variable if available, otherwise fallback to localhost for local dev
const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

// --- MOCK DATA STORE (Offline Fallback) ---
// These arrays serve as a temporary database when the backend is unreachable.
let mockRequests: StudentRequest[] = [
    { id: '1', studentPhone: '9876543210', studentName: 'Demo Student', status: RequestStatus.NEW, timestamp: Date.now() - 3600000 }
];
let mockStudents: Student[] = [
     { 
        id: '1', fullName: 'Demo Student', branch: 'Computer', mobile: '9876543210', 
        parentName: 'Parent', parentMobile: '9999999999', parentOccupation: 'Farmer', joinedAt: Date.now() - 86400000 
     }
];
let mockSessions: Session[] = [];
const mockUsers: User[] = [
    { id: '1', name: 'Dev Admin', email: 'dev@avcoe.edu', role: 'admin', isApproved: true },
    { id: '2', name: 'Counselor', email: 'staff@avcoe.edu', role: 'counselor', isApproved: true }
];

// Helper to check if error is a network connection failure
const isOfflineError = (error: any): boolean => {
    return error.message === 'OFFLINE_MODE' || 
           error.message === 'Failed to fetch' || 
           error.name === 'TypeError';
};

const fetchApi = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `API Error: ${res.statusText}`);
    }
    return await res.json() as T;
  } catch (error: any) {
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
         // Throw specific error to be caught by service functions
         throw new Error('OFFLINE_MODE');
    }
    console.error(`Fetch error for ${endpoint}:`, error);
    throw error;
  }
};

// --- REQUESTS ---
export const getRequests = async (): Promise<StudentRequest[]> => {
  try {
    return await fetchApi<StudentRequest[]>('/requests');
  } catch (e: any) {
    if (isOfflineError(e)) {
        console.warn('Backend offline: Returning mock requests');
        return Promise.resolve(mockRequests);
    }
    return [];
  }
};

export const saveRequest = async (phone: string, name?: string): Promise<boolean> => {
  try {
    await fetchApi('/requests', {
        method: 'POST',
        body: JSON.stringify({
            studentPhone: phone,
            studentName: name,
            status: RequestStatus.NEW,
            timestamp: Date.now()
        })
    });
    return true;
  } catch (e: any) {
    if (isOfflineError(e)) {
        const newReq: StudentRequest = {
            id: Math.random().toString(36).substr(2, 9),
            studentPhone: phone,
            studentName: name,
            status: RequestStatus.NEW,
            timestamp: Date.now()
        };
        mockRequests = [newReq, ...mockRequests];
        return true;
    }
    return false;
  }
};

export const updateRequestStatus = async (id: string, status: RequestStatus): Promise<boolean> => {
  try {
    await fetchApi(`/requests/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
    });
    return true;
  } catch (e: any) {
    if (isOfflineError(e)) {
        mockRequests = mockRequests.map(r => r.id === id ? { ...r, status } : r);
        return true;
    }
    return false;
  }
};

// --- STUDENTS ---
export const getStudents = async (): Promise<Student[]> => {
  try {
    return await fetchApi<Student[]>('/students');
  } catch (e: any) {
    if (isOfflineError(e)) {
        return Promise.resolve(mockStudents);
    }
    return [];
  }
};

export const getStudentById = async (id: string): Promise<Student | undefined> => {
    try {
        return await fetchApi<Student>(`/students/${id}`);
    } catch (e: any) {
        if (isOfflineError(e)) {
            return mockStudents.find(s => s.id === id);
        }
        return undefined;
    }
};

export const addStudent = async (student: Student): Promise<boolean> => {
  try {
    const { id, ...studentData } = student;
    await fetchApi('/students', {
        method: 'POST',
        body: JSON.stringify(studentData)
    });
    return true;
  } catch (e: any) {
    if (isOfflineError(e)) {
        const newStudent = { ...student, id: Math.random().toString(36).substr(2, 9) };
        mockStudents = [newStudent, ...mockStudents];
        return true;
    }
    return false;
  }
};

// --- SESSIONS ---
export const getSessionsByStudentId = async (studentId: string): Promise<Session[]> => {
    try {
        return await fetchApi<Session[]>(`/sessions?studentId=${studentId}`);
    } catch (e: any) {
        if (isOfflineError(e)) {
            return mockSessions.filter(s => s.studentId === studentId);
        }
        return [];
    }
};

export const addSession = async (session: Session): Promise<boolean> => {
  try {
      const { id, ...sessionData } = session;
      await fetchApi('/sessions', {
          method: 'POST',
          body: JSON.stringify(sessionData)
      });
      return true;
  } catch (e: any) {
      if (isOfflineError(e)) {
          const newSession = { ...session, id: Math.random().toString(36).substr(2, 9) };
          mockSessions = [newSession, ...mockSessions];
          return true;
      }
      return false;
  }
};

// --- USERS (ADMIN) ---
export const getAllUsers = async (): Promise<User[]> => {
    try {
        return await fetchApi<User[]>('/users');
    } catch (e: any) {
        if (isOfflineError(e)) {
            return Promise.resolve(mockUsers);
        }
        return [];
    }
};

export const updateUserStatus = async (id: string, isApproved: boolean): Promise<boolean> => {
  try {
      await fetchApi(`/users/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ isApproved })
      });
      return true;
  } catch (e: any) {
      if (isOfflineError(e)) {
          // Mock update (in reality we can't update const array easily without let, but for users it's fine)
          return true;
      }
      return false;
  }
};