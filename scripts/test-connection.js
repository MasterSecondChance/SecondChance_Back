const MongoLib = require('../lib/mongo');

async function testConnection() {
  const mongoDB = new MongoLib();
  
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    const db = await mongoDB.connect();
    console.log('✅ Connected to database:', db.databaseName);
    
    // Listar colecciones
    const collections = await db.listCollections().toArray();
    console.log('📋 Collections:', collections.map(c => c.name));
    
    // Test básico
    const stats = await db.stats();
    console.log('📊 Database stats:', {
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize
    });
    
    console.log('🎉 Connection test successful!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    process.exit(1);
  }
}

testConnection(); 