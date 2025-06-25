const MongoLib = require('../lib/mongo');

/**
 * 🏗️ Database Schema Setup Script for Troud
 * This script creates collections with proper indexes and validation rules
 */

async function setupDatabaseSchema() {
  const mongoDB = new MongoLib();
  
  try {
    console.log('🏗️  Setting up Troud database schema...');
    
    const db = await mongoDB.connect();
    console.log('✅ Connected to database:', db.databaseName);

    // 👤 USERS COLLECTION
    await setupUsersCollection(db);
    
    // 👕 ARTICLES COLLECTION  
    await setupArticlesCollection(db);
    
    // ❤️ REACTIONS COLLECTION
    await setupReactionsCollection(db);
    
    // 💕 MATCHES COLLECTION
    await setupMatchesCollection(db);
    
    // 🖼️ IMAGES COLLECTION (for future use)
    await setupImagesCollection(db);

    console.log('🎉 Database schema setup completed successfully!');
    console.log('📊 Collections created with proper indexes and validation');
    
    // Show collections summary
    await showDatabaseSummary(db);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Schema setup failed:', error);
    process.exit(1);
  }
}

/**
 * 👤 Setup Users Collection
 */
async function setupUsersCollection(db) {
  console.log('👤 Setting up USERS collection...');
  
  try {
    // Create collection with validation
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userName', 'phone', 'password', 'urlPhoto'],
          properties: {
            userName: {
              bsonType: 'string',
              maxLength: 120,
              description: 'User display name - required'
            },
            email: {
              bsonType: 'string',
              pattern: '^[\\w\\._]{5,30}(\\+[\\w]{0,10})?@[\\w\\.\\-]{3,}?\\.[\\w]{2,5}$',
              description: 'Valid email address'
            },
            phone: {
              bsonType: 'string',
              pattern: '^[0-9]{7,10}$',
              description: 'Phone number 7-10 digits - required and unique'
            },
            password: {
              bsonType: 'string',
              minLength: 8,
              description: 'Hashed password - required'
            },
            urlPhoto: {
              bsonType: 'string',
              description: 'Profile photo URL - required'
            },
            profileId: {
              bsonType: ['objectId', 'null'],
              description: 'Optional profile reference'
            },
            createdAt: {
              bsonType: 'date',
              description: 'Account creation timestamp'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'Last update timestamp'
            }
          }
        }
      }
    });

    // Create indexes
    await db.collection('users').createIndex({ phone: 1 }, { unique: true });
    await db.collection('users').createIndex({ email: 1 });
    await db.collection('users').createIndex({ createdAt: -1 });
    
    console.log('  ✅ Users collection created with indexes');
    
  } catch (error) {
    if (error.code === 48) {
      console.log('  ℹ️  Users collection already exists');
    } else {
      throw error;
    }
  }
}

/**
 * 👕 Setup Articles Collection
 */
