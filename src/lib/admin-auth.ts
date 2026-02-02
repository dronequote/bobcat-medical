// Admin authentication via magic link
// Storage keys: bobcat_admin_access_token, bobcat_admin_refresh_token, etc.

const API_BASE = import.meta.env.PUBLIC_API_URL || 'https://lpai-monorepo-production.up.railway.app/api';
const CLIENT_ID = 'bobcat-medical';

export type AdminRole = 'superadmin' | 'admin';

export interface AdminUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AdminRole;
}

// Request admin login link
export async function requestAdminLogin(email: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/storefront/${CLIENT_ID}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: CLIENT_ID, email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to send login link');
  }

  return data;
}

// Verify admin magic link
export async function verifyAdminLogin(token: string): Promise<AdminUser> {
  const response = await fetch(`${API_BASE}/storefront/${CLIENT_ID}/admin/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: CLIENT_ID, token }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Invalid or expired token');
  }

  localStorage.setItem('bobcat_admin_access_token', data.accessToken);
  localStorage.setItem('bobcat_admin_refresh_token', data.refreshToken);
  localStorage.setItem('bobcat_admin_token_expiry', data.expiresAt);
  localStorage.setItem('bobcat_admin_user', JSON.stringify(data.admin));

  return data.admin;
}

// Refresh admin token
export async function refreshAdminToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('bobcat_admin_refresh_token');
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE}/storefront/${CLIENT_ID}/admin/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: CLIENT_ID, refreshToken }),
    });

    if (!response.ok) {
      adminLogout();
      return null;
    }

    const data = await response.json();
    localStorage.setItem('bobcat_admin_access_token', data.accessToken);
    localStorage.setItem('bobcat_admin_refresh_token', data.refreshToken);
    localStorage.setItem('bobcat_admin_token_expiry', data.expiresAt);

    return data.accessToken;
  } catch {
    adminLogout();
    return null;
  }
}

// Get valid admin token
export async function getAdminToken(): Promise<string | null> {
  const token = localStorage.getItem('bobcat_admin_access_token');
  const expiry = localStorage.getItem('bobcat_admin_token_expiry');

  if (!token || !expiry) return null;

  const expiryDate = new Date(expiry);
  const now = new Date();
  const fiveMinutes = 5 * 60 * 1000;

  if (expiryDate.getTime() - now.getTime() < fiveMinutes) {
    return await refreshAdminToken();
  }

  return token;
}

// Fetch with admin auth
export async function fetchWithAdminAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAdminToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    adminLogout();
    if (typeof window !== 'undefined') {
      window.location.href = '/admin';
    }
  }

  return response;
}

// Get admin user
export function getAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;

  const userStr = localStorage.getItem('bobcat_admin_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Check if admin logged in
export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('bobcat_admin_access_token');
}

// Check if superadmin
export function isSuperAdmin(): boolean {
  const user = getAdminUser();
  return user?.role === 'superadmin';
}

// Admin logout
export function adminLogout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('bobcat_admin_access_token');
  localStorage.removeItem('bobcat_admin_refresh_token');
  localStorage.removeItem('bobcat_admin_token_expiry');
  localStorage.removeItem('bobcat_admin_user');
}
