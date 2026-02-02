# 🚀 QUICK START - For Claude Code

## TL;DR - Run These Commands

```bash
# 1. Navigate to project
cd "C:\Projects\Bobcat Medical"

# 2. Create Astro project
npm create astro@latest . -- --template minimal --typescript strict --install --git --yes

# 3. Install dependencies
npm install @astrojs/tailwind @astrojs/vercel @astrojs/sitemap @astrojs/mdx tailwindcss
npm install @keystatic/core @keystatic/astro
npm install astro-seo astro-icon @iconify-json/heroicons @iconify-json/lucide
npm install @fontsource/plus-jakarta-sans @fontsource/outfit
npm install tailwind-merge clsx zod marked reading-time cloudinary
npm install -D @tailwindcss/typography @tailwindcss/forms

# 4. Start dev server
npm run dev
```

## Key Files to Create (in order)

1. `astro.config.mjs` - Astro config with Tailwind, Vercel, Keystatic
2. `tailwind.config.mjs` - Brand colors (bobcat teal, coral accent)
3. `keystatic.config.tsx` - CMS config for products, blog, events
4. `tsconfig.json` - TypeScript with path aliases
5. `src/styles/global.css` - Tailwind layers + custom classes
6. `src/layouts/BaseLayout.astro` - Full SEO setup
7. `src/components/Header.astro` - Nav with mobile menu
8. `src/components/Footer.astro` - Links + contact
9. `src/lib/cart.ts` - Cart logic (localStorage)
10. `src/components/shop/CartButton.astro` - Floating cart + checkout modal
11. `src/pages/index.astro` - Homepage
12. `src/pages/shop/index.astro` - Shop page
13. `src/pages/keystatic/[...params].astro` - Admin UI
14. `src/pages/api/keystatic/[...params].ts` - Admin API
15. `public/robots.txt` - SEO
16. `public/favicon.svg` - Favicon

## Brand Colors

```
Primary Teal: #0d8f8f
Coral Accent: #f38d72
Warm Gray: #78716c
```

## Admin Dashboard

Access at: `http://localhost:4321/keystatic`

Client can manage:
- Products (name, price, images, GHL ID, description)
- Blog posts
- Events
- Categories
- Site settings

## Checkout Flow

1. Cart stored in localStorage (`bobcat_cart`)
2. Checkout calls: `POST /api/storefront/checkout`
3. Backend creates GHL invoice
4. Returns payment URL → embedded in iframe
5. User completes payment in GHL

## Backend (Add to lpai-app)

Create `StorefrontModule` that:
- Accepts `clientId` (e.g., 'bobcat-medical')
- Looks up GHL credentials from `storefronts` MongoDB collection
- Creates invoice in GHL
- Returns payment URL

---

**Full spec in:** `CLAUDE_BUILD_SPEC.md`
**Client needs:** `CLIENT_CHECKLIST.md`
