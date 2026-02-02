/**
 * MongoDB Seed Script for Bobcat Medical
 *
 * Run with: mongosh "your-connection-string" scripts/seed-mongodb.js
 * Or copy/paste sections into MongoDB Compass
 */

// Use the correct database
// db = db.getSiblingDB('your-database-name');

// ============================================
// 1. STOREFRONT CONFIG
// ============================================

print("Creating storefront config...");

db.storefronts.updateOne(
  { clientId: "bobcat-medical" },
  {
    $set: {
      clientId: "bobcat-medical",
      name: "Bobcat Medical",
      ghlLocationId: "WpD7EkK85yOehQLmDtrR",
      ghlApiToken: "pit-f38f3d9b-2a83-4465-867e-b21453b814ba",
      siteUrl: "https://bobcatmedical.com",
      businessName: "Bobcat Medical",
      businessAddress: "123 Healthcare Blvd, Medical City, MC 12345",
      businessEmail: "info@bobcatmedical.com",
      logoUrl: null,
      primaryColor: "#0d8f8f",
      superadminEmails: [
        "info@leadprospecting.ai"
      ],
      hiddenSuperadminEmail: "info@leadprospecting.ai",
      isActive: true,
      updatedAt: new Date()
    },
    $setOnInsert: {
      createdAt: new Date()
    }
  },
  { upsert: true }
);

print("Storefront config created/updated.");

// ============================================
// 2. CATEGORIES
// ============================================

print("Creating categories...");

const categories = [
  {
    clientId: "bobcat-medical",
    name: "Stethoscope Accessories",
    slug: "stethoscope-accessories",
    description: "Premium accessories to organize and protect your stethoscope",
    image: null,
    sortOrder: 1,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    clientId: "bobcat-medical",
    name: "Nurse Essentials",
    slug: "nurse-essentials",
    description: "Must-have accessories for nursing professionals",
    image: null,
    sortOrder: 2,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

categories.forEach(cat => {
  db.storefrontCategories.updateOne(
    { clientId: cat.clientId, slug: cat.slug },
    { $set: cat, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
});

print("Categories created.");

// Get category IDs for products
const stethoscopeCategory = db.storefrontCategories.findOne({ clientId: "bobcat-medical", slug: "stethoscope-accessories" });
const nurseCategory = db.storefrontCategories.findOne({ clientId: "bobcat-medical", slug: "nurse-essentials" });

// ============================================
// 3. PRODUCTS
// ============================================

print("Creating products...");

const products = [
  {
    clientId: "bobcat-medical",
    name: "Hook & Loop Velcro Stethoscope Holder",
    slug: "hook-loop-velcro-stethoscope-holder",
    sku: "BM-HLVSH-001",
    description: "Keep your stethoscope secure and easily accessible with our premium hook & loop velcro holder. Attaches to scrubs, lab coats, or bags. Available in multiple colors to match your style.",
    price: 12.99,
    compareAtPrice: 15.99,
    categoryId: stethoscopeCategory ? stethoscopeCategory._id.toString() : null,
    images: [
      { src: "/images/products/stethoscope-holder-1.jpg", alt: "Hook & Loop Velcro Stethoscope Holder" }
    ],
    specs: [
      { label: "Material", value: "Medical-grade velcro" },
      { label: "Colors", value: "Black, Navy, Ceil Blue" },
      { label: "Attachment", value: "Hook & Loop" }
    ],
    stock: 100,
    trackInventory: true,
    published: true,
    featured: true,
    ghlProductId: null, // Can be linked to GHL product ID later
    metaTitle: "Hook & Loop Velcro Stethoscope Holder | Bobcat Medical",
    metaDescription: "Premium velcro stethoscope holder that attaches to scrubs, lab coats, or bags. Keep your stethoscope secure and accessible.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    clientId: "bobcat-medical",
    name: "Nurse Fanny Pack",
    slug: "nurse-fanny-pack",
    sku: "BM-NFP-001",
    description: "The ultimate utility belt for healthcare professionals. Multiple pockets for pens, scissors, tape, and other essentials. Adjustable strap fits all waist sizes. Water-resistant material for easy cleaning.",
    price: 24.99,
    compareAtPrice: 29.99,
    categoryId: nurseCategory ? nurseCategory._id.toString() : null,
    images: [
      { src: "/images/products/nurse-fanny-pack-1.jpg", alt: "Nurse Fanny Pack" }
    ],
    specs: [
      { label: "Material", value: "Water-resistant nylon" },
      { label: "Pockets", value: "6 compartments" },
      { label: "Strap", value: "Adjustable 28-48 inches" },
      { label: "Colors", value: "Black, Navy, Gray, Pink" }
    ],
    stock: 75,
    trackInventory: true,
    published: true,
    featured: true,
    ghlProductId: null,
    metaTitle: "Nurse Fanny Pack | Bobcat Medical",
    metaDescription: "Professional nurse fanny pack with 6 pockets for all your essentials. Water-resistant, adjustable, and stylish.",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    clientId: "bobcat-medical",
    name: "Magnetic Stethoscope Holder",
    slug: "magnetic-stethoscope-holder",
    sku: "BM-MSH-001",
    description: "Revolutionary magnetic holder that securely clips your stethoscope to any fabric. Strong rare-earth magnets hold up to 2 lbs. No more stethoscope falling off your neck or getting tangled.",
    price: 18.99,
    compareAtPrice: 22.99,
    categoryId: stethoscopeCategory ? stethoscopeCategory._id.toString() : null,
    images: [
      { src: "/images/products/magnetic-holder-1.jpg", alt: "Magnetic Stethoscope Holder" }
    ],
    specs: [
      { label: "Magnet Type", value: "Rare-earth neodymium" },
      { label: "Hold Strength", value: "Up to 2 lbs" },
      { label: "Colors", value: "Silver, Black, Rose Gold, White" },
      { label: "Size", value: "1.5 inch diameter" }
    ],
    stock: 50,
    trackInventory: true,
    published: true,
    featured: true,
    ghlProductId: null,
    metaTitle: "Magnetic Stethoscope Holder | Bobcat Medical",
    metaDescription: "Strong magnetic stethoscope holder with rare-earth magnets. Clips to any fabric securely. No more tangled or falling stethoscopes.",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

products.forEach(prod => {
  db.storefrontProducts.updateOne(
    { clientId: prod.clientId, slug: prod.slug },
    { $set: prod, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
});

print("Products created.");

// ============================================
// 4. SAMPLE BLOG POST
// ============================================

print("Creating sample blog post...");

db.storefrontBlogPosts.updateOne(
  { clientId: "bobcat-medical", slug: "welcome-to-bobcat-medical" },
  {
    $set: {
      clientId: "bobcat-medical",
      title: "Welcome to Bobcat Medical",
      slug: "welcome-to-bobcat-medical",
      excerpt: "We're excited to launch our new online store, dedicated to providing quality medical accessories for healthcare professionals.",
      content: `# Welcome to Bobcat Medical!

We're thrilled to announce the launch of our online store, dedicated to serving healthcare professionals with high-quality medical accessories.

## Our Mission

At Bobcat Medical, we understand the daily challenges faced by nurses, doctors, and medical staff. That's why we've curated a selection of practical, durable, and stylish accessories to make your workday easier.

## What We Offer

- **Stethoscope Accessories** - Keep your most important tool secure and accessible
- **Nurse Essentials** - Everything you need, right at your fingertips
- **Quality Guarantee** - All products tested and approved by healthcare professionals

## Why Choose Us?

1. **Healthcare Professional Approved** - Our products are designed with input from working nurses and doctors
2. **Fast Shipping** - Get your order quickly so you can focus on what matters
3. **Quality Materials** - Medical-grade materials that last through long shifts

Thank you for choosing Bobcat Medical. We're here to support you in your important work!

*- The Bobcat Medical Team*`,
      coverImage: "/images/hero/hero-nurse.jpg",
      author: "Bobcat Medical Team",
      tags: ["announcement", "welcome", "about us"],
      published: true,
      publishedAt: new Date().toISOString(),
      metaTitle: "Welcome to Bobcat Medical | Quality Medical Accessories",
      metaDescription: "Introducing Bobcat Medical - your source for quality stethoscope holders, nurse fanny packs, and medical accessories.",
      updatedAt: new Date()
    },
    $setOnInsert: { createdAt: new Date() }
  },
  { upsert: true }
);

print("Blog post created.");

// ============================================
// SUMMARY
// ============================================

print("\n=== SEED COMPLETE ===");
print("Storefront config: 1");
print("Categories: " + db.storefrontCategories.countDocuments({ clientId: "bobcat-medical" }));
print("Products: " + db.storefrontProducts.countDocuments({ clientId: "bobcat-medical" }));
print("Blog posts: " + db.storefrontBlogPosts.countDocuments({ clientId: "bobcat-medical" }));
print("\nBobcat Medical is ready to test!");
