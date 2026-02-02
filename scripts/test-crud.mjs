/**
 * CRUD Test Script (ESM version)
 */

import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://mobileApp:A602ZiVx1ZrZpACw@leadprospectcluster.ujmqx.mongodb.net/lpai';
const CLIENT_ID = 'bobcat-medical';
const GHL_LOCATION_ID = 'WpD7EkK85yOehQLmDtrR';
const GHL_API_TOKEN = 'pit-f38f3d9b-2a83-4465-867e-b21453b814ba';

async function main() {
  console.log('🔗 Connecting to MongoDB...');
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('lpai');

    // Create test blog post
    console.log('\n📝 Creating test blog post...');
    const blogPost = {
      _id: new ObjectId(),
      clientId: CLIENT_ID,
      title: 'CRUD Test: Essential Nurse Gear Guide',
      slug: 'crud-test-nurse-gear-guide-' + Date.now(),
      excerpt: 'A comprehensive guide to the essential gear every nurse needs.',
      content: `# Essential Nurse Gear Guide

Every nurse needs the right tools to provide excellent patient care.

## Must-Have Items

1. **Quality Stethoscope** - Your ears on the patient
2. **Stethoscope Holder** - Keep it secure and accessible
3. **Fanny Pack** - All your supplies within reach

## Why Quality Matters

Investing in good equipment means:
- Better patient outcomes
- Less fatigue during long shifts
- More confidence in your assessments

*This is a test blog post created by the CRUD test script.*`,
      coverImage: 'https://storage.googleapis.com/msgsndr/WpD7EkK85yOehQLmDtrR/media/6961c566d2cd174117099437.jpg',
      author: 'CRUD Test Script',
      tags: ['test', 'nurses', 'gear'],
      published: true,
      publishedAt: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const blogResult = await db.collection('storefrontBlogPosts').insertOne(blogPost);
    console.log('✅ Blog post created:', blogResult.insertedId.toString());
    console.log('   Slug:', blogPost.slug);

    // Create test product with GHL sync
    console.log('\n🛍️ Creating test product...');

    // First create in GHL
    let ghlProductId = null;
    try {
      const ghlResponse = await fetch('https://services.leadconnectorhq.com/products/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GHL_API_TOKEN}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          locationId: GHL_LOCATION_ID,
          name: 'CRUD Test - Scrub Cap ' + Date.now(),
          description: 'Test product for CRUD verification',
          productType: 'PHYSICAL',
          availableInStore: true,
          image: 'https://storage.googleapis.com/msgsndr/WpD7EkK85yOehQLmDtrR/media/6966b76202f1be3fdd30bdc6.png'
        })
      });

      const ghlData = await ghlResponse.json();
      ghlProductId = ghlData?.product?._id || ghlData?._id;
      console.log('✅ GHL product created:', ghlProductId);
    } catch (err) {
      console.log('⚠️ GHL sync failed:', err.message);
    }

    // Create in MongoDB
    const product = {
      _id: new ObjectId(),
      clientId: CLIENT_ID,
      name: 'CRUD Test - Scrub Cap',
      slug: 'crud-test-scrub-cap-' + Date.now(),
      sku: 'TEST-SC-' + Date.now(),
      description: 'Test scrub cap product for CRUD verification. Comfortable and breathable.',
      price: 14.99,
      compareAtPrice: 19.99,
      categoryId: null,
      images: [
        { src: 'https://storage.googleapis.com/msgsndr/WpD7EkK85yOehQLmDtrR/media/6966b76202f1be3fdd30bdc6.png', alt: 'Test Scrub Cap' }
      ],
      specs: [
        { label: 'Material', value: 'Cotton blend' },
        { label: 'Size', value: 'One size fits most' }
      ],
      stock: 25,
      trackInventory: true,
      published: true,
      featured: false,
      ghlProductId: ghlProductId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const productResult = await db.collection('storefrontProducts').insertOne(product);
    console.log('✅ MongoDB product created:', productResult.insertedId.toString());
    console.log('   Slug:', product.slug);
    console.log('   GHL ID:', ghlProductId || 'Not synced');

    // Verify via API
    console.log('\n🔍 Verifying via API...');

    const productsRes = await fetch(`https://lpai-monorepo-production.up.railway.app/api/storefront/${CLIENT_ID}/products`);
    const products = await productsRes.json();
    console.log('Total products in API:', products.length);

    const blogRes = await fetch(`https://lpai-monorepo-production.up.railway.app/api/storefront/${CLIENT_ID}/blog`);
    const blogs = await blogRes.json();
    console.log('Total blog posts in API:', blogs.length);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log('Blog Post ID:', blogPost._id.toString());
    console.log('Blog Slug:', blogPost.slug);
    console.log('Product ID:', product._id.toString());
    console.log('Product Slug:', product.slug);
    console.log('GHL Product ID:', ghlProductId || 'N/A');
    console.log('\n🌐 Verify at:');
    console.log(`   Blog: http://localhost:4321/blog/${blogPost.slug}`);
    console.log(`   Product: http://localhost:4321/shop/product/${product.slug}`);
    console.log('\n✅ CRUD tests complete!');

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await client.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

main();
