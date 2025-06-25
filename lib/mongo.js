const { MongoClient, ObjectId } = require('mongodb');
const { config } = require('../config');

// Connection parameters
const DB_USER = config.dbUser;
const DB_PASSWD = config.dbPassword;
const BD_HOST = config.dbHost;
const BD_NAME = config.dbName;

// Build MongoDB URI based on environment
let MONGO_URI;

if (process.env.NODE_ENV === 'production') {
  // For MongoDB Atlas in production
  MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWD}@${BD_HOST}/${BD_NAME}?retryWrites=true&w=majority`;
} else {
  // For development - check if it's localhost or Atlas
  if (BD_HOST === 'localhost') {
    // Local MongoDB instance
    MONGO_URI = `mongodb://${DB_USER}:${DB_PASSWD}@localhost:27017/${BD_NAME}?authSource=admin`;
  } else {
    // MongoDB Atlas for development
    MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWD}@${BD_HOST}/${BD_NAME}?retryWrites=true&w=majority`;
  }
}

// Log connection details (secure for production)
if (process.env.NODE_ENV !== 'production') {
  console.log('🔌 MongoDB Connection Details:');
  console.log('   Host:', BD_HOST);
  console.log('   Database:', BD_NAME);
  console.log('   User:', DB_USER);
  console.log('   Environment:', process.env.NODE_ENV || 'development');
} else {
  console.log('🔌 Connecting to MongoDB...');
}
/* Clase para realizar la conección con la db y operaciones basicas con esta */
class MongoLib {
  // Se inicializan los parametros base de la db
  constructor() {
    this.client = new MongoClient(MONGO_URI);
    this.dbName = BD_NAME;
  }

  /* Method to establish connection with the database */
  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((err) => {
          if (err) {
            console.error('❌ MongoDB connection error:', err);
            reject(err);
          }

          const database = this.client.db(this.dbName);
          console.log('✅ MongoDB Connection Established!');
          console.log(`📊 Connected to database: "${database.databaseName}"`);
          console.log(`🏠 MongoDB Host: ${BD_HOST}`);
          console.log(`⏰ Connected at: ${new Date().toLocaleString()}`);
          resolve(database);
        });
      });
    }

    return MongoLib.connection;
  }

  /* Metodo que consulta a la db segun la colección y un filtro de no ser necesario filtrar de debe enviar
  el parametro query asi: {} */
  getAll(collection, query) {
    return this.connect().then((db) => {
      return db.collection(collection).find(query).toArray();
    });
  }

  /* Metodo que trae un objeto de la db segun el id y la colección */
  get(collection, id) {
    return this.connect().then((db) => {
     return db.collection(collection).findOne({ _id: new ObjectId(id)});
    });
  }

  /* Metodo que trae un objeto de la bd segun el phone y la coleccion */
  getByPhone(collection, phone){
    return this.connect().then((db) => {
      return db.collection(collection).findOne({ phone:  phone});
    });
  }

  getByCategory(collection, query){
    return this.connect().then((db) => {
      return db.collection(collection).find(query).toArray();
    });
  }

  getArticleByPhoneUser(collection, phoneUser){
    return this.connect().then((db) => {
      const options = {
        projection: { _id: 0, idArticle:1}
      }
      return db.collection(collection).find(
          {phoneUser: phoneUser},
          options
        ).toArray();
    });
  }

  /*Metodo que trae el conteo de  likes por articulo */
  getLikesByArticle(collection, articleId){
    return this.connect().then((db) => {
      return db.collection(collection).find({idArticle : articleId, type: {$regex: 'Like'}}).count();
    })
  }

  /*Metodo que trae el conteo de  likes por articulo */
  getSuperLikesByArticle(collection, articleId){
    return this.connect().then((db) => {
      return db.collection(collection).find({idArticle : articleId, type: {$regex: 'SuperLike'}}).count();
    })
  }

  getDisLikesByArticle(collection, articleId){
    return this.connect().then((db) => {
      return db.collection(collection).find({idArticle : articleId, type: {$regex: 'DisLike'}}).count();
    })
  }

  getReactionsMatch(collection, reaction){
    return this.connect().then((db)=>{
      //return db.collection(collection).find( {phoneOwner: reaction.phoneUser, phoneUser: reaction.phoneOwner}).toArray();
      return db.collection(collection).find( { $and: [ {phoneOwner: reaction.phoneUser, phoneUser: reaction.phoneOwner},
                                                        {type: {$ne: "DisLike"}}
                                                      ]
                                                    }).toArray();
    })
  }

  getMatchesByPhone(collection, phoneFirst){
    return this.connect().then((db)=>{
      return db.collection(collection).find({phoneFirst: phoneFirst}).toArray();
    })
  }
  
  /* Metodo que crea un nuevo objeto en la db segun la colección */
  create(collection, data) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).insertOne(data);
      })
      .then((result) => result.insertedId);
  }

  /* Metodo que actualiza un nuevo objeto en la db segun el id y la colección  */
  update(collection, id, data) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).updateOne({ _id: new ObjectId(id) }, { $set: data });
      })
      .then((result) => result.upsertedId || id);
  }

  /* Metodo que elimina un objeto en la db segun el id y la colección */
  delete(collection, id) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).deleteOne({ _id: new ObjectId(id) });
      })
      .then(() => id);
  }

  deleteMatchByPhone(collection, phoneFirst, phoneSecond){
    return this.connect()
      .then((db) => {
        db.collection(collection).deleteOne({phoneSecond: phoneFirst, phoneFirst: phoneSecond });
        return db.collection(collection).deleteOne({ phoneFirst: phoneFirst, phoneSecond: phoneSecond });
      })
      .then(() => phoneFirst);
  }

  createIndex(collection, index) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).createIndex(index, { unique: true })
      })
  }

  getLimit(collection, limit, query) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).find(query).limit(limit).toArray()
      })
  }
}

module.exports = MongoLib;