# 🏥 BOBCAT MEDICAL - COMPLETE BUILD SPECIFICATION

> **For Claude Code / Claude Desktop**
> This document contains everything needed to build the Bobcat Medical website from scratch.
> Execute these instructions in order.

---

## 📋 PROJECT OVERVIEW

**Client:** Bobcat Medical
**Type:** E-commerce medical accessories store
**Stack:** Astro 5 + Tailwind CSS + Keystatic CMS + NestJS Backend
**Deployment:** Vercel

**Current Business Info:**
- Email: info@bobcatmedicalstore.com
- Phone: +1 951-667-8045
- Address: 31565 Vintners Pointe Ct, Winchester, CA 92596, USA
- Website: https://bobcatmedicalstore.com (current, being replaced)

---

## 🎯 KEY FEATURES TO BUILD

1. **Public Pages:** Home, Shop, Product Pages, Blog, Events, About, Contact, FAQ, Warranty
2. **Admin Dashboard:** At `/admin` route with magic link authentication
3. **Content Management:** Products, Blog Posts, Events, Categories - all editable by admin
4. **Shopping Cart:** localStorage-based cart with floating cart button
5. **Checkout:** Creates GHL invoice → embedded payment iframe
6. **SEO:** Full meta tags, JSON-LD structured data, sitemap, robots.txt
7. **Image Storage:** Cloudinary (free tier, 25GB)

---

## 🚀 PHASE 1: PROJECT INITIALIZATION

### Step 1.1: Create Astro Project

```bash
cd "C:\Projects\Bobcat Medical"
npm create astro@latest . -- --template minimal --typescript strict --install --git --yes
```

### Step 1.2: Install All Dependencies

```bash
npm install @astrojs/tailwind @astrojs/vercel @astrojs/sitemap @astrojs/mdx tailwindcss
npm install @keystatic/core @keystatic/astro
npm install astro-seo astro-icon @iconify-json/heroicons @iconify-json/lucide
npm install @fontsource/plus-jakarta-sans @fontsource/outfit
npm install tailwind-merge clsx zod marked reading-time
npm install cloudinary
npm install -D @tailwindcss/typography @tailwindcss/forms
```

### Step 1.3: Create Project Structure

Create these folders:
```
src/
├── components/
│   ├── ui/
│   ├── admin/
│   └── shop/
├── layouts/
├── pages/
│   ├── admin/
│   ├── shop/
│   ├── blog/
│   └── api/
├── content/
│   ├── products/
│   ├── blog/
│   ├── events/
│   └── categories/
├── lib/
├── styles/
└── data/
public/
├── images/
│   ├── products/
│   ├── blog/
│   ├── site/
│   └── mascot/
└── fonts/
```

---

## 🎨 PHASE 2: CONFIGURATION FILES

