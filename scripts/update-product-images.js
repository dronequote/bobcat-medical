/**
 * Update Product Images in MongoDB
 *
 * Run with: mongosh "your-connection-string" scripts/update-product-images.js
 *
 * Or copy the commands into MongoDB Compass
 */

print("Updating product images...");

// Update Hook & Loop Velcro Stethoscope Holder
db.storefrontProducts.updateOne(
  { clientId: "bobcat-medical", slug: "hook-loop-velcro-stethoscope-holder" },
  {
    $set: {
      images: [
        { src: "/images/products/stethoscope-holder-1.jpg", alt: "Hook & Loop Velcro Stethoscope Holder" }
      ],
      updatedAt: new Date()
    }
  }
);

// Update Nurse Fanny Pack
db.storefrontProducts.updateOne(
  { clientId: "bobcat-medical", slug: "nurse-fanny-pack" },
  {
    $set: {
      images: [
        { src: "/images/products/nurse-fanny-pack-1.jpg", alt: "Nurse Fanny Pack" }
      ],
      updatedAt: new Date()
    }
  }
);

// Update Magnetic Stethoscope Holder
db.storefrontProducts.updateOne(
  { clientId: "bobcat-medical", slug: "magnetic-stethoscope-holder" },
  {
    $set: {
      images: [
        { src: "/images/products/magnetic-holder-1.jpg", alt: "Magnetic Stethoscope Holder" }
      ],
      updatedAt: new Date()
    }
  }
);

print("Product images updated!");

// Verify
print("\nVerifying updates:");
db.storefrontProducts.find(
  { clientId: "bobcat-medical" },
  { name: 1, images: 1 }
).forEach(p => {
  print(`${p.name}: ${JSON.stringify(p.images)}`);
});
