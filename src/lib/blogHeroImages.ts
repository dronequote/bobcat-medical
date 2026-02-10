/**
 * Hero images used for blog post covers (by index).
 * Ensures the blog always shows these local images regardless of API data.
 */
export const BLOG_HERO_IMAGES = [
  '/images/hero/nurse-working.jpg',
  '/images/hero/healthcare-professional-conducting-a-checkup-with-2026-01-09-10-14-59-utc.webp',
  '/images/hero/doctor-team-and-hospital-at-work-smile-together-f-2026-01-09-11-47-30-utc.webp',
  '/images/hero/portrait-of-smiling-doctor-with-colleagues-behind-2026-01-06-00-29-35-utc.webp',
  '/images/hero/patient-and-nurse-in-medical-consultation-2026-01-08-06-29-07-utc.webp',
  '/images/hero/hero-nurse.jpg',
  '/images/hero/smiling-multiethnic-group-of-doctors-scientists-i-2026-01-07-01-22-28-utc.webp',
  '/images/hero/hero-medical.jpg',
] as const;

/** Order of placeholder post slugs (for cover image index when API is not used). */
export const BLOG_PLACEHOLDER_SLUGS_ORDER = [
  '10-things-every-night-shift-nurse-needs',
  'best-ways-to-keep-stethoscope-accessible',
  'why-magnetic-stethoscope-holders-are-better',
  'self-care-tips-for-healthcare-workers',
  'organizing-your-nursing-essentials',
  'how-to-survive-first-year-nurse',
  'scrub-pocket-essentials-checklist',
  'gift-ideas-for-nurses',
] as const;
