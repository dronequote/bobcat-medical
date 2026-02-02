import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://mobileApp:A602ZiVx1ZrZpACw@leadprospectcluster.ujmqx.mongodb.net/lpai?retryWrites=true&w=majority';

async function updateProductImages() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('lpai');
    const products = db.collection('storefrontProducts');

    // Update Hook & Loop Velcro Stethoscope Holder
    const result1 = await products.updateOne(
      { clientId: 'bobcat-medical', slug: 'hook-loop-velcro-stethoscope-holder' },
      { $set: { images: [{ src: '/images/products/stethoscope-holder-1.jpg', alt: 'Hook & Loop Velcro Stethoscope Holder' }] } }
    );
    console.log('Updated Hook & Loop Velcro Stethoscope Holder:', result1.modifiedCount);

    // Update Nurse Fanny Pack
    const result2 = await products.updateOne(
      { clientId: 'bobcat-medical', slug: 'nurse-fanny-pack' },
      { $set: { images: [{ src: '/images/products/nurse-fanny-pack-1.jpg', alt: 'Nurse Fanny Pack' }] } }
    );
    console.log('Updated Nurse Fanny Pack:', result2.modifiedCount);

    // Update Magnetic Stethoscope Holder
    const result3 = await products.updateOne(
      { clientId: 'bobcat-medical', slug: 'magnetic-stethoscope-holder' },
      { $set: { images: [{ src: '/images/products/magnetic-holder-1.jpg', alt: 'Magnetic Stethoscope Holder' }] } }
    );
    console.log('Updated Magnetic Stethoscope Holder:', result3.modifiedCount);

    // Verify
    console.log('\nVerifying updates:');
    const updated = await products.find({ clientId: 'bobcat-medical' }).toArray();
    updated.forEach(p => {
      console.log(`${p.name}: ${JSON.stringify(p.images)}`);
    });

    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

updateProductImages();
