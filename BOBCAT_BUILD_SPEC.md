# BOBCAT MEDICAL - COMPLETE BUILD SPECIFICATION v2

> **Updated with custom admin dashboard + magic link auth (no Keystatic)**
> Based on TwinFallsZoo architecture patterns

---

## PROJECT OVERVIEW

**Client:** Bobcat Medical
**Type:** E-commerce medical accessories store
**Stack:** Astro 5 + Tailwind CSS + Custom Admin + NestJS Backend
**Deployment:** Vercel (frontend) + Railway (backend)

**Business Info:**
- Email: info@bobcatmedicalstore.com
- Phone: +1 951-667-8045
- Address: 31565 Vintners Pointe Ct, Winchester, CA 92596, USA

---

## ARCHITECTURE OVERVIEW

### Frontend (Astro)
```
src/
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── ProductCard.astro
│   ├── BlogCard.astro
│   ├── EventCard.astro
│   ├── CartButton.astro          # Floating cart + checkout modal
│   └── admin/                    # Admin dashboard components
│       ├── AdminLayout.astro
│       ├── AdminNav.astro
│       ├── ProductForm.astro
│       ├── BlogEditor.astro
│       └── ...
├── lib/
│   ├── cart.ts                   # localStorage cart (bobcat_cart)
│   ├── auth.ts                   # Customer magic link auth
│   ├── admin-auth.ts             # Admin magic link auth
│   └── api.ts                    # API helper functions
├── layouts/
│   ├── BaseLayout.astro          # Public pages (SEO, meta)
│   └── AdminLayout.astro         # Admin dashboard layout
├── pages/
│   ├── index.astro               # Homepage
│   ├── about.astro
│   ├── contact.astro
│   ├── faq.astro
│   ├── shop/
│   │   ├── index.astro           # All products
│   │   ├── [category].astro      # Category page
│   │   └── product/[slug].astro  # Product detail
│   ├── blog/
│   │   ├── index.astro           # Blog listing
│   │   └── [slug].astro          # Blog post
│   ├── events/
│   │   └── index.astro           # Events listing
│   ├── account.astro             # Customer account/login
│   ├── auth/
│   │   └── verify.astro          # Customer magic link verify
│   └── admin/
│       ├── index.astro           # Admin dashboard
│       ├── verify.astro          # Admin magic link verify
│       ├── products/
│       │   ├── index.astro       # List products
│       │   ├── new.astro         # Create product
│       │   └── [id].astro        # Edit product
│       ├── categories/
│       │   ├── index.astro
│       │   ├── new.astro
│       │   └── [id].astro
│       ├── blog/
│       │   ├── index.astro
│       │   ├── new.astro
│       │   └── [id].astro
│       ├── events/
│       │   ├── index.astro
│       │   ├── new.astro
│       │   └── [id].astro
│       ├── orders/
│       │   └── index.astro       # View orders
│       └── staff/
│           └── index.astro       # Manage staff (superadmin)
└── styles/
    └── global.css
```

### Backend (NestJS - add to lpai-app-main-deploy)
```
src/storefront/
├── storefront.module.ts
├── storefront.controller.ts
├── storefront.service.ts           # Checkout, products, etc.
├── storefront-auth.service.ts      # Customer magic link
├── storefront-admin.service.ts     # Admin auth + CRUD
├── storefront-cron.service.ts      # Invoice cleanup
└── dto/
    ├── checkout.dto.ts
    ├── auth.dto.ts
    ├── product.dto.ts
    ├── category.dto.ts
    ├── blog-post.dto.ts
    ├── event.dto.ts
    └── admin.dto.ts
```

### MongoDB Collections
```
storefronts              # Client configurations
storefrontCustomers      # Customer accounts
storefrontOrders         # Purchases
storefrontAdmins         # Admin/staff accounts
storefrontProducts       # Products
storefrontCategories     # Product categories
storefrontBlogPosts      # Blog posts
storefrontEvents         # Events
storefrontWebhookLogs    # GHL webhook logs
```

---

## PHASE 1: PROJECT SETUP

### 1.1 Initialize Astro Project

```bash
cd "C:\Projects\Bobcat Medical"
npm create astro@latest . -- --template minimal --typescript strict --install --git --yes
```

### 1.2 Install Dependencies

```bash
# Core
npm install @astrojs/tailwind @astrojs/vercel @astrojs/sitemap tailwindcss

# UI & Icons
npm install astro-icon @iconify-json/heroicons @iconify-json/lucide

# Fonts
npm install @fontsource/plus-jakarta-sans @fontsource/outfit

# Utilities
npm install tailwind-merge clsx zod marked

# Dev dependencies
npm install -D @tailwindcss/typography @tailwindcss/forms
```

### 1.3 Configuration Files

#### astro.config.mjs
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bobcatmedical.com',
  integrations: [tailwind(), sitemap()],
  output: 'server',
  adapter: vercel({
    imageService: true,
  }),
});
```

#### tailwind.config.mjs
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'bobcat': {
          50: '#e6f4f4',
          100: '#b3dddd',
          200: '#80c7c7',
          300: '#4db0b0',
          400: '#26a0a0',
          500: '#0d8f8f',
          600: '#0b7676',
          700: '#085c5c',
          800: '#064343',
          900: '#032929',
        },
        'coral': {
          50: '#fef3f0',
          100: '#fde0d9',
          200: '#fbccc0',
          300: '#f8b5a5',
          400: '#f6a38f',
          500: '#f38d72',
          600: '#e87555',
          700: '#d35d3d',
          800: '#b94829',
          900: '#943a21',
        },
        'warm': {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
```

#### tsconfig.json
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@lib/*": ["src/lib/*"]
    }
  }
}
```

#### src/styles/global.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  body {
    @apply font-sans text-warm-800 antialiased;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply font-display;
  }
}

@layer components {
  .btn-primary {
    @apply bg-bobcat-500 hover:bg-bobcat-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed;
  }
  .btn-secondary {
    @apply bg-white hover:bg-warm-50 text-bobcat-600 border-2 border-bobcat-500 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center justify-center gap-2;
  }
  .btn-coral {
    @apply bg-coral-500 hover:bg-coral-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center justify-center gap-2;
  }
  .btn-danger {
    @apply bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center justify-center gap-2;
  }
  .section-padding {
    @apply py-16 md:py-24;
  }
  .container-width {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
  .card {
    @apply bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200;
  }
  .input-field {
    @apply w-full px-4 py-3 rounded-lg border border-warm-300 focus:ring-2 focus:ring-bobcat-500 focus:border-bobcat-500 outline-none transition-colors;
  }
  .label {
    @apply block text-sm font-medium text-warm-700 mb-1;
  }
}
```

---

## PHASE 2: AUTHENTICATION SYSTEM

### 2.1 Customer Auth (src/lib/auth.ts)

```typescript
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
  const response = await fetch(`${API_BASE}/storefront/auth/request-link`, {
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
  const response = await fetch(`${API_BASE}/storefront/auth/verify`, {
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
    const response = await fetch(`${API_BASE}/storefront/auth/refresh`, {
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
  return !!localStorage.getItem('bobcat_access_token');
}

// Logout
export function logout(): void {
  localStorage.removeItem('bobcat_access_token');
  localStorage.removeItem('bobcat_refresh_token');
  localStorage.removeItem('bobcat_token_expiry');
  localStorage.removeItem('bobcat_user');
}

// Get customer profile
export async function getProfile(): Promise<BobcatUser> {
  const response = await fetchWithAuth(`${API_BASE}/storefront/customer/profile?clientId=${CLIENT_ID}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

// Get customer orders
export async function getOrders(): Promise<any[]> {
  const response = await fetchWithAuth(`${API_BASE}/storefront/customer/orders?clientId=${CLIENT_ID}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.orders || [];
}
```

### 2.2 Admin Auth (src/lib/admin-auth.ts)

```typescript
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
  const response = await fetch(`${API_BASE}/storefront/admin/auth/login`, {
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
  const response = await fetch(`${API_BASE}/storefront/admin/auth/verify`, {
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
    const response = await fetch(`${API_BASE}/storefront/admin/auth/refresh`, {
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
    window.location.href = '/admin';
  }

  return response;
}

// Get admin user
export function getAdminUser(): AdminUser | null {
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
  return !!localStorage.getItem('bobcat_admin_access_token');
}

// Check if superadmin
export function isSuperAdmin(): boolean {
  const user = getAdminUser();
  return user?.role === 'superadmin';
}

// Admin logout
export function adminLogout(): void {
  localStorage.removeItem('bobcat_admin_access_token');
  localStorage.removeItem('bobcat_admin_refresh_token');
  localStorage.removeItem('bobcat_admin_token_expiry');
  localStorage.removeItem('bobcat_admin_user');
}
```

### 2.3 API Helper (src/lib/api.ts)

```typescript
// API helper for admin CRUD operations

const API_BASE = import.meta.env.PUBLIC_API_URL || 'https://lpai-monorepo-production.up.railway.app/api';
const CLIENT_ID = 'bobcat-medical';

import { fetchWithAdminAuth } from './admin-auth';

// ==================== PRODUCTS ====================

export interface Product {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  ghlProductId?: string;
  images: { src: string; alt: string }[];
  featured: boolean;
  inStock: boolean;
  specs: { label: string; value: string }[];
  createdAt: string;
  updatedAt: string;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/storefront/${CLIENT_ID}/products`);
  const data = await response.json();
  return data.products || [];
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/products/${id}?clientId=${CLIENT_ID}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/products?clientId=${CLIENT_ID}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/products/${id}?clientId=${CLIENT_ID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/products/${id}?clientId=${CLIENT_ID}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }
}

// ==================== CATEGORIES ====================

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE}/storefront/${CLIENT_ID}/categories`);
  const data = await response.json();
  return data.categories || [];
}

export async function getCategory(id: string): Promise<Category> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/categories/${id}?clientId=${CLIENT_ID}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function createCategory(category: Partial<Category>): Promise<Category> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/categories?clientId=${CLIENT_ID}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<Category> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/categories/${id}?clientId=${CLIENT_ID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/categories/${id}?clientId=${CLIENT_ID}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }
}

// ==================== BLOG POSTS ====================

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  tags: string[];
  relatedProductIds: string[];
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const response = await fetch(`${API_BASE}/storefront/${CLIENT_ID}/blog`);
  const data = await response.json();
  return data.posts || [];
}

export async function getBlogPost(id: string): Promise<BlogPost> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/blog/${id}?clientId=${CLIENT_ID}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/blog?clientId=${CLIENT_ID}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/blog/${id}?clientId=${CLIENT_ID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/blog/${id}?clientId=${CLIENT_ID}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }
}

// ==================== EVENTS ====================

export interface Event {
  _id: string;
  title: string;
  slug: string;
  date: string;
  endDate?: string;
  location: string;
  description: string;
  image?: string;
  registrationUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getEvents(): Promise<Event[]> {
  const response = await fetch(`${API_BASE}/storefront/${CLIENT_ID}/events`);
  const data = await response.json();
  return data.events || [];
}

export async function getEvent(id: string): Promise<Event> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/events/${id}?clientId=${CLIENT_ID}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function createEvent(event: Partial<Event>): Promise<Event> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/events?clientId=${CLIENT_ID}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function updateEvent(id: string, event: Partial<Event>): Promise<Event> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/events/${id}?clientId=${CLIENT_ID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function deleteEvent(id: string): Promise<void> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/events/${id}?clientId=${CLIENT_ID}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }
}

// ==================== ORDERS ====================

export interface Order {
  _id: string;
  customerEmail: string;
  customerName?: string;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'pending' | 'paid' | 'cancelled';
  ghlInvoiceId?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getOrders(): Promise<Order[]> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/orders?clientId=${CLIENT_ID}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.orders || [];
}

// ==================== STAFF ====================

export interface StaffMember {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'superadmin' | 'admin';
  createdAt: string;
}

export async function getStaff(): Promise<StaffMember[]> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/staff?clientId=${CLIENT_ID}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.staff || [];
}

export async function createStaff(staff: { email: string; firstName: string; lastName: string; role: string }): Promise<StaffMember> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/staff?clientId=${CLIENT_ID}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(staff),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function deleteStaff(id: string): Promise<void> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/admin/staff/${id}?clientId=${CLIENT_ID}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }
}
```

---

## PHASE 3: CART SYSTEM

### 3.1 Cart Logic (src/lib/cart.ts)

```typescript
// Cart management using localStorage
// Key: bobcat_cart

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  ghlProductId?: string;
}

export interface Cart {
  items: CartItem[];
  updatedAt: number;
}

const CART_KEY = 'bobcat_cart';

export function getCart(): Cart {
  if (typeof window === 'undefined') {
    return { items: [], updatedAt: Date.now() };
  }

  try {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading cart:', e);
  }

  return { items: [], updatedAt: Date.now() };
}

function saveCart(cart: Cart): void {
  if (typeof window === 'undefined') return;

  try {
    cart.updatedAt = Date.now();
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: cart }));
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}

export function addToCart(item: Omit<CartItem, 'quantity'>, quantity: number = 1): Cart {
  const cart = getCart();
  const existingIndex = cart.items.findIndex(i => i.productId === item.productId);

  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += quantity;
  } else {
    cart.items.push({ ...item, quantity });
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string): Cart {
  const cart = getCart();
  cart.items = cart.items.filter(item => item.productId !== productId);
  saveCart(cart);
  return cart;
}

export function updateQuantity(productId: string, quantity: number): Cart {
  const cart = getCart();

  if (quantity <= 0) {
    return removeFromCart(productId);
  }

  const item = cart.items.find(i => i.productId === productId);
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }

  return cart;
}

export function clearCart(): Cart {
  const cart = { items: [], updatedAt: Date.now() };
  saveCart(cart);
  return cart;
}

export function getCartTotal(cart: Cart): number {
  return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function getCartItemCount(cart: Cart): number {
  return cart.items.reduce((count, item) => count + item.quantity, 0);
}
```

---

## PHASE 4: BACKEND STOREFRONT MODULE

### 4.1 Module Structure (add to lpai-app-main-deploy)

Create the following files in `services/api-nestjs/src/storefront/`:

#### storefront.module.ts
```typescript
import { Module } from '@nestjs/common';
import { StorefrontController } from './storefront.controller';
import { StorefrontService } from './storefront.service';
import { StorefrontAuthService } from './storefront-auth.service';
import { StorefrontAdminService } from './storefront-admin.service';
import { StorefrontCronService } from './storefront-cron.service';
import { MongoDbService } from '../common/database/mongodb.service';

@Module({
  controllers: [StorefrontController],
  providers: [
    StorefrontService,
    StorefrontAuthService,
    StorefrontAdminService,
    StorefrontCronService,
    MongoDbService,
  ],
  exports: [StorefrontService, StorefrontAuthService],
})
export class StorefrontModule {}
```

#### storefront.controller.ts
```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { StorefrontService } from './storefront.service';
import { StorefrontAuthService } from './storefront-auth.service';
import { StorefrontAdminService } from './storefront-admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('storefront')
export class StorefrontController {
  constructor(
    private readonly storefrontService: StorefrontService,
    private readonly authService: StorefrontAuthService,
    private readonly adminService: StorefrontAdminService,
  ) {}

  // ==================== PUBLIC ENDPOINTS ====================

  @Public()
  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  async checkout(@Body() dto: any) {
    return this.storefrontService.createCheckout(dto);
  }

  @Public()
  @Get(':clientId/products')
  async getPublicProducts(@Param('clientId') clientId: string) {
    return this.storefrontService.getProducts(clientId);
  }

  @Public()
  @Get(':clientId/categories')
  async getPublicCategories(@Param('clientId') clientId: string) {
    return this.storefrontService.getCategories(clientId);
  }

  @Public()
  @Get(':clientId/blog')
  async getPublicBlog(@Param('clientId') clientId: string) {
    return this.storefrontService.getBlogPosts(clientId, true); // published only
  }

  @Public()
  @Get(':clientId/events')
  async getPublicEvents(@Param('clientId') clientId: string) {
    return this.storefrontService.getEvents(clientId);
  }

  // ==================== CUSTOMER AUTH ====================

  @Public()
  @Post('auth/request-link')
  @HttpCode(HttpStatus.OK)
  async requestMagicLink(@Body() dto: any) {
    return this.authService.requestMagicLink(dto);
  }

  @Public()
  @Post('auth/verify')
  @HttpCode(HttpStatus.OK)
  async verifyMagicLink(@Body() dto: any) {
    return this.authService.verifyMagicLink(dto);
  }

  @Public()
  @Post('auth/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() dto: any) {
    return this.authService.refreshToken(dto);
  }

  // ==================== CUSTOMER PROTECTED ====================

  @UseGuards(JwtAuthGuard)
  @Get('customer/profile')
  async getProfile(@Query('clientId') clientId: string, @Req() req: any) {
    return this.authService.getProfile(clientId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('customer/profile')
  async updateProfile(@Query('clientId') clientId: string, @Req() req: any, @Body() dto: any) {
    return this.authService.updateProfile(clientId, req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('customer/orders')
  async getCustomerOrders(@Query('clientId') clientId: string, @Req() req: any) {
    return this.storefrontService.getCustomerOrders(clientId, req.user.userId);
  }

  // ==================== ADMIN AUTH ====================

  @Public()
  @Post('admin/auth/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() dto: any) {
    return this.adminService.requestLogin(dto);
  }

  @Public()
  @Post('admin/auth/verify')
  @HttpCode(HttpStatus.OK)
  async adminVerify(@Body() dto: any) {
    return this.adminService.verifyLogin(dto);
  }

  @Public()
  @Post('admin/auth/refresh')
  @HttpCode(HttpStatus.OK)
  async adminRefresh(@Body() dto: any) {
    return this.adminService.refreshToken(dto);
  }

  // ==================== ADMIN CRUD - PRODUCTS ====================

  @UseGuards(JwtAuthGuard)
  @Get('admin/products')
  async getAdminProducts(@Query('clientId') clientId: string) {
    return this.adminService.getProducts(clientId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/products/:id')
  async getAdminProduct(@Param('id') id: string, @Query('clientId') clientId: string) {
    return this.adminService.getProduct(clientId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/products')
  async createProduct(@Query('clientId') clientId: string, @Body() dto: any) {
    return this.adminService.createProduct(clientId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/products/:id')
  async updateProduct(@Param('id') id: string, @Query('clientId') clientId: string, @Body() dto: any) {
    return this.adminService.updateProduct(clientId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/products/:id')
  async deleteProduct(@Param('id') id: string, @Query('clientId') clientId: string) {
    return this.adminService.deleteProduct(clientId, id);
  }

  // ==================== ADMIN CRUD - CATEGORIES ====================

  @UseGuards(JwtAuthGuard)
  @Get('admin/categories')
  async getAdminCategories(@Query('clientId') clientId: string) {
    return this.adminService.getCategories(clientId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/categories/:id')
  async getAdminCategory(@Param('id') id: string, @Query('clientId') clientId: string) {
    return this.adminService.getCategory(clientId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/categories')
  async createCategory(@Query('clientId') clientId: string, @Body() dto: any) {
    return this.adminService.createCategory(clientId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/categories/:id')
  async updateCategory(@Param('id') id: string, @Query('clientId') clientId: string, @Body() dto: any) {
    return this.adminService.updateCategory(clientId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/categories/:id')
  async deleteCategory(@Param('id') id: string, @Query('clientId') clientId: string) {
    return this.adminService.deleteCategory(clientId, id);
  }

  // ==================== ADMIN CRUD - BLOG ====================

  @UseGuards(JwtAuthGuard)
  @Get('admin/blog')
  async getAdminBlog(@Query('clientId') clientId: string) {
    return this.adminService.getBlogPosts(clientId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/blog/:id')
  async getAdminBlogPost(@Param('id') id: string, @Query('clientId') clientId: string) {
    return this.adminService.getBlogPost(clientId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/blog')
  async createBlogPost(@Query('clientId') clientId: string, @Body() dto: any) {
    return this.adminService.createBlogPost(clientId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/blog/:id')
  async updateBlogPost(@Param('id') id: string, @Query('clientId') clientId: string, @Body() dto: any) {
    return this.adminService.updateBlogPost(clientId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/blog/:id')
  async deleteBlogPost(@Param('id') id: string, @Query('clientId') clientId: string) {
    return this.adminService.deleteBlogPost(clientId, id);
  }

  // ==================== ADMIN CRUD - EVENTS ====================

  @UseGuards(JwtAuthGuard)
  @Get('admin/events')
  async getAdminEvents(@Query('clientId') clientId: string) {
    return this.adminService.getEvents(clientId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/events/:id')
  async getAdminEvent(@Param('id') id: string, @Query('clientId') clientId: string) {
    return this.adminService.getEvent(clientId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/events')
  async createEvent(@Query('clientId') clientId: string, @Body() dto: any) {
    return this.adminService.createEvent(clientId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/events/:id')
  async updateEvent(@Param('id') id: string, @Query('clientId') clientId: string, @Body() dto: any) {
    return this.adminService.updateEvent(clientId, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/events/:id')
  async deleteEvent(@Param('id') id: string, @Query('clientId') clientId: string) {
    return this.adminService.deleteEvent(clientId, id);
  }

  // ==================== ADMIN - ORDERS ====================

  @UseGuards(JwtAuthGuard)
  @Get('admin/orders')
  async getAdminOrders(@Query('clientId') clientId: string) {
    return this.adminService.getOrders(clientId);
  }

  // ==================== ADMIN - STAFF (superadmin only) ====================

  @UseGuards(JwtAuthGuard)
  @Get('admin/staff')
  async getStaff(@Query('clientId') clientId: string, @Req() req: any) {
    return this.adminService.getStaff(clientId, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/staff')
  async createStaff(@Query('clientId') clientId: string, @Req() req: any, @Body() dto: any) {
    return this.adminService.createStaff(clientId, req.user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/staff/:id')
  async deleteStaff(@Param('id') id: string, @Query('clientId') clientId: string, @Req() req: any) {
    return this.adminService.deleteStaff(clientId, req.user, id);
  }

  // ==================== WEBHOOK ====================

  @Public()
  @Post('webhook/:clientId')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Param('clientId') clientId: string, @Body() payload: any) {
    return this.storefrontService.handleWebhook(clientId, payload);
  }
}
```

### 4.2 MongoDB Document: storefronts collection

Add this document to initialize Bobcat Medical:

```json
{
  "clientId": "bobcat-medical",
  "name": "Bobcat Medical",
  "ghlLocationId": "YOUR_GHL_LOCATION_ID",
  "ghlApiToken": "YOUR_GHL_API_TOKEN",
  "businessDetails": {
    "name": "Bobcat Medical",
    "website": "https://bobcatmedical.com",
    "email": "info@bobcatmedicalstore.com",
    "phone": "+1 951-667-8045",
    "address": "31565 Vintners Pointe Ct, Winchester, CA 92596, USA"
  },
  "invoicePrefix": "BCM",
  "cleanupHours": 6,
  "emailTemplates": {
    "magicLink": {
      "subject": "Your Bobcat Medical Login Link",
      "fromName": "Bobcat Medical"
    }
  },
  "createdAt": "2026-01-29T00:00:00.000Z"
}
```

---

## PHASE 5: SEO & STATIC FILES

### robots.txt
```
User-agent: *
Allow: /

Sitemap: https://bobcatmedical.com/sitemap-index.xml

Disallow: /admin/
Disallow: /api/
Disallow: /auth/
```

### favicon.svg
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0d8f8f"/>
  <text x="50" y="68" font-family="Arial, sans-serif" font-size="50" font-weight="bold" text-anchor="middle" fill="white">B</text>
</svg>
```

---

## PHASE 6: DEPLOYMENT

### Environment Variables (Vercel)
```
PUBLIC_API_URL=https://lpai-monorepo-production.up.railway.app/api
PUBLIC_SITE_URL=https://bobcatmedical.com
```

### Environment Variables (Railway - Backend)
```
# Add to existing .env
STOREFRONT_BOBCAT_GHL_LOCATION_ID=xxx
STOREFRONT_BOBCAT_GHL_API_TOKEN=pit-xxx
```

---

## BUILD ORDER

1. **Initialize Astro project** with dependencies
2. **Create config files** (astro.config, tailwind.config, tsconfig)
3. **Create styles** (global.css)
4. **Create lib files** (cart.ts, auth.ts, admin-auth.ts, api.ts)
5. **Create layouts** (BaseLayout.astro, AdminLayout.astro)
6. **Create components** (Header, Footer, ProductCard, CartButton, etc.)
7. **Create public pages** (index, shop, blog, events, about, contact, faq)
8. **Create auth pages** (account, auth/verify)
9. **Create admin pages** (admin/*, products/*, categories/*, blog/*, events/*, orders/*, staff/*)
10. **Create static files** (robots.txt, favicon.svg)
11. **Add backend module** to lpai-app-main-deploy
12. **Add MongoDB document** for client config
13. **Deploy frontend** to Vercel
14. **Deploy backend** to Railway

---

## ASSETS NEEDED FROM CLIENT

### Critical
- [ ] Logo (SVG, PNG)
- [ ] Product images (3 products, multiple angles)
- [ ] GHL Location ID
- [ ] GHL API Token

### Important
- [ ] Social media URLs (Instagram, Facebook)
- [ ] About page content
- [ ] Hero images

### Nice to Have
- [ ] Additional testimonials
- [ ] Event photos
- [ ] Team photos

---

**END OF SPECIFICATION**
