// API helper for admin CRUD operations

const API_BASE = import.meta.env.PUBLIC_API_URL || 'https://lpai-monorepo-production.up.railway.app/api';
const CLIENT_ID = 'bobcat-medical';

import { fetchWithAdminAuth } from './admin-auth';

// ==================== PRODUCTS ====================

export interface ProductVariant {
  name: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  stock?: number;
  image?: string;
  ghlPriceId?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  category?: Category;
  ghlProductId?: string;
  images: { src: string; alt: string }[];
  featured: boolean;
  inStock: boolean;
  specs: { label: string; value: string }[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/storefront/${CLIENT_ID}/products`);
  const data = await response.json();
  // API returns array directly
  return Array.isArray(data) ? data : [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.slug === slug) || null;
}

export async function getAdminProducts(): Promise<Product[]> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/products`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  // API returns array directly
  return Array.isArray(data) ? data : [];
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/products/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/products/${id}`, {
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
  // API returns array directly
  return Array.isArray(data) ? data : [];
}

export async function getAdminCategories(): Promise<Category[]> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/categories`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  // API returns array directly
  return Array.isArray(data) ? data : [];
}

export async function getCategory(id: string): Promise<Category> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/categories/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function createCategory(category: Partial<Category>): Promise<Category> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<Category> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/categories/${id}`, {
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
  // API returns array directly
  return Array.isArray(data) ? data : [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find(p => p.slug === slug) || null;
}

export async function getAdminBlogPosts(): Promise<BlogPost[]> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/blog`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  // API returns array directly
  return Array.isArray(data) ? data : [];
}

export async function getBlogPost(id: string): Promise<BlogPost> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/blog/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/blog`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/blog/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/blog/${id}`, {
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
  // API returns array directly
  return Array.isArray(data) ? data : [];
}

export async function getAdminEvents(): Promise<Event[]> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/events`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  // API returns array directly
  return Array.isArray(data) ? data : [];
}

export async function getEvent(id: string): Promise<Event> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/events/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function createEvent(event: Partial<Event>): Promise<Event> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function updateEvent(id: string, event: Partial<Event>): Promise<Event> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function deleteEvent(id: string): Promise<void> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/events/${id}`, {
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

export async function getAdminOrders(): Promise<Order[]> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/orders`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  // API returns array directly
  return Array.isArray(data) ? data : [];
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
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/staff`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  // API returns array directly
  return Array.isArray(data) ? data : [];
}

export async function createStaff(staff: { email: string; firstName: string; lastName: string; role: string }): Promise<StaffMember> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/staff`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(staff),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function deleteStaff(id: string): Promise<void> {
  const response = await fetchWithAdminAuth(`${API_BASE}/storefront/${CLIENT_ID}/admin/staff/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }
}

// ==================== CHECKOUT ====================

export async function createCheckout(data: {
  items: { name: string; price: number; quantity: number }[];
  customerEmail: string;
  customerName?: string;
}): Promise<{ paymentUrl: string }> {
  const response = await fetch(`${API_BASE}/storefront/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: CLIENT_ID, ...data }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Checkout failed');
  return result;
}