async function setupArticlesCollection(db) {
  console.log('👕 Setting up ARTICLES collection...');
  
  try {
    await db.createCollection('articles', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['phoneOwner', 'idOwner', 'type', 'size', 'name', 'brand', 'condition', 'gender', 'description', 'color', 'urlPhoto', 'city'],
          properties: {
            phoneOwner: {
              bsonType: 'string',
              pattern: '^[0-9]{7,10}$',
              description: 'Owner phone number - required'
            },
            idOwner: {
              bsonType: 'objectId',
              description: 'Owner user ID - required'
            },
            type: {
              bsonType: 'string',
              maxLength: 60,
              description: 'Article type (Camiseta, Pantalón, etc.) - required'
            },
            size: {
              bsonType: 'string',
              maxLength: 10,
              description: 'Size (XS, S, M, L, XL, etc.) - required'
            },
            name: {
              bsonType: 'string',
              maxLength: 60,
              description: 'Article name - required'
            },
            brand: {
              bsonType: 'string',
              maxLength: 60,
              description: 'Brand name - required'
            },
            condition: {
              bsonType: 'string',
              maxLength: 15,
              enum: ['Nuevo', 'Usado - Excelente estado', 'Usado - Buen estado', 'Usado - Regular estado'],
              description: 'Article condition - required'
            },
            gender: {
              bsonType: 'string',
              maxLength: 10,
              enum: ['Hombre', 'Mujer', 'Unisex', 'Niño', 'Niña'],
              description: 'Target gender - required'
            },
            description: {
              bsonType: 'string',
              maxLength: 120,
              description: 'Article description - required'
            },
            color: {
              bsonType: 'string',
              maxLength: 30,
              description: 'Primary color - required'
            },
            date: {
              bsonType: 'string',
              description: 'Publication date string'
            },
            urlPhoto: {
              bsonType: 'string',
              description: 'Main photo URL - required'
            },
            city: {
              bsonType: 'string',
              maxLength: 60,
              description: 'Location city - required'
            },
            createdAt: {
              bsonType: 'date',
              description: 'Creation timestamp'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'Last update timestamp'
            }
          }
        }
      }
    });

    // Create indexes for efficient queries
    await db.collection('articles').createIndex({ phoneOwner: 1 });
    await db.collection('articles').createIndex({ idOwner: 1 });
    await db.collection('articles').createIndex({ type: 1 });
    await db.collection('articles').createIndex({ gender: 1 });
    await db.collection('articles').createIndex({ city: 1 });
    await db.collection('articles').createIndex({ brand: 1 });
    await db.collection('articles').createIndex({ size: 1 });
    await db.collection('articles').createIndex({ createdAt: -1 });
    
    // Compound indexes for common queries
    await db.collection('articles').createIndex({ type: 1, gender: 1, city: 1 });
    await db.collection('articles').createIndex({ phoneOwner: 1, createdAt: -1 });
    
    console.log('  ✅ Articles collection created with indexes');
    
  } catch (error) {
    if (error.code === 48) {
      console.log('  ℹ️  Articles collection already exists');
    } else {
      throw error;
    }
  }
}

/**
 * ❤️ Setup Reactions Collection
 */
async function setupReactionsCollection(db) {
  console.log('❤️ Setting up REACTIONS collection...');
  
  try {
    await db.createCollection('reactions', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['type', 'phoneOwner', 'phoneUser', 'idArticle'],
          properties: {
            type: {
              bsonType: 'string',
              enum: ['Like', 'SuperLike', 'DisLike'],
              description: 'Reaction type - required'
            },
            phoneOwner: {
              bsonType: 'string',
              pattern: '^[0-9]{7,10}$',
              description: 'Article owner phone - required'
            },
            phoneUser: {
              bsonType: 'string',
              pattern: '^[0-9]{7,10}$',
              description: 'User who reacted phone - required'
            },
            idArticle: {
              bsonType: 'objectId',
              description: 'Article ID - required'
            },
            createdAt: {
              bsonType: 'date',
              description: 'Reaction timestamp'
            }
          }
        }
      }
    });

    // Create indexes for efficient reaction queries
    await db.collection('reactions').createIndex({ idArticle: 1 });
    await db.collection('reactions').createIndex({ phoneOwner: 1 });
    await db.collection('reactions').createIndex({ phoneUser: 1 });
    await db.collection('reactions').createIndex({ type: 1 });
    await db.collection('reactions').createIndex({ createdAt: -1 });
    
    // Compound indexes for match detection
    await db.collection('reactions').createIndex({ phoneOwner: 1, phoneUser: 1 });
    await db.collection('reactions').createIndex({ idArticle: 1, type: 1 });
    
    // Unique index to prevent duplicate reactions
    await db.collection('reactions').createIndex(
      { phoneUser: 1, idArticle: 1 }, 
      { unique: true }
    );
    
    console.log('  ✅ Reactions collection created with indexes');
    
  } catch (error) {
    if (error.code === 48) {
      console.log('  ℹ️  Reactions collection already exists');
    } else {
      throw error;
    }
  }
}

/**
 * 💕 Setup Matches Collection
 */
