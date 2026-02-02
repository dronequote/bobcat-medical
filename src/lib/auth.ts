// Customer authentication via magic link
// Storage keys: bobcat_access_token, bobcat_refresh_token, bobcat_token_expiry, bobcat_user

const API_BASE = import.meta.env.PUBLIC_API_URL || 'https://lpai-monorepo-production.up.railway.app/api';
const CLIENT_ID = 'bobcat-medical';

export interface BobcatUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export class NeedsSignupError extends Error {
  constructor() {
    super('Customer not found - signup required');
    this.name = 'NeedsSignupError';
  }
}

// Request magic link
export async function requestMagicLink(
  email: string,
  firstName?: string,
  lastName?: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/storefront/${CLIENT_ID}/auth/request-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: CLIENT_ID, email, firstName, lastName }),
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 404) {
      throw new NeedsSignupError();
    }
    throw new Error(data.message || 'Failed to send magic link');
  }

  return data;
}

// Verify magic link token
export async function verifyMagicLink(token: string): Promise<BobcatUser> {
  const response = await fetch(`${API_BASE}/storefront/${CLIENT_ID}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: CLIENT_ID, token }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Invalid or expired token');
  }

  // Store tokens
  localStorage.setItem('bobcat_access_token', data.accessToken);
  localStorage.setItem('bobcat_refresh_token', data.refreshToken);
  localStorage.setItem('bobcat_token_expiry', data.expiresAt);
  localStorage.setItem('bobcat_user', JSON.stringify(data.customer));

  return data.customer;
}

// Refresh access token
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('bobcat_refresh_token');
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE}/storefront/${CLIENT_ID}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: CLIENT_ID, refreshToken }),
    });

    if (!response.ok) {
      logout();
      return null;
    }

    const data = await response.json();
    localStorage.setItem('bobcat_access_token', data.accessToken);
    localStorage.setItem('bobcat_refresh_token', data.refreshToken);
    localStorage.setItem('bobcat_token_expiry', data.expiresAt);

    return data.accessToken;
  } catch {
    logout();
    return null;
  }
}

// Get valid access token (auto-refresh if needed)
export async function getAccessToken(): Promise<string | null> {
  const token = localStorage.getItem('bobcat_access_token');
  const expiry = localStorage.getItem('bobcat_token_expiry');

  if (!token || !expiry) return null;

  const expiryDate = new Date(expiry);
  const now = new Date();
  const fiveMinutes = 5 * 60 * 1000;

  // Refresh if expiring within 5 minutes
  if (expiryDate.getTime() - now.getTime() < fiveMinutes) {
    return await refreshAccessToken();
  }

  return token;
}

// Fetch with auth
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    logout();
    throw new Error('Session expired');
  }

  return response;
}

// Get current user
export function getUser(): BobcatUser | null {
  if (typeof window === 'undefined') return null;

  const userStr = localStorage.getItem('bobcat_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Check if logged in
export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('bobcat_access_token');
}

// Logout
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('bobcat_access_token');
  localStorage.removeItem('bobcat_refresh_token');
  localStorage.removeItem('bobcat_token_expiry');
  localStorage.removeItem('bobcat_user');
}

// Get customer profile
export async function getProfile(): Promise<BobcatUser> {
  const response = await fetchWithAuth(`${API_BASE}/storefront/${CLIENT_ID}/customer/profile`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

// Get customer orders
export async function getOrders(): Promise<any[]> {
  const response = await fetchWithAuth(`${API_BASE}/storefront/${CLIENT_ID}/customer/orders`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.orders || [];
}
