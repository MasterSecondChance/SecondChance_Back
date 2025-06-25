const MongoLib = require('../lib/mongo');

/**
 * 🗑️ Database Reset Script for Troud
 * WARNING: This script will DELETE ALL DATA in the database!
 */

async function resetDatabase() {
  const mongoDB = new MongoLib();
  
  try {
    console.log('🗑️  WARNING: This will DELETE ALL DATA in the database!');
    console.log('⏰ Starting database reset in 3 seconds...');
    
    // Give user time to cancel (Ctrl+C)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const db = await mongoDB.connect();
    console.log('✅ Connected to database:', db.databaseName);

    // Get all collections
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('ℹ️  Database is already empty');
      process.exit(0);
    }

    console.log(`🔄 Found ${collections.length} collections to delete...`);
    
    // Delete each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await db.collection(collectionName).estimatedDocumentCount();
      
      await db.collection(collectionName).drop();
      console.log(`  ❌ Deleted collection '${collectionName}' (${count} documents)`);
    }

    console.log('🧹 Database reset completed successfully!');
    console.log('📝 Next steps:');
    console.log('   1. Run: npm run schema:setup');
    console.log('   2. Run: npm run seed');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  }
}

// Ask for confirmation if run directly
if (require.main === module) {
  console.log('⚠️  DANGER ZONE: Database Reset');
  console.log('================================');
  console.log('This will permanently delete ALL data in your database!');
  console.log('Collections that will be deleted:');
  console.log('  - users');
  console.log('  - articles');
  console.log('  - reactions');
  console.log('  - matches');
  console.log('  - images');
  console.log('');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
  
  setTimeout(() => {
    resetDatabase();
  }, 5000);
}

module.exports = resetDatabase; 