import { User } from '../types';

// Use environment variable if available, otherwise fallback to localhost for local dev
const BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/auth`;

export const login = async (email: string, password: string): Promise<{ user?: User, error?: string }> => {
  try {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        return { error: data.error || 'Login failed' };
    }

    return { user: data };
  } catch (e) {
    return { error: 'Network error. Is the server running?' };
  }
};

export const register = async (name: string, email: string, password: string): Promise<{ success: boolean, error?: string }> => {
    // Basic validation
    if (!email.includes('@avcoe.edu')) {
        return { success: false, error: 'Registration is restricted to @avcoe.edu domain.' };
    }
    
    if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
    }

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name, 
                email, 
                password,
                role: 'counselor',
                isApproved: false
            })
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, error: data.error || 'Registration failed' };
        }

        return { success: true };
    } catch (e) {
        return { success: false, error: 'Network connection failed' };
    }
};