import { StudentRequest, RequestStatus, Student, Session, AuthUser, Counselor } from '../types';

// Use relative URLs so it works on both local dev and deployment
const BASE_URL = (import.meta as any).env?.VITE_API_URL || '';
const API_URL = `${BASE_URL}/api`;

// --- TOKEN MANAGEMENT ---
const TOKEN_KEY = 'samvaad_token';

export const getToken = (): string | null => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (token: string): void => sessionStorage.setItem(TOKEN_KEY, token);
export const clearToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem('samvaad_user');
};

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

// Helper to check if error is a network connection failure
const isOfflineError = (error: any): boolean => {
  return error.message === 'OFFLINE_MODE' ||
    error.message === 'Failed to fetch' ||
    error.name === 'TypeError';
};

const fetchApi = async <T>(endpoint: string, options?: RequestInit, includeAuth: boolean = true): Promise<T> => {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };

    if (includeAuth) {
      const token = getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
      headers,
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

// ============================================================
// AUTH API
// ============================================================

export const login = async (email: string, password: string): Promise<{ token: string; user: AuthUser }> => {
  const result = await fetchApi<{ token: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }, false);

  setToken(result.token);
  sessionStorage.setItem('samvaad_user', JSON.stringify(result.user));
  return result;
};

export const register = async (name: string, email: string, password: string): Promise<{ message: string; status: string }> => {
  return fetchApi<{ message: string; status: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  }, false);
};

export const getMe = async (): Promise<AuthUser> => {
  return fetchApi<AuthUser>('/auth/me');
};

export const logout = async (): Promise<void> => {
  try {
    // Attempt to notify server of logout
    await fetchApi('/auth/logout', { method: 'POST' });
  } catch (err) {
    // Ignore error if offline
  } finally {
    clearToken();
  }
};

// ============================================================
// ADMIN API
// ============================================================

export const getCounselors = async (): Promise<Counselor[]> => {
  try {
    return await fetchApi<Counselor[]>('/admin/counselors');
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn('Backend offline: Returning empty counselors list');
      return Promise.resolve([]);
    }
    throw e;
  }
};

export const updateCounselorStatus = async (id: string, status: string): Promise<Counselor> => {
  try {
    return await fetchApi<Counselor>(`/admin/counselors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn('Backend offline: Faking counselor status update');
      return Promise.resolve({ id, status, name: 'Offline Counselor', email: 'offline@samvaad', createdAt: new Date().toISOString() } as Counselor);
    }
    throw e;
  }
};

// ============================================================
// REQUESTS (Contact form POST is public, GET/PATCH need auth)
// ============================================================

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

export const saveRequest = async (phone: string, name?: string, department?: string, gender?: string, issue?: string): Promise<boolean> => {
  try {
    // Contact form submission is PUBLIC — no auth required
    await fetchApi('/requests', {
      method: 'POST',
      body: JSON.stringify({
        studentPhone: phone,
        studentName: name,
        department,
        gender,
        issue,
        status: RequestStatus.NEW,
        timestamp: Date.now()
      })
    }, false);
    return true;
  } catch (e: any) {
    if (isOfflineError(e)) {
      const newReq: StudentRequest = {
        id: Math.random().toString(36).substr(2, 9),
        studentPhone: phone,
        studentName: name,
        department,
        gender,
        issue,
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

// ============================================================
// STUDENTS (All protected)
// ============================================================

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

export const addStudent = async (student: Student): Promise<Student | null> => {
  try {
    const { id, ...studentData } = student;
    const added = await fetchApi<Student>('/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
    return added;
  } catch (e: any) {
    if (isOfflineError(e)) {
      const newStudent = { ...student, id: Math.random().toString(36).substr(2, 9) };
      mockStudents = [newStudent, ...mockStudents];
      return newStudent;
    }
    return null;
  }
};

export const deleteStudent = async (id: string): Promise<boolean> => {
  try {
    await fetchApi(`/students/${id}`, {
      method: 'DELETE'
    });
    return true;
  } catch (e: any) {
    if (isOfflineError(e)) {
      mockStudents = mockStudents.filter(s => s.id !== id);
      mockSessions = mockSessions.filter(s => s.studentId !== id);
      return true;
    }
    return false;
  }
};

// ============================================================
// SESSIONS (All protected)
// ============================================================

export const getSessions = async (): Promise<Session[]> => {
  try {
    return await fetchApi<Session[]>('/sessions');
  } catch (e: any) {
    if (isOfflineError(e)) {
      return [...mockSessions].sort((a, b) => b.date - a.date);
    }
    return [];
  }
};

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
