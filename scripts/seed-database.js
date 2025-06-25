const MongoLib = require('../lib/mongo');
const bcrypt = require('bcrypt');

async function seedDatabase() {
  const mongoDB = new MongoLib();
  
  try {
    console.log('🌱 Seeding database...');

    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('TestPassword123!', 10);
    
    const testUser = {
      userName: 'Test User Juan',
      email: 'testuser@example.com',
      phone: '3001234567',
      password: hashedPassword,
      urlPhoto: 'https://via.placeholder.com/150',
      profileId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const userId = await mongoDB.create('users', testUser);
    console.log('✅ Test user created:', userId);

    // Crear artículo de prueba
    const testArticle = {
      phoneOwner: '3001234567',
      idOwner: userId.toString(),
      type: 'Camiseta',
      size: 'M',
      name: 'Camiseta Nike Básica',
      brand: 'Nike',
      condition: 'Usado - Buen estado',
      gender: 'Unisex',
      description: 'Camiseta deportiva en excelente estado',
      color: 'Azul',
      date: new Date().toLocaleString(),
      urlPhoto: 'https://via.placeholder.com/300x400/0074D9/FFFFFF?text=Camiseta+Nike',
      city: 'Bogotá',
      createdAt: new Date()
    };

    const articleId = await mongoDB.create('articles', testArticle);
    console.log('✅ Test article created:', articleId);

    // Crear más artículos de ejemplo
    const additionalArticles = [
      {
        phoneOwner: '3001234567',
        idOwner: userId.toString(),
        type: 'Pantalón',
        size: '32',
        name: 'Jeans Levi\'s 501',
        brand: 'Levi\'s',
        condition: 'Usado - Excelente estado',
        gender: 'Hombre',
        description: 'Jeans clásicos en perfecto estado',
        color: 'Azul Oscuro',
        date: new Date().toLocaleString(),
        urlPhoto: 'https://via.placeholder.com/300x400/001f3f/FFFFFF?text=Jeans+Levis',
        city: 'Medellín',
        createdAt: new Date()
      },
      {
        phoneOwner: '3001234567',
        idOwner: userId.toString(),
        type: 'Chaqueta',
        size: 'L',
        name: 'Chaqueta Deportiva Adidas',
        brand: 'Adidas',
        condition: 'Nuevo',
        gender: 'Unisex',
        description: 'Chaqueta deportiva nunca usada',
        color: 'Negro',
        date: new Date().toLocaleString(),
        urlPhoto: 'https://via.placeholder.com/300x400/111111/FFFFFF?text=Chaqueta+Adidas',
        city: 'Cali',
        createdAt: new Date()
      }
    ];

    for (const article of additionalArticles) {
      const articleId = await mongoDB.create('articles', article);
      console.log('✅ Additional article created:', articleId);
    }

    // Crear segundo usuario
    const secondUser = {
      userName: 'Test User Maria',
      email: 'testmaria@example.com',
      phone: '3009876543',
      password: await bcrypt.hash('TestMaria123!', 10),
      urlPhoto: 'https://via.placeholder.com/150/FF69B4/FFFFFF?text=M',
      profileId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const secondUserId = await mongoDB.create('users', secondUser);
    console.log('✅ Second user created:', secondUserId);

    // Crear artículo para segundo usuario
    const secondUserArticle = {
      phoneOwner: '3009876543',
      idOwner: secondUserId.toString(),
      type: 'Vestido',
      size: 'S',
      name: 'Vestido Floral Zara',
      brand: 'Zara',
      condition: 'Usado - Buen estado',
      gender: 'Mujer',
      description: 'Hermoso vestido floral para ocasiones especiales',
      color: 'Floral',
      date: new Date().toLocaleString(),
      urlPhoto: 'https://via.placeholder.com/300x400/FF69B4/FFFFFF?text=Vestido+Zara',
      city: 'Bogotá',
      createdAt: new Date()
    };

    const secondArticleId = await mongoDB.create('articles', secondUserArticle);
    console.log('✅ Second user article created:', secondArticleId);

    console.log('🎉 Database seeded successfully!');
    console.log('📊 Summary:');
    console.log('  - 2 users created');
    console.log('  - 4 articles created');
    console.log('  - Ready for testing!');
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase; 