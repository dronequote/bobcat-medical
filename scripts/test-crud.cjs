/**
 * CRUD Test Script for Bobcat Medical
 * Tests creating blog posts and products with GHL sync
 *
 * Run with: node scripts/test-crud.js
 */

const { MongoClient, ObjectId } = require('mongodb');
const axios = require('axios');

const MONGODB_URI = 'mongodb+srv://mobileApp:A602ZiVx1ZrZpACw@leadprospectcluster.ujmqx.mongodb.net/lpai';
const CLIENT_ID = 'bobcat-medical';
const GHL_LOCATION_ID = 'WpD7EkK85yOehQLmDtrR';
const GHL_API_TOKEN = 'pit-f38f3d9b-2a83-4465-867e-b21453b814ba';

async function main() {
  console.log('🔗 Connecting to MongoDB...');
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('lpai');

  try {
    // ============================================
    // TEST 1: Create Blog Post
    // ============================================
    console.log('\n📝 TEST 1: Creating test blog post...');

    const blogPost = {
      _id: new ObjectId(),
      clientId: CLIENT_ID,
      title: 'CRUD Test: Best Practices for Stethoscope Care',
      slug: 'crud-test-stethoscope-care-' + Date.now(),
      excerpt: 'Learn how to properly care for your stethoscope to extend its life and maintain accuracy.',
      content: `# Best Practices for Stethoscope Care

Your stethoscope is one of your most important diagnostic tools. Here's how to keep it in top condition.

## Daily Cleaning

- Wipe the diaphragm and bell with alcohol after each patient
- Clean the earpieces weekly
- Never submerge in liquid

## Storage Tips

- Use a stethoscope holder to prevent kinks
- Store at room temperature
- Keep away from sharp objects

## When to Replace

- If sound quality diminishes
- If tubing becomes cracked or stiff
- Every 2-3 years for heavy use

*This is a test blog post created by the CRUD test script.*`,
      coverImage: 'https://storage.googleapis.com/msgsndr/WpD7EkK85yOehQLmDtrR/media/6961c566d2cd174117099437.jpg',
      author: 'CRUD Test Script',
      tags: ['test', 'stethoscope', 'care'],
      published: true,
      publishedAt: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('storefrontBlogPosts').insertOne(blogPost);
    console.log('✅ Blog post created:', blogPost._id.toString());
    console.log('   Slug:', blogPost.slug);

    // ============================================
    // TEST 2: Create Product with GHL Sync
    // ============================================
    console.log('\n🛍️ TEST 2: Creating test product with GHL sync...');

    // First create in GHL
    console.log('   Creating product in GHL...');
    let ghlProductId = null;

    try {
      const ghlPayload = {
        locationId: GHL_LOCATION_ID,
        name: 'CRUD Test Product - ' + Date.now(),
        description: 'Test product created by CRUD test script',
        productType: 'PHYSICAL',
        availableInStore: true,
        image: 'https://storage.googleapis.com/msgsndr/WpD7EkK85yOehQLmDtrR/media/6961c566d2cd174117099437.jpg'
      };

      const ghlResponse = await axios.post(
        'https://services.leadconnectorhq.com/products/',
        ghlPayload,
        {
          headers: {
            'Authorization': `Bearer ${GHL_API_TOKEN}`,
            'Version': '2021-07-28',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      ghlProductId = ghlResponse.data?.product?._id || ghlResponse.data?._id;
      console.log('   ✅ GHL product created:', ghlProductId);

      // Create price in GHL
      if (ghlProductId) {
        console.log('   Creating price in GHL...');
        await axios.post(
          'https://services.leadconnectorhq.com/products/prices',
          {
            locationId: GHL_LOCATION_ID,
            product: ghlProductId,
            name: 'CRUD Test Product',
            type: 'one_time',
            amount: 999, // $9.99 in cents
            currency: 'USD'
          },
          {
            headers: {
              'Authorization': `Bearer ${GHL_API_TOKEN}`,
              'Version': '2021-07-28',
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        console.log('   ✅ GHL price created');
      }
    } catch (err) {
      console.log('   ⚠️ GHL sync failed:', err.response?.data?.message || err.message);
    }

    // Create in MongoDB
    const product = {
      _id: new ObjectId(),
      clientId: CLIENT_ID,
      name: 'CRUD Test Product',
      slug: 'crud-test-product-' + Date.now(),
      sku: 'TEST-' + Date.now(),
      description: 'Test product created by CRUD test script. This verifies the product creation flow.',
      price: 9.99,
      compareAtPrice: 14.99,
      categoryId: null,
      images: [
        { src: 'https://storage.googleapis.com/msgsndr/WpD7EkK85yOehQLmDtrR/media/6961c566d2cd174117099437.jpg', alt: 'Test Product' }
      ],
      specs: [
        { label: 'Test Spec', value: 'Test Value' }
      ],
      stock: 10,
      trackInventory: true,
      published: true,
      featured: false,
      ghlProductId: ghlProductId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('storefrontProducts').insertOne(product);
    console.log('✅ MongoDB product created:', product._id.toString());
    console.log('   Slug:', product.slug);
    console.log('   GHL Product ID:', ghlProductId || 'Not synced');

    // ============================================
    // TEST 3: Verify via API
    // ============================================
    console.log('\n🔍 TEST 3: Verifying via public API...');

    const productsResponse = await axios.get(`https://lpai-monorepo-production.up.railway.app/api/storefront/${CLIENT_ID}/products`);
    const testProduct = productsResponse.data.find(p => p._id === product._id.toString());

    if (testProduct) {
      console.log('✅ Product found in API response');
      console.log('   Name:', testProduct.name);
      console.log('   GHL ID:', testProduct.ghlProductId);
    } else {
      console.log('⚠️ Product not found in API (may need a moment to propagate)');
    }

    const blogResponse = await axios.get(`https://lpai-monorepo-production.up.railway.app/api/storefront/${CLIENT_ID}/blog`);
    const testBlog = blogResponse.data.find(b => b._id === blogPost._id.toString());

    if (testBlog) {
      console.log('✅ Blog post found in API response');
      console.log('   Title:', testBlog.title);
    } else {
      console.log('⚠️ Blog post not found in API (may need a moment to propagate)');
    }

    // ============================================
    // TEST 4: Verify GHL Product Exists
    // ============================================
    if (ghlProductId) {
      console.log('\n🔍 TEST 4: Verifying GHL product...');
      try {
        const ghlVerify = await axios.get(
          `https://services.leadconnectorhq.com/products/${ghlProductId}`,
          {
            headers: {
              'Authorization': `Bearer ${GHL_API_TOKEN}`,
              'Version': '2021-07-28',
              'Accept': 'application/json'
            },
            params: { locationId: GHL_LOCATION_ID }
          }
        );
        console.log('✅ GHL product verified');
        console.log('   Name:', ghlVerify.data?.product?.name);
      } catch (err) {
        console.log('⚠️ GHL verification failed:', err.response?.data?.message || err.message);
      }
    }

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log('Blog Post ID:', blogPost._id.toString());
    console.log('Blog Slug:', blogPost.slug);
    console.log('Product ID:', product._id.toString());
    console.log('Product Slug:', product.slug);
    console.log('GHL Product ID:', ghlProductId || 'N/A');
    console.log('\n🌐 Test URLs:');
    console.log(`   Blog: http://localhost:4321/blog/${blogPost.slug}`);
    console.log(`   Product: http://localhost:4321/shop/product/${product.slug}`);
    console.log(`   Shop: http://localhost:4321/shop`);
    console.log('\n✅ CRUD tests complete!');

  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    await client.close();
  }
}

main();
