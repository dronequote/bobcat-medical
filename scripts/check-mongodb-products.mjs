// Check current MongoDB products for Bobcat Medical
import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://mobileApp:A602ZiVx1ZrZpACw@leadprospectcluster.ujmqx.mongodb.net/lpai?retryWrites=true&w=majority';

async function checkProducts() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB\n');

    const db = client.db('lpai');
    const products = db.collection('storefrontProducts');

    // Get all Bobcat Medical products
    const bobcatProducts = await products.find({ clientId: 'bobcat-medical' }).toArray();

    console.log(`Found ${bobcatProducts.length} Bobcat Medical products:\n`);

    for (const p of bobcatProducts) {
      console.log(`Name: ${p.name}`);
      console.log(`  Slug: ${p.slug}`);
      console.log(`  _id: ${p._id}`);
      console.log(`  ghlProductId: ${p.ghlProductId || 'NOT SET'}`);
      console.log(`  images: ${JSON.stringify(p.images)}`);
      console.log(`  price: $${p.price}`);
      console.log('');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkProducts();