### File: `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://bobcatmedical.com',
  integrations: [
    tailwind(),
    sitemap(),
    mdx(),
    keystatic(),
  ],
  output: 'hybrid',
  adapter: vercel({
    imageService: true,
  }),
});
```

### File: `tailwind.config.mjs`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Primary - Deep Teal (trust, professionalism)
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
        // Accent - Warm Coral (approachable, friendly)
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
        // Neutral - Warm Gray
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

### File: `keystatic.config.tsx`

```tsx
import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local', // Change to 'github' for production with repo
  },
  ui: {
    brand: {
      name: 'Bobcat Medical Admin',
    },
  },
  collections: {
    // ==================== PRODUCTS ====================
    products: collection({
      label: 'Products',
      slugField: 'name',
      path: 'src/content/products/*',
      format: { contentField: 'description' },
      schema: {
        name: fields.slug({ name: { label: 'Product Name' } }),
        shortDescription: fields.text({ 
          label: 'Short Description',
          description: 'Brief tagline for product cards (max 100 chars)',
        }),
        price: fields.number({ 
          label: 'Price ($)',
          validation: { min: 0 },
        }),
        compareAtPrice: fields.number({ 
          label: 'Compare At Price ($)',
          description: 'Original price if on sale (optional)',
        }),
        category: fields.relationship({
          label: 'Category',
          collection: 'categories',
        }),
        ghlProductId: fields.text({ 
          label: 'GHL Product ID',
          description: 'The GoHighLevel product ID for checkout',
        }),
        images: fields.array(
          fields.object({
            src: fields.text({ label: 'Image URL (Cloudinary)' }),
            alt: fields.text({ label: 'Alt Text' }),
          }),
          {
            label: 'Product Images',
            itemLabel: (props) => props.fields.alt.value || 'Image',
          }
        ),
        featured: fields.checkbox({ 
          label: 'Featured Product',
          defaultValue: false,
        }),
        inStock: fields.checkbox({ 
          label: 'In Stock',
          defaultValue: true,
        }),
        specs: fields.array(
          fields.object({
            label: fields.text({ label: 'Spec Name' }),
            value: fields.text({ label: 'Spec Value' }),
          }),
          { label: 'Specifications' }
        ),
        description: fields.mdx({
          label: 'Full Description',
          options: {
            image: false, // Use Cloudinary URLs instead
          },
        }),
      },
    }),

    // ==================== CATEGORIES ====================
    categories: collection({
      label: 'Product Categories',
      slugField: 'name',
      path: 'src/content/categories/*',
      schema: {
        name: fields.slug({ name: { label: 'Category Name' } }),
        description: fields.text({ 
          label: 'Description',
          multiline: true,
        }),
        image: fields.text({ label: 'Category Image URL' }),
        order: fields.number({ 
          label: 'Display Order',
          defaultValue: 0,
        }),
      },
    }),

    // ==================== BLOG POSTS ====================
    posts: collection({
      label: 'Blog Posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        excerpt: fields.text({ 
          label: 'Excerpt',
          multiline: true,
          description: 'Brief summary for blog listing',
        }),
        coverImage: fields.text({ label: 'Cover Image URL (Cloudinary)' }),
        publishedDate: fields.date({ label: 'Published Date' }),
        author: fields.text({ 
          label: 'Author',
          defaultValue: 'Bobcat Medical Team',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { 
            label: 'Tags',
            itemLabel: (props) => props.value,
          }
        ),
        relatedProducts: fields.array(
          fields.relationship({
            label: 'Related Product',
            collection: 'products',
          }),
          { label: 'Related Products' }
        ),
        content: fields.mdx({
          label: 'Content',
        }),
      },
    }),

    // ==================== EVENTS ====================
    events: collection({
      label: 'Events',
      slugField: 'title',
      path: 'src/content/events/*',
      schema: {
        title: fields.slug({ name: { label: 'Event Title' } }),
        date: fields.date({ label: 'Event Date' }),
        endDate: fields.date({ label: 'End Date (if multi-day)' }),
        location: fields.text({ label: 'Location' }),
        description: fields.text({ 
          label: 'Description',
          multiline: true,
        }),
        image: fields.text({ label: 'Event Image URL' }),
        instagramUrl: fields.url({ label: 'Instagram Post URL' }),
        registrationUrl: fields.url({ label: 'Registration URL' }),
        featured: fields.checkbox({ 
          label: 'Featured Event',
          defaultValue: false,
        }),
      },
    }),
  },

  // ==================== SINGLETONS (Site Settings) ====================
  singletons: {
    siteSettings: singleton({
      label: 'Site Settings',
      path: 'src/content/settings/site',
      schema: {
        siteName: fields.text({ 
          label: 'Site Name',
          defaultValue: 'Bobcat Medical',
        }),
        tagline: fields.text({ 
          label: 'Tagline',
          defaultValue: 'Medical Gear That Works As Hard As You Do',
        }),
        logo: fields.text({ label: 'Logo URL' }),
        logoDark: fields.text({ label: 'Logo (Dark Version) URL' }),
        email: fields.text({ 
          label: 'Contact Email',
          defaultValue: 'info@bobcatmedicalstore.com',
        }),
        phone: fields.text({ 
          label: 'Phone',
          defaultValue: '+1 951-667-8045',
        }),
        address: fields.text({ 
          label: 'Address',
          multiline: true,
          defaultValue: '31565 Vintners Pointe Ct, Winchester, CA 92596, USA',
        }),
        socialLinks: fields.object({
          instagram: fields.url({ label: 'Instagram' }),
          facebook: fields.url({ label: 'Facebook' }),
          twitter: fields.url({ label: 'Twitter/X' }),
          youtube: fields.url({ label: 'YouTube' }),
        }),
      },
    }),
    
    homepage: singleton({
      label: 'Homepage Content',
      path: 'src/content/settings/homepage',
      schema: {
        heroTitle: fields.text({ 
          label: 'Hero Title',
          defaultValue: 'Medical Gear That Works As Hard As You Do',
        }),
        heroSubtitle: fields.text({ 
          label: 'Hero Subtitle',
          multiline: true,
        }),
        heroImage: fields.text({ label: 'Hero Background Image URL' }),
        aboutTitle: fields.text({ label: 'About Section Title' }),
        aboutText: fields.text({ 
          label: 'About Section Text',
          multiline: true,
        }),
        aboutImage: fields.text({ label: 'About Section Image URL' }),
      },
    }),
  },
});
```

### File: `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@lib/*": ["src/lib/*"],
      "@content/*": ["src/content/*"]
    }
  }
}
```

### File: `src/styles/global.css`

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
    @apply bg-bobcat-500 hover:bg-bobcat-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center justify-center;
  }

  .btn-secondary {
    @apply bg-white hover:bg-warm-50 text-bobcat-600 border-2 border-bobcat-500 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center justify-center;
  }

  .btn-coral {
    @apply bg-coral-500 hover:bg-coral-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center justify-center;
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
}
```

---

## 📄 PHASE 3: LAYOUTS

### File: `src/layouts/BaseLayout.astro`

```astro
---
import Header from '@components/Header.astro';
import Footer from '@components/Footer.astro';
import CartButton from '@components/shop/CartButton.astro';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  article?: {
    publishedTime: string;
    author: string;
    tags?: string[];
  };
  product?: {
    price: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock';
  };
}

const {
  title,
  description = 'Bobcat Medical - Medical gear that works as hard as you do. Stethoscope holders, nurse accessories, and premium medical equipment for healthcare professionals.',
  image = '/images/site/og-image.png',
  type = 'website',
  noindex = false,
  article,
  product,
} = Astro.props;

const siteUrl = 'https://bobcatmedical.com';
const canonicalUrl = new URL(Astro.url.pathname, siteUrl).toString();
const fullTitle = title === 'Home' ? 'Bobcat Medical | Medical Gear That Works As Hard As You Do' : `${title} | Bobcat Medical`;
const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

// Structured data for local business
const businessSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "Bobcat Medical",
  "description": "Medical gear that works as hard as you do. Premium stethoscope holders and nurse accessories.",
  "url": siteUrl,
  "logo": `${siteUrl}/images/site/logo.svg`,
  "image": imageUrl,
  "telephone": "+1-951-667-8045",
  "email": "info@bobcatmedicalstore.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "31565 Vintners Pointe Ct",
    "addressLocality": "Winchester",
    "addressRegion": "CA",
    "postalCode": "92596",
    "addressCountry": "US"
  },
  "sameAs": []
};

// Product schema if product page
const productSchema = product ? {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": title,
  "description": description,
  "image": imageUrl,
  "brand": { "@type": "Brand", "name": "Bobcat Medical" },
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": product.currency || "USD",
    "availability": `https://schema.org/${product.availability || 'InStock'}`
  }
} : null;

// Article schema if blog post
const articleSchema = article ? {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": title,
  "description": description,
  "image": imageUrl,
  "datePublished": article.publishedTime,
  "author": { "@type": "Person", "name": article.author }
} : null;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Primary Meta Tags -->
    <title>{fullTitle}</title>
    <meta name="title" content={fullTitle} />
    <meta name="description" content={description} />
    <meta name="keywords" content="stethoscope holder, magnetic stethoscope holder, nurse accessories, medical gear, nursing supplies, healthcare accessories, Bobcat Medical" />
    <meta name="author" content="Bobcat Medical" />
    <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
    <link rel="canonical" href={canonicalUrl} />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" sizes="180x180" href="/images/site/apple-touch-icon.png" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content={type} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={imageUrl} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="Bobcat Medical" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content={canonicalUrl} />
    <meta name="twitter:title" content={fullTitle} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={imageUrl} />

    <!-- Theme Color -->
    <meta name="theme-color" content="#0d8f8f" />
    <meta name="msapplication-TileColor" content="#0d8f8f" />

    <!-- Structured Data -->
    <script type="application/ld+json" set:html={JSON.stringify(businessSchema)} />
    {productSchema && <script type="application/ld+json" set:html={JSON.stringify(productSchema)} />}
    {articleSchema && <script type="application/ld+json" set:html={JSON.stringify(articleSchema)} />}
  </head>
  <body class="min-h-screen flex flex-col bg-warm-50 antialiased">
    <Header />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
    <CartButton />
  </body>
</html>
```

---

## 🧩 PHASE 4: CORE COMPONENTS

### File: `src/components/Header.astro`

```astro
---
const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Blog', href: '/blog' },
  { name: 'Events', href: '/events' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];
---

<header class="bg-white shadow-sm sticky top-0 z-50">
  <nav class="container-width">
    <div class="flex justify-between items-center h-20">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2">
        <div class="w-10 h-10 bg-bobcat-500 rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-xl">B</span>
        </div>
        <span class="font-display font-bold text-xl text-warm-800">Bobcat Medical</span>
      </a>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <a
            href={item.href}
            class="text-warm-700 hover:text-bobcat-600 font-medium transition-colors duration-200"
          >
            {item.name}
          </a>
        ))}
        <a href="/shop" class="btn-primary">
          Shop Now
        </a>
      </div>

      <!-- Mobile Menu Button -->
      <button
        id="mobile-menu-btn"
        class="md:hidden p-2 rounded-lg text-warm-700 hover:bg-warm-100"
        aria-label="Toggle menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <div id="mobile-menu" class="hidden md:hidden pb-4">
      <div class="flex flex-col gap-2">
        {navItems.map((item) => (
          <a
            href={item.href}
            class="text-warm-700 hover:text-bobcat-600 hover:bg-warm-50 px-4 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            {item.name}
          </a>
        ))}
        <a href="/shop" class="btn-primary mt-2 text-center">
          Shop Now
        </a>
      </div>
    </div>
  </nav>
</header>

<script>
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  menuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
  });
</script>
```

### File: `src/components/Footer.astro`

```astro
---
const quickLinks = [
  { name: 'Shop All', href: '/shop' },
  { name: 'Blog', href: '/blog' },
  { name: 'Events', href: '/events' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'FAQ', href: '/faq' },
];

const productLinks = [
  { name: 'Stethoscope Holders', href: '/shop/stethoscope-holders' },
  { name: 'Nurse Accessories', href: '/shop/nurse-accessories' },
  { name: 'All Products', href: '/shop' },
];
---

<footer class="bg-warm-800 text-white">
  <div class="container-width py-16">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      <!-- Brand -->
      <div class="lg:col-span-1">
        <a href="/" class="flex items-center gap-2 mb-4">
          <div class="w-10 h-10 bg-bobcat-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">B</span>
          </div>
          <span class="font-display font-bold text-xl">Bobcat Medical</span>
        </a>
        <p class="text-warm-300 text-sm leading-relaxed mb-4">
          Created by caregivers, for caregivers. Medical gear that works as hard as you do.
        </p>
        <div class="flex gap-4">
          <a href="#" class="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="Instagram">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="#" class="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="Facebook">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
        </div>
      </div>

      <!-- Quick Links -->
      <div>
        <h3 class="font-display font-semibold text-lg mb-4">Quick Links</h3>
        <ul class="space-y-3">
          {quickLinks.map((link) => (
            <li>
              <a href={link.href} class="text-warm-300 hover:text-white transition-colors">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <!-- Products -->
      <div>
        <h3 class="font-display font-semibold text-lg mb-4">Products</h3>
        <ul class="space-y-3">
          {productLinks.map((link) => (
            <li>
              <a href={link.href} class="text-warm-300 hover:text-white transition-colors">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h3 class="font-display font-semibold text-lg mb-4">Contact</h3>
        <address class="not-italic space-y-3 text-warm-300">
          <p>
            <a href="tel:+19516678045" class="hover:text-white transition-colors">
              (951) 667-8045
            </a>
          </p>
          <p>
            <a href="mailto:info@bobcatmedicalstore.com" class="hover:text-white transition-colors">
              info@bobcatmedicalstore.com
            </a>
          </p>
          <p class="text-sm">
            31565 Vintners Pointe Ct<br />
            Winchester, CA 92596
          </p>
        </address>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-warm-700 mt-12 pt-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-warm-400 text-sm">
          &copy; {new Date().getFullYear()} Bobcat Medical. All rights reserved.
        </p>
        <div class="flex gap-6 text-sm text-warm-400">
          <a href="/privacy" class="hover:text-white transition-colors">Privacy Policy</a>
          <a href="/terms" class="hover:text-white transition-colors">Terms of Service</a>
          <a href="/warranty" class="hover:text-white transition-colors">Warranty</a>
        </div>
      </div>
    </div>
  </div>
</footer>
```

---

## 🛒 PHASE 5: CART SYSTEM

### File: `src/lib/cart.ts`

```typescript
// Cart management for Bobcat Medical
// Uses localStorage to persist cart state

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

### File: `src/components/shop/CartButton.astro`

```astro
---
// Floating cart button with slide-out panel
---

<!-- Floating Cart Button -->
<button
  id="cart-button"
  type="button"
  class="fixed bottom-6 right-6 z-40 bg-bobcat-600 hover:bg-bobcat-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200"
  aria-label="Open shopping cart"
>
  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
  </svg>
  <span
    id="cart-count"
    class="absolute -top-1 -right-1 bg-coral-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center hidden"
  >
    0
  </span>
</button>

<!-- Cart Panel Overlay -->
<div
  id="cart-overlay"
  class="fixed inset-0 bg-black/50 z-50 hidden opacity-0 transition-opacity duration-300"
></div>

<!-- Cart Panel -->
<div
  id="cart-panel"
  class="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col"
>
  <!-- Header -->
  <div class="flex items-center justify-between p-4 border-b border-warm-200 bg-bobcat-600 text-white">
    <h2 class="font-display text-xl font-bold">Your Cart</h2>
    <button
      id="cart-close"
      type="button"
      class="p-2 hover:bg-bobcat-700 rounded-lg transition-colors"
      aria-label="Close cart"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>

  <!-- Cart Items -->
  <div id="cart-items" class="flex-1 overflow-y-auto p-4 space-y-4">
    <!-- Items rendered by JavaScript -->
  </div>

  <!-- Empty Cart Message -->
  <div id="cart-empty" class="flex-1 flex flex-col items-center justify-center p-8 text-center hidden">
    <svg class="w-16 h-16 text-warm-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
    </svg>
    <p class="text-warm-500 mb-4">Your cart is empty</p>
    <a href="/shop" class="btn-primary text-sm">Browse Products</a>
  </div>

  <!-- Footer with Total & Checkout -->
  <div id="cart-footer" class="border-t border-warm-200 p-4 bg-warm-50 space-y-4">
    <div class="flex justify-between items-center">
      <span class="font-semibold text-warm-700">Subtotal:</span>
      <span id="cart-total" class="font-display text-2xl font-bold text-bobcat-600">$0</span>
    </div>
    <button
      id="checkout-btn"
      type="button"
      class="btn-primary w-full text-center"
    >
      Proceed to Checkout
    </button>
    <button
      id="clear-cart-btn"
      type="button"
      class="w-full text-center text-sm text-warm-500 hover:text-red-600 transition-colors py-2"
    >
      Clear Cart
    </button>
  </div>
</div>

<!-- Checkout Modal -->
<div
  id="checkout-modal"
  class="fixed inset-0 z-[60] hidden items-center justify-center p-4 bg-black/50"
>
  <div class="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
    <!-- Email Form Step -->
    <div id="checkout-step-email">
      <div class="p-6 border-b border-warm-200">
        <h3 class="font-display text-xl font-bold text-warm-900">Checkout</h3>
        <p class="text-sm text-warm-500 mt-1">Enter your email to complete your order</p>
      </div>

      <div class="p-6 space-y-4">
        <div id="checkout-summary" class="bg-warm-50 rounded-xl p-4 space-y-2">
          <!-- Order summary rendered by JS -->
        </div>

        <div class="border-t border-warm-200 pt-4">
          <div class="flex justify-between items-center mb-4">
            <span class="font-semibold text-warm-700">Total:</span>
            <span id="checkout-total" class="font-display text-2xl font-bold text-bobcat-600">$0</span>
          </div>
        </div>

        <div>
          <label for="checkout-email" class="block text-sm font-medium text-warm-700 mb-1">
            Email Address <span class="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="checkout-email"
            placeholder="your@email.com"
            class="input-field"
            required
          />
        </div>

        <div>
          <label for="checkout-name" class="block text-sm font-medium text-warm-700 mb-1">
            Name (optional)
          </label>
          <input
            type="text"
            id="checkout-name"
            placeholder="Your name"
            class="input-field"
          />
        </div>

        <div id="checkout-error" class="hidden bg-red-50 text-red-700 p-3 rounded-lg text-sm"></div>
      </div>

      <div class="p-6 border-t border-warm-200 bg-warm-50 flex gap-3">
        <button id="checkout-back" type="button" class="btn-secondary flex-1">
          Back
        </button>
        <button id="checkout-pay" type="button" class="btn-primary flex-1">
          Continue to Payment
        </button>
      </div>
    </div>

    <!-- Processing Step -->
    <div id="checkout-step-processing" class="hidden p-12 text-center">
      <div class="animate-spin w-12 h-12 border-4 border-bobcat-200 border-t-bobcat-600 rounded-full mx-auto mb-4"></div>
      <h3 class="font-display text-xl font-bold text-warm-900">Processing...</h3>
      <p class="text-warm-500 mt-2">Creating your secure checkout</p>
    </div>

    <!-- Payment Iframe Step -->
    <div id="checkout-step-payment" class="hidden">
      <div class="p-4 border-b border-warm-200 bg-bobcat-600 text-white flex items-center justify-between">
        <h3 class="font-display font-bold">Complete Payment</h3>
        <button id="checkout-close-payment" type="button" class="p-2 hover:bg-bobcat-700 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <iframe
        id="checkout-payment-iframe"
        src=""
        class="w-full h-[500px] border-0"
        allow="payment"
      ></iframe>
    </div>
  </div>
</div>

<script>
  import { getCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemCount } from '@lib/cart';
  import type { Cart, CartItem } from '@lib/cart';

  // API endpoint for checkout
  const API_BASE = import.meta.env.PUBLIC_API_URL || 'https://lpai-monorepo-production.up.railway.app/api';
  const CHECKOUT_API = `${API_BASE}/storefront/checkout`;
  const CLIENT_ID = 'bobcat-medical';

  // DOM Elements
  const cartButton = document.getElementById('cart-button');
  const cartCount = document.getElementById('cart-count');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartPanel = document.getElementById('cart-panel');
  const cartClose = document.getElementById('cart-close');
  const cartItems = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  const cartFooter = document.getElementById('cart-footer');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const clearCartBtn = document.getElementById('clear-cart-btn');

  // Checkout modal elements
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutStepEmail = document.getElementById('checkout-step-email');
  const checkoutStepProcessing = document.getElementById('checkout-step-processing');
  const checkoutStepPayment = document.getElementById('checkout-step-payment');
  const checkoutSummary = document.getElementById('checkout-summary');
  const checkoutTotalEl = document.getElementById('checkout-total');
  const checkoutEmail = document.getElementById('checkout-email') as HTMLInputElement;
  const checkoutName = document.getElementById('checkout-name') as HTMLInputElement;
  const checkoutError = document.getElementById('checkout-error');
  const checkoutBack = document.getElementById('checkout-back');
  const checkoutPay = document.getElementById('checkout-pay');
  const checkoutPaymentIframe = document.getElementById('checkout-payment-iframe') as HTMLIFrameElement;
  const checkoutClosePayment = document.getElementById('checkout-close-payment');

  function renderCartItem(item: CartItem): string {
    return `
      <div class="flex gap-4 bg-warm-50 rounded-xl p-4" data-product-id="${item.productId}">
        <div class="w-16 h-16 bg-warm-200 rounded-lg flex-shrink-0">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover rounded-lg" />` : ''}
        </div>
        <div class="flex-1">
          <h4 class="font-semibold text-warm-900">${item.name}</h4>
          <p class="font-display font-bold text-bobcat-600 mt-1">$${item.price}</p>
        </div>
        <div class="flex flex-col items-end gap-2">
          <button class="remove-item text-warm-400 hover:text-red-500 transition-colors p-1" data-product-id="${item.productId}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <div class="flex items-center gap-2 bg-white rounded-lg border border-warm-200">
            <button class="quantity-btn p-2 hover:bg-warm-100 rounded-l-lg" data-product-id="${item.productId}" data-action="decrease">−</button>
            <span class="w-8 text-center font-semibold">${item.quantity}</span>
            <button class="quantity-btn p-2 hover:bg-warm-100 rounded-r-lg" data-product-id="${item.productId}" data-action="increase">+</button>
          </div>
        </div>
      </div>
    `;
  }

  function updateCartUI() {
    const cart = getCart();
    const itemCount = getCartItemCount(cart);
    const total = getCartTotal(cart);

    if (cartCount) {
      if (itemCount > 0) {
        cartCount.textContent = itemCount.toString();
        cartCount.classList.remove('hidden');
      } else {
        cartCount.classList.add('hidden');
      }
    }

    if (cartItems && cartEmpty && cartFooter) {
      if (cart.items.length > 0) {
        cartItems.innerHTML = cart.items.map(renderCartItem).join('');
        cartItems.classList.remove('hidden');
        cartEmpty.classList.add('hidden');
        cartFooter.classList.remove('hidden');

        // Add event listeners
        cartItems.querySelectorAll('.remove-item').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const productId = (e.currentTarget as HTMLElement).dataset.productId;
            if (productId) {
              removeFromCart(productId);
              updateCartUI();
            }
          });
        });

        cartItems.querySelectorAll('.quantity-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const button = e.currentTarget as HTMLElement;
            const productId = button.dataset.productId;
            const action = button.dataset.action;
            if (productId) {
              const cart = getCart();
              const item = cart.items.find(i => i.productId === productId);
              if (item) {
                const newQty = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
                updateQuantity(productId, newQty);
                updateCartUI();
              }
            }
          });
        });
      } else {
        cartItems.innerHTML = '';
        cartItems.classList.add('hidden');
        cartEmpty.classList.remove('hidden');
        cartFooter.classList.add('hidden');
      }
    }

    if (cartTotal) {
      cartTotal.textContent = `$${total.toFixed(2)}`;
    }
  }

  function openCart() {
    updateCartUI();
    cartOverlay?.classList.remove('hidden');
    setTimeout(() => {
      cartOverlay?.classList.remove('opacity-0');
      cartPanel?.classList.remove('translate-x-full');
    }, 10);
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartOverlay?.classList.add('opacity-0');
    cartPanel?.classList.add('translate-x-full');
    setTimeout(() => {
      cartOverlay?.classList.add('hidden');
    }, 300);
    document.body.style.overflow = '';
  }

  function openCheckout() {
    const cart = getCart();
    if (cart.items.length === 0) return;

    closeCart();

    if (checkoutSummary) {
      checkoutSummary.innerHTML = cart.items.map(item => `
        <div class="flex justify-between items-center">
          <span class="text-warm-700">${item.name} x ${item.quantity}</span>
          <span class="font-semibold text-warm-900">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `).join('');
    }

    if (checkoutTotalEl) {
      checkoutTotalEl.textContent = `$${getCartTotal(cart).toFixed(2)}`;
    }

    showCheckoutStep('email');
    checkoutModal?.classList.remove('hidden');
    checkoutModal?.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    checkoutModal?.classList.add('hidden');
    checkoutModal?.classList.remove('flex');
    document.body.style.overflow = '';
  }

  function showCheckoutStep(step: 'email' | 'processing' | 'payment') {
    checkoutStepEmail?.classList.toggle('hidden', step !== 'email');
    checkoutStepProcessing?.classList.toggle('hidden', step !== 'processing');
    checkoutStepPayment?.classList.toggle('hidden', step !== 'payment');
  }

  async function processCheckout() {
    const email = checkoutEmail?.value?.trim();
    const name = checkoutName?.value?.trim();
    const cart = getCart();

    if (!email || !email.includes('@')) {
      if (checkoutError) {
        checkoutError.textContent = 'Please enter a valid email address';
        checkoutError.classList.remove('hidden');
      }
      return;
    }

    if (checkoutError) checkoutError.classList.add('hidden');
    showCheckoutStep('processing');

    const items = cart.items.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      description: item.name
    }));

    try {
      const response = await fetch(CHECKOUT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: CLIENT_ID,
          items,
          customerEmail: email,
          customerName: name || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      if (checkoutPaymentIframe && data.paymentUrl) {
        checkoutPaymentIframe.src = data.paymentUrl;
      }
      showCheckoutStep('payment');

    } catch (error: any) {
      console.error('Checkout error:', error);
      showCheckoutStep('email');
      if (checkoutError) {
        checkoutError.textContent = error.message || 'Failed to process checkout. Please try again.';
        checkoutError.classList.remove('hidden');
      }
    }
  }

  // Event listeners
  cartButton?.addEventListener('click', openCart);
  cartClose?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);
  checkoutBtn?.addEventListener('click', openCheckout);
  checkoutBack?.addEventListener('click', () => {
    closeCheckout();
    setTimeout(openCart, 100);
  });
  checkoutPay?.addEventListener('click', processCheckout);
  checkoutClosePayment?.addEventListener('click', () => {
    clearCart();
    updateCartUI();
    closeCheckout();
  });
  clearCartBtn?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      updateCartUI();
    }
  });

  window.addEventListener('cart-updated', () => updateCartUI());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCart();
      closeCheckout();
    }
  });

  // Initial update
  updateCartUI();
</script>
```

---

## 📄 PHASE 6: PAGES

### File: `src/pages/index.astro`

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';

// Placeholder products until Keystatic content is set up
const featuredProducts = [
  {
    id: 'magnetic-stethoscope-holder',
    name: 'Magnetic Stethoscope Holder',
    price: 18.99,
    image: 'https://placehold.co/400x400/0d8f8f/ffffff?text=Magnetic+Holder',
    description: 'Strong magnet keeps your stethoscope secure and accessible.',
  },
  {
    id: 'velcro-stethoscope-holder',
    name: 'Hook & Loop Velcro Stethoscope Holder',
    price: 18.99,
    image: 'https://placehold.co/400x400/0d8f8f/ffffff?text=Velcro+Holder',
    description: 'Secure velcro attachment for easy one-hand access.',
  },
  {
    id: 'nurse-fanny-pack',
    name: 'Nurse Fanny Pack',
    price: 22.99,
    image: 'https://placehold.co/400x400/0d8f8f/ffffff?text=Fanny+Pack',
    description: 'Keep all your essentials organized and within reach.',
  },
];

const testimonials = [
  {
    name: 'Karla',
    text: 'Most Useful & Well Designed Stethoscope Holder - This holder is incredibly useful and practical, unlike others it keeps the stethoscope in place, is easy to use, one hand placement and pull out, magnet is strong. Material and quality are excellent.',
  },
  {
    name: 'Alex',
    text: 'Very good quality item easy to carry and keep stethoscope at easy reach in the pocket.',
  },
  {
    name: 'Heather',
    text: 'Great for the road - stays in place and holds tight.',
  },
];
---

<BaseLayout title="Home">
  <!-- Hero Section -->
  <section class="relative bg-bobcat-800 text-white overflow-hidden min-h-[600px]">
    <div class="absolute inset-0 bg-gradient-to-br from-bobcat-900 via-bobcat-800 to-bobcat-700"></div>
    
    <div class="relative container-width py-24 md:py-32 lg:py-40">
      <div class="max-w-3xl">
        <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Medical Gear That
          <span class="text-coral-400">Works As Hard</span>
          As You Do
        </h1>
        <p class="text-xl md:text-2xl text-bobcat-100 mb-8 leading-relaxed">
          Created by caregivers, for caregivers. Premium accessories designed to keep up with your demanding shifts.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <a href="/shop" class="btn-coral text-lg">
            Shop Now
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a href="/about" class="bg-transparent border-2 border-white text-white hover:bg-white hover:text-bobcat-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center justify-center text-lg">
            Our Story
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Products -->
  <section class="section-padding bg-white">
    <div class="container-width">
      <div class="text-center mb-12">
        <span class="text-bobcat-600 font-semibold text-sm uppercase tracking-wider">Shop</span>
        <h2 class="font-display text-3xl md:text-4xl font-bold text-warm-900 mt-2">
          Featured Products
        </h2>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        {featuredProducts.map((product) => (
          <div class="card overflow-hidden group">
            <div class="aspect-square bg-warm-100 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-6">
              <h3 class="font-display text-xl font-bold text-warm-900 mb-2">{product.name}</h3>
              <p class="text-warm-600 text-sm mb-4">{product.description}</p>
              <div class="flex items-center justify-between">
                <span class="font-display text-2xl font-bold text-bobcat-600">${product.price}</span>
                <button
                  class="add-to-cart-btn btn-primary text-sm"
                  data-product-id={product.id}
                  data-product-name={product.name}
                  data-product-price={product.price}
                  data-product-image={product.image}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div class="text-center mt-12">
        <a href="/shop" class="btn-secondary">
          View All Products
        </a>
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section class="section-padding bg-warm-50">
    <div class="container-width">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span class="text-bobcat-600 font-semibold text-sm uppercase tracking-wider">About Us</span>
          <h2 class="font-display text-3xl md:text-4xl font-bold text-warm-900 mt-2 mb-6">
            Created by Caregivers, for Caregivers
          </h2>
          <div class="prose prose-lg text-warm-600 space-y-4">
            <p>
              You know the unique challenges you face every day. That's why this collection of accessories was created—to offer tools that are not only functional but also bring a touch of style and enjoyment to your daily routine.
            </p>
            <p>
              Each piece is carefully curated to meet the high standards you expect in your demanding environment.
            </p>
          </div>
          <a href="/about" class="btn-primary mt-8">
            Learn More About Us
          </a>
        </div>
        <div class="relative">
          <img
            src="https://placehold.co/600x400/0d8f8f/ffffff?text=About+Bobcat+Medical"
            alt="Bobcat Medical Team"
            class="w-full rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="section-padding bg-bobcat-600 text-white">
    <div class="container-width">
      <div class="text-center mb-12">
        <span class="text-bobcat-200 font-semibold text-sm uppercase tracking-wider">Reviews</span>
        <h2 class="font-display text-3xl md:text-4xl font-bold mt-2">
          What Nurses Are Saying
        </h2>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div class="bg-white/10 backdrop-blur rounded-2xl p-6">
            <div class="flex gap-1 mb-4">
              {[1,2,3,4,5].map(() => (
                <svg class="w-5 h-5 text-coral-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <p class="text-bobcat-100 mb-4 text-sm leading-relaxed">"{testimonial.text}"</p>
            <p class="font-semibold text-white">— {testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="section-padding bg-white">
    <div class="container-width text-center">
      <h2 class="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-4">
        Ready to Upgrade Your Gear?
      </h2>
      <p class="text-warm-600 text-lg mb-8 max-w-2xl mx-auto">
        Join thousands of healthcare professionals who trust Bobcat Medical for their everyday essentials.
      </p>
      <a href="/shop" class="btn-primary text-lg">
        Shop Now
      </a>
    </div>
  </section>
</BaseLayout>

<script>
  import { addToCart } from '@lib/cart';

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const button = e.currentTarget as HTMLElement;
      const productId = button.dataset.productId!;
      const name = button.dataset.productName!;
      const price = parseFloat(button.dataset.productPrice!);
      const image = button.dataset.productImage;

      addToCart({ productId, name, price, image }, 1);

      // Visual feedback
      button.textContent = 'Added!';
      button.classList.add('bg-green-500');
      setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.classList.remove('bg-green-500');
      }, 1500);
    });
  });
</script>
```

### File: `src/pages/shop/index.astro`

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';

// Placeholder products - these will come from Keystatic
const products = [
  {
    id: 'magnetic-stethoscope-holder',
    name: 'Magnetic Stethoscope Holder',
    price: 18.99,
    image: 'https://placehold.co/400x400/0d8f8f/ffffff?text=Magnetic+Holder',
    category: 'Stethoscope Holders',
    description: 'Strong magnet keeps your stethoscope secure and accessible.',
  },
  {
    id: 'velcro-stethoscope-holder',
    name: 'Hook & Loop Velcro Stethoscope Holder',
    price: 18.99,
    image: 'https://placehold.co/400x400/0d8f8f/ffffff?text=Velcro+Holder',
    category: 'Stethoscope Holders',
    description: 'Secure velcro attachment for easy one-hand access.',
  },
  {
    id: 'nurse-fanny-pack',
    name: 'Nurse Fanny Pack',
    price: 22.99,
    comparePrice: 23.99,
    image: 'https://placehold.co/400x400/0d8f8f/ffffff?text=Fanny+Pack',
    category: 'Nurse Accessories',
    description: 'Keep all your essentials organized and within reach.',
  },
];

const categories = ['All', 'Stethoscope Holders', 'Nurse Accessories'];
---

<BaseLayout 
  title="Shop"
  description="Shop premium medical accessories at Bobcat Medical. Stethoscope holders, nurse fanny packs, and more."
>
  <!-- Hero -->
  <section class="bg-bobcat-800 text-white py-16">
    <div class="container-width text-center">
      <h1 class="font-display text-4xl md:text-5xl font-bold mb-4">Shop All Products</h1>
      <p class="text-bobcat-100 text-lg max-w-2xl mx-auto">
        Premium medical accessories designed for healthcare professionals who demand quality.
      </p>
    </div>
  </section>

  <!-- Products Grid -->
  <section class="section-padding bg-warm-50">
    <div class="container-width">
      <!-- Category Filter -->
      <div class="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((category, index) => (
          <button
            class={`px-4 py-2 rounded-full font-medium transition-colors ${
              index === 0
                ? 'bg-bobcat-600 text-white'
                : 'bg-white text-warm-700 hover:bg-bobcat-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <!-- Products -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div class="card overflow-hidden group">
            <a href={`/shop/product/${product.id}`} class="block">
              <div class="aspect-square bg-warm-100 overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.comparePrice && (
                  <span class="absolute top-4 left-4 bg-coral-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Sale
                  </span>
                )}
              </div>
            </a>
            <div class="p-6">
              <span class="text-xs text-bobcat-600 font-medium uppercase tracking-wider">
                {product.category}
              </span>
              <h3 class="font-display text-xl font-bold text-warm-900 mt-1 mb-2">
                <a href={`/shop/product/${product.id}`} class="hover:text-bobcat-600 transition-colors">
                  {product.name}
                </a>
              </h3>
              <p class="text-warm-600 text-sm mb-4">{product.description}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="font-display text-2xl font-bold text-bobcat-600">${product.price}</span>
                  {product.comparePrice && (
                    <span class="text-warm-400 line-through text-sm">${product.comparePrice}</span>
                  )}
                </div>
                <button
                  class="add-to-cart-btn btn-primary text-sm"
                  data-product-id={product.id}
                  data-product-name={product.name}
                  data-product-price={product.price}
                  data-product-image={product.image}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
</BaseLayout>

<script>
  import { addToCart } from '@lib/cart';

  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const button = e.currentTarget as HTMLElement;
      const productId = button.dataset.productId!;
      const name = button.dataset.productName!;
      const price = parseFloat(button.dataset.productPrice!);
      const image = button.dataset.productImage;

      addToCart({ productId, name, price, image }, 1);

      button.textContent = 'Added!';
      button.classList.add('bg-green-500');
      setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.classList.remove('bg-green-500');
      }, 1500);
    });
  });
</script>
```

---

## 🔐 PHASE 7: ADMIN ROUTES (Keystatic)

### File: `src/pages/keystatic/[...params].astro`

```astro
---
import { Keystatic } from '@keystatic/astro/ui';
---
<Keystatic />
```

### File: `src/pages/api/keystatic/[...params].ts`

```typescript
import { makeHandler } from '@keystatic/astro/api';
import config from '../../../../keystatic.config';

export const all = makeHandler({ config });
export const prerender = false;
```

---

## 📁 PHASE 8: STATIC FILES

### File: `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://bobcatmedical.com/sitemap-index.xml

# Block admin pages from search engines
Disallow: /keystatic/
Disallow: /api/
```

### File: `public/favicon.svg`

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0d8f8f"/>
  <text x="50" y="68" font-family="Arial, sans-serif" font-size="50" font-weight="bold" text-anchor="middle" fill="white">B</text>
</svg>
```

---

## 📋 PHASE 9: REMAINING PAGES TO CREATE

Create these additional pages following the same patterns:

1. **`src/pages/blog/index.astro`** - Blog listing page
2. **`src/pages/blog/[slug].astro`** - Individual blog post (uses Keystatic content)
3. **`src/pages/events/index.astro`** - Events listing
4. **`src/pages/about.astro`** - About page
5. **`src/pages/contact.astro`** - Contact form page
6. **`src/pages/faq.astro`** - FAQ page with accordion
7. **`src/pages/warranty.astro`** - Warranty registration
8. **`src/pages/shop/product/[slug].astro`** - Individual product page

---

## 🔧 PHASE 10: BACKEND - STOREFRONT MODULE

Add this to the NestJS backend (`lpai-app-main-deploy`):

### File: `services/api-nestjs/src/storefront/storefront.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { StorefrontController } from './storefront.controller';
import { StorefrontService } from './storefront.service';
import { StorefrontCronService } from './storefront-cron.service';
import { MongoDbService } from '../common/database/mongodb.service';

@Module({
  controllers: [StorefrontController],
  providers: [StorefrontService, StorefrontCronService, MongoDbService],
  exports: [StorefrontService],
})
export class StorefrontModule {}
```

### File: `services/api-nestjs/src/storefront/storefront.controller.ts`

```typescript
import { Controller, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { StorefrontService } from './storefront.service';
import { StorefrontCheckoutDto } from './dto/checkout.dto';

@Controller('storefront')
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  async checkout(@Body() dto: StorefrontCheckoutDto) {
    return this.storefrontService.createCheckout(dto);
  }

  @Post('webhook/:clientId')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Param('clientId') clientId: string,
    @Body() payload: any,
  ) {
    return this.storefrontService.handleWebhook(clientId, payload);
  }
}
```

### File: `services/api-nestjs/src/storefront/dto/checkout.dto.ts`

```typescript
import { IsString, IsEmail, IsArray, IsNumber, IsOptional, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class StorefrontCheckoutDto {
  @IsString()
  clientId: string; // e.g., 'bobcat-medical'

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @IsEmail()
  customerEmail: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;
}
```

### MongoDB Collection: `storefronts`

Create this document in MongoDB:

```json
{
  "clientId": "bobcat-medical",
  "name": "Bobcat Medical",
  "ghlLocationId": "YOUR_GHL_LOCATION_ID",
  "ghlApiToken": "YOUR_GHL_API_TOKEN",
  "businessDetails": {
    "name": "Bobcat Medical",
    "website": "https://bobcatmedical.com",
    "email": "info@bobcatmedicalstore.com"
  },
  "invoicePrefix": "BCM",
  "cleanupHours": 6,
  "createdAt": "2026-01-29T00:00:00.000Z"
}
```

---

## ✅ ASSETS CHECKLIST - NEED FROM CLIENT

### Critical (Before Launch)
- [ ] Logo (SVG, PNG with transparency)
- [ ] Product images (all 3 products, multiple angles)
- [ ] GHL Location ID
- [ ] GHL API Token (or access to generate)
- [ ] Social media URLs (Instagram, Facebook)

### Nice to Have
- [ ] Brand color codes (if different from spec)
- [ ] Hero/banner images
- [ ] About page photos
- [ ] Team photos
- [ ] Customer photos for testimonials

### Content
- [ ] Detailed product descriptions
- [ ] About page story
- [ ] FAQ additions
- [ ] April event details + Instagram link

---

## 🚀 DEPLOYMENT STEPS

1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables:
   - `PUBLIC_API_URL=https://lpai-monorepo-production.up.railway.app/api`
4. Deploy
5. Set custom domain
6. Submit sitemap to Google Search Console

---

## 📝 NOTES

- All images use placeholder URLs - replace with Cloudinary URLs when available
- Keystatic admin is at `/keystatic` - no auth by default (add in production)
- Cart uses localStorage key `bobcat_cart`
- Backend uses generic storefront module - configure client in MongoDB
- Cron cleanup runs every 6 hours for abandoned invoices

---

**END OF BUILD SPECIFICATION**
