// API helper for admin CRUD operations

const API_BASE = import.meta.env.PUBLIC_API_URL || 'https://lpai-monorepo-production.up.railway.app/api';
const CLIENT_ID = 'bobcat-medical';
/** Storefront API base for bobcat-medical (no zoo routes). */
const STOREFRONT_BASE = `${API_BASE}/storefront/${CLIENT_ID}`;

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

const BOBCAT_LOCATION_ID = 'WpD7EkK85yOehQLmDtrR';

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string | { name: string; avatar?: string };
  tags: string[];
  relatedProductIds?: string[];
  category?: string;
  featured?: boolean;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
  heroStyle?: string;
  ctaType?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
    noIndex?: boolean;
    canonicalUrl?: string;
  };
}

export interface BlogCategoryInfo {
  _id: string;
  name: string;
  slug: string;
  postCount?: number;
}

export async function getBlogPosts(opts?: {
  category?: string;
  q?: string;
  page?: number;
  limit?: number;
}): Promise<{ posts: BlogPost[]; total: number }> {
  const params = new URLSearchParams({
    locationId: BOBCAT_LOCATION_ID,
    limit: String(opts?.limit || 100),
  });
  if (opts?.page) params.set('page', String(opts.page));
  if (opts?.category) params.set('category', opts.category);
  if (opts?.q) params.set('q', opts.q);
  const response = await fetch(`${API_BASE}/blog/posts?${params}`);
  const data = await response.json();
  if (data.success && data.data?.posts) {
    return {
      posts: data.data.posts.map((p: any) => ({
        ...p,
        author: typeof p.author === 'object' ? p.author.name : (p.author || 'Bobcat Medical Team'),
      })),
      total: data.data.pagination?.total || data.data.posts.length,
    };
  }
  return { posts: [], total: 0 };
}

export async function getBlogCategories(): Promise<BlogCategoryInfo[]> {
  try {
    const response = await fetch(`${API_BASE}/blog/categories?locationId=${BOBCAT_LOCATION_ID}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.success ? data.data || [] : [];
  } catch {
    return [];
  }
}

/** Estimate read time. On listings (no content), uses excerpt × 50 ratio. */
export function estimateReadTime(content?: string, excerpt?: string): string {
  if (content) {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  }
  if (excerpt) {
    const excerptWords = excerpt.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    const estimatedWords = excerptWords * 50;
    const minutes = Math.max(3, Math.round(estimatedWords / 200));
    return `${minutes} min read`;
  }
  return '5 min read';
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const response = await fetch(`${API_BASE}/blog/posts/${encodeURIComponent(slug)}?locationId=${BOBCAT_LOCATION_ID}`);
  const data = await response.json();
  return data.success && data.data ? data.data : null;
}

export interface CtaData {
  heading: string;
  description: string;
  buttonText: string;
  href: string;
  gradient: string;
}

export async function getCtaBySlug(ctaSlug?: string): Promise<CtaData | null> {
  if (!ctaSlug || ctaSlug === 'none') return null;
  try {
    const response = await fetch(`${API_BASE}/blog/ctas?locationId=${BOBCAT_LOCATION_ID}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (!data.success) return null;
    return data.data.find((c: any) => c.slug === ctaSlug) || null;
  } catch {
    return null;
  }
}

/** Pick CTA for a post — uses post's ctaType if set, otherwise randomizes from all CTAs (seeded by slug). */
export async function getCtaForPost(ctaType?: string, postSlug?: string): Promise<CtaData | null> {
  try {
    const response = await fetch(`${API_BASE}/blog/ctas?locationId=${BOBCAT_LOCATION_ID}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (!data.success) return null;
    const allCtas: CtaData[] = data.data || [];
    if (!allCtas.length) return null;
    if (ctaType && ctaType !== 'none') {
      const match = allCtas.find((c: any) => c.slug === ctaType);
      if (match) return match;
    }
    const hash = (postSlug || '').split('').reduce((a, ch) => a + ch.charCodeAt(0), 0);
    return allCtas[hash % allCtas.length];
  } catch {
    return null;
  }
}

export async function getRelatedPosts(category: string, excludeSlug: string): Promise<BlogPost[]> {
  try {
    const params = new URLSearchParams({ locationId: BOBCAT_LOCATION_ID, category, limit: '4' });
    const response = await fetch(`${API_BASE}/blog/posts?${params}`);
    const data = await response.json();
    if (!data.success) return [];
    const posts = data.data?.posts || (Array.isArray(data.data) ? data.data : []);
    return posts.filter((p: BlogPost) => p.slug !== excludeSlug).slice(0, 3);
  } catch {
    return [];
  }
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

// ==================== COUPON VALIDATION (Storefront API) ====================

export interface ValidateCouponPayload {
  code: string;
  cartTotal: number;
  items: Array<{ name: string; price: number; quantity: number }>;
  customerEmail?: string;
}

/** Validates a coupon via storefront coupon/validate. Uses backend for bobcat-medical (not zoo). */
export async function validateCoupon(payload: ValidateCouponPayload): Promise<
  | { valid: true; discount?: number; newTotal?: number; couponId?: string; [k: string]: unknown }
  | { valid: false; error: string }
> {
  const body = {
    code: (payload.code || '').trim().toUpperCase(),
    cartTotal: Number(payload.cartTotal) || 0,
    items: Array.isArray(payload.items) ? payload.items : [],
    ...(payload.customerEmail ? { customerEmail: payload.customerEmail.trim() } : {}),
  };
  const response = await fetch(`${STOREFRONT_BASE}/coupon/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (data.valid === true) {
    return {
      valid: true,
      discount: data.discount,
      newTotal: data.newTotal,
      couponId: data.couponId,
      ...data,
    };
  }
  const errMsg = data.error ?? data.message ?? (response.ok ? 'Invalid or expired coupon code.' : 'Coupon validation failed.');
  return { valid: false, error: typeof errMsg === 'string' ? errMsg : 'Invalid or expired coupon code.' };
}

// ==================== CHECKOUT (Storefront API) ====================

export async function createCheckout(data: {
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    ghlProductId?: string;
    ghlPriceId?: string;
  }>;
  customerEmail: string;
  customerName?: string;
  couponCode?: string;
}): Promise<{ paymentUrl: string }> {
  const response = await fetch(`${STOREFRONT_BASE}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: data.items,
      customerEmail: data.customerEmail,
      ...(data.customerName ? { customerName: data.customerName } : {}),
      ...(data.couponCode ? { couponCode: data.couponCode } : {}),
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (import.meta.env.DEV) {
      console.error('Checkout failed:', response.status, result);
    }
    const msg = result.message ?? result.error ?? result.details;
    const msgStr = String(msg || '').toLowerCase();
    const looksLikeCouponError =
      response.status === 422 ||
      /unprocessable|422|coupon could not be applied/i.test(msgStr) ||
      msgStr.includes('unprocessable entity');
    if (looksLikeCouponError) {
      throw new Error('The coupon code could not be applied. It may be invalid, expired, or not applicable to this order. Try removing it or use a different code.');
    }
    if (response.status >= 500) {
      throw new Error(typeof msg === 'string' ? msg : 'Something went wrong on our end. Please try again or contact us.');
    }
    throw new Error(typeof msg === 'string' ? msg : 'Checkout failed');
  }
  const paymentUrl =
    result.paymentUrl ?? result.paymentLink ?? result.checkoutUrl ?? result.url;
  if (!paymentUrl || typeof paymentUrl !== 'string') {
    if (import.meta.env.DEV) {
      console.error('Checkout success but no payment URL in response:', result);
    }
    throw new Error('No payment link received. Please try again or contact us.');
  }
  return { paymentUrl };
}
