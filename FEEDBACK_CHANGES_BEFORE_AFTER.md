# Homepage Feedback — Before & After Summary

This document summarizes all changes made from the client feedback (Feb 2026). Items that still need your input (e.g. April event details, any FAQ wording tweaks) are listed at the end.

---

## 1. Logo

| Location | Before | After |
|----------|--------|--------|
| **Header** (`Header.astro`) | Logo height: `h-14` (56px) | Logo height: `h-20` (80px) for stronger brand presence |

---

## 2. Hero Messaging

| Location | Before | After |
|----------|--------|--------|
| **Homepage hero** (`index.astro`) | “Created by caregivers, for caregivers. Premium accessories…” | “Built by medical professionals, for medical professionals. Premium accessories…” |
| **Homepage About strip** (`index.astro`) | “Created by Caregivers, for Caregivers” | “Built by Medical Professionals, for Medical Professionals” |

---

## 3. About Page — Tone & “Healthcare Heroes” Removed

| Location | Before | After |
|----------|--------|--------|
| **Meta description** | “created by caregivers, for caregivers” | “built by medical professionals, for medical professionals” |
| **Hero tagline** | “Created by caregivers, for caregivers” | “Built by medical professionals, for medical professionals” |
| **Image caption (card)** | “Serving Healthcare Heroes” | “Real gear for real shifts” |
| **Genuine Care value** | “Created by caregivers… We're passionate about supporting healthcare heroes.” | “Built by medical professionals… We focus on functionality and quality for real work environments.” |
| **Schema (about.astro)** | description: “created by caregivers…”; founders: “Healthcare Professionals” | description: “built by medical professionals…”; founders: “Jenny Abusilla” |

---

## 4. Shop — Single Shop Page (No Category Filters)

| Location | Before | After |
|----------|--------|--------|
| **Shop page** (`shop/index.astro`) | Category filter pills (All, Stethoscope Holders, Nurse Accessories); products filtered by `?category=` | Single “Shop All Products” grid; no category filter UI; all products shown |
| **Data** | `getProducts()` + `getCategories()`; `filteredProducts` from URL | `getProducts()` only; `products` shown directly |
| **Footer Products** (`Footer.astro`) | Links: Stethoscope Holders, Nurse Accessories, All Products | Single link: “All Products” → `/shop` |

---

## 5. FAQ — Full Content Pass

### Products
| Question / Topic | Before | After |
|------------------|--------|--------|
| **Magnetic vs Velcro** | Long technical comparison (magnets vs velcro, price, medical equipment) | Short: magnetic vs Velcro closure; both strong and reliable; choice = personal preference |
| **Colors** | Magnetic: Black, Navy, Maroon, Beige; Velcro: Pink, Navy, Black; Packs: Pink, Black, Royal Blue, Purple | Magnetic: Black, Navy Blue, Maroon, Gray; Velcro: Black, Navy Blue, Pink (packs not restated) |
| **Phone / credit cards** | Cautious (keep cards in separate pocket; chip not affected) | No known issues; holder not near phones/wallets in normal use |
| **Stethoscope compatibility** | “All major brands…” | All major brands; **Eko not recommended** (head shape/weight poor fit), not “won’t work” |
| **Cleaning** | Hospital-grade wipes, deeper cleaning described | “Any standard antibacterial wipe is sufficient” + optional deeper cleaning |

### Shipping & Delivery
| Topic | Before | After |
|-------|--------|--------|
| **Shipping time** | 3–5 days + expedited/overnight + 2 PM cutoff | Ground 3–5 business days; tracking when it ships |
| **International** | Yes, Canada/UK/Australia/Europe, 7–14 days | Website: no international; Amazon handles international |
| **Tracking** | Email + account or guest link | USPS and UPS; tracking numbers provided automatically |
| **Free shipping** | Free over $35; under $35 = $4.99 | Free shipping on orders over $50 (note: may need checkout config) |

### Returns & Exchanges
| Topic | Before | After |
|-------|--------|--------|
| **Return policy** | 30-day guarantee, condition/tags, prepaid for defective | 30-day return window with receipt; refunds automatic within window; initiate via Contact page |
| **Initiate return** | Email with order # and reason; prepaid label for defective | Contact page; we provide instructions and process refund when item received |
| **Exchanges** | Yes, contact within 30 days, exchange for color/size | No exchanges for color or size; all sales final except 30-day returns |

### Orders & Payment
| Topic | Before | After |
|-------|--------|--------|
| **Payment methods** | Cards, PayPal, Apple Pay, Google Pay, SSL | All major credit cards and PayPal; processed securely |
| **Order changes** | Modify/cancel within 2 hours; contact email | Changes allowed within 2 hours; after that orders process quickly for shipping |
| **Payment security** | SSL, no full card stored, PCI-compliant | Payment info secure; encryption and PCI-compliant processing; no full card stored |
| **Wholesale** | Yes, 10+ units, contact for quote | Yes; quantity thresholds TBD; “Contact us for wholesale inquiries” |

### About Bobcat Medical
| Topic | Before | After |
|-------|--------|--------|
| **Founder** | “Healthcare professionals” / “working nurses, paramedics…” | **Jenny Abusilla**; founded ~2 years ago; mission: enjoyability and efficiency of medical work |
| **Manufacturing** | Designed in California, vetted partners | Currently manufactured in China; exploring U.S. manufacturing |
| **Physical store** | Online-only, HQ Winchester, events | No physical retail; online-only; events/conferences/pop-ups; see Events page |
| **Customer support** | Email, phone, 24hr response | All inquiries via Contact page; email and phone; typically within 24 hours |

---

## 6. Footer & Trust Badges

| Location | Before | After |
|----------|--------|--------|
| **Tagline** | “Created by caregivers, for caregivers. Medical gear…” | “Built by medical professionals, for medical professionals. Medical gear…” |
| **Free shipping badge** | “Free Shipping $35+” | “Free Shipping $50+” |

---

## 7. Events & Blog

- **Events:** No structural changes. April event can be added/edited when you have final details (name, date, location, link). Placeholder “Nursing Expo April 2026” remains in code/data until you provide specifics.
- **Blog:** No design or code changes; drafts can stay unpublished until the content calendar is set.

---

## 8. Pricing (Website vs Amazon)

- No code changes. Positioning note only: site can price higher (e.g. event pricing ~$27 / ~$28); Amazon as volume/discovery; website as brand-direct and event-focused.

---

## Still Need Your Input (Next / Later)

1. **April event** — Final name, date(s), location, registration or info link so we can add or update the April event on the Events page.
2. **FAQ wording** — Any specific tweaks to payment security or wholesale CTA wording (current copy is professional and aligned with the feedback).
3. **Free shipping** — Confirm free shipping over $50 is (or will be) configured in checkout so the FAQ and footer badge are accurate.

---

*Summary generated after implementing Feb 2026 homepage feedback.*