async function setupMatchesCollection(db) {
  console.log('💕 Setting up MATCHES collection...');
  
  try {
    await db.createCollection('matches', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['nameFirst', 'phoneFirst', 'nameSecond', 'phoneSecond'],
          properties: {
            nameFirst: {
              bsonType: 'string',
              maxLength: 120,
              description: 'First user name - required'
            },
            phoneFirst: {
              bsonType: 'string',
              pattern: '^[0-9]{7,10}$',
              description: 'First user phone - required'
            },
            urlPhotoArticleFirst: {
              bsonType: 'string',
              description: 'First user article photo URL'
            },
            nameSecond: {
              bsonType: 'string',
              maxLength: 120,
              description: 'Second user name - required'
            },
            phoneSecond: {
              bsonType: 'string',
              pattern: '^[0-9]{7,10}$',
              description: 'Second user phone - required'
            },
            urlPhotoArticleSecond: {
              bsonType: 'string',
              description: 'Second user article photo URL'
            },
            firstArticleName: {
              bsonType: 'string',
              maxLength: 120,
              description: 'First article name'
            },
            secondArticleName: {
              bsonType: 'string',
              maxLength: 120,
              description: 'Second article name'
            },
            urlChat: {
              bsonType: 'string',
              description: 'Chat URL for communication'
            },
            date: {
              bsonType: 'string',
              description: 'Match creation date'
            },
            createdAt: {
              bsonType: 'date',
              description: 'Match timestamp'
            }
          }
        }
      }
    });

    // Create indexes for match queries
    await db.collection('matches').createIndex({ phoneFirst: 1 });
    await db.collection('matches').createIndex({ phoneSecond: 1 });
    await db.collection('matches').createIndex({ createdAt: -1 });
    
    // Compound index to prevent duplicate matches
    await db.collection('matches').createIndex(
      { phoneFirst: 1, phoneSecond: 1 }, 
      { unique: true }
    );
    
    console.log('  ✅ Matches collection created with indexes');
    
  } catch (error) {
    if (error.code === 48) {
      console.log('  ℹ️  Matches collection already exists');
    } else {
      throw error;
    }
  }
}

/**
 * 🖼️ Setup Images Collection (for future scalability)
 */
async function setupImagesCollection(db) {
  console.log('🖼️ Setting up IMAGES collection...');
  
  try {
    await db.createCollection('images', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['url', 'entityType', 'entityId'],
          properties: {
            url: {
              bsonType: 'string',
              description: 'Image URL - required'
            },
            entityType: {
              bsonType: 'string',
              enum: ['user', 'article'],
              description: 'What this image belongs to - required'
            },
            entityId: {
              bsonType: 'objectId',
              description: 'Entity ID (user or article) - required'
            },
            filename: {
              bsonType: 'string',
              description: 'Original filename'
            },
            size: {
              bsonType: 'int',
              description: 'File size in bytes'
            },
            mimeType: {
              bsonType: 'string',
              description: 'Image MIME type'
            },
            uploadedAt: {
              bsonType: 'date',
              description: 'Upload timestamp'
            }
          }
        }
      }
    });

    // Create indexes
    await db.collection('images').createIndex({ entityType: 1, entityId: 1 });
    await db.collection('images').createIndex({ uploadedAt: -1 });
    
    console.log('  ✅ Images collection created with indexes');
    
  } catch (error) {
    if (error.code === 48) {
      console.log('  ℹ️  Images collection already exists');
    } else {
      throw error;
    }
  }
}

/**
 * 📊 Show Database Summary
 */
async function showDatabaseSummary(db) {
  console.log('\n📊 DATABASE SUMMARY:');
  console.log('==================');
  
  try {
    const collections = await db.listCollections().toArray();
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const stats = await db.collection(collectionName).estimatedDocumentCount();
      const indexes = await db.collection(collectionName).indexes();
      
      console.log(`\n📋 ${collectionName.toUpperCase()}:`);
      console.log(`   Documents: ${stats}`);
      console.log(`   Indexes: ${indexes.length}`);
      
      // Show index names
      const indexNames = indexes.map(idx => idx.name).filter(name => name !== '_id_');
      if (indexNames.length > 0) {
        console.log(`   Custom indexes: ${indexNames.join(', ')}`);
      }
    }
    
    console.log('\n🎯 PERFORMANCE OPTIMIZATIONS:');
    console.log('  ✅ Unique constraints on critical fields');
    console.log('  ✅ Compound indexes for complex queries');
    console.log('  ✅ Schema validation for data integrity');
    console.log('  ✅ Proper indexing for search operations');
    
  } catch (error) {
    console.error('Error showing summary:', error);
  }
}

// Execute if called directly
if (require.main === module) {
  setupDatabaseSchema();
}

module.exports = setupDatabaseSchema; 