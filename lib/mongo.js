const { MongoClient, ObjectID } = require('mongodb');
const { config } = require('../config');

// Parametros iniciales para conectar con la db
const DB_USER = config.dbUser;
const DB_PASSWD = config.dbPassword;
//const BD_HOST = config.dbHost;
const BD_NAME = config.dbName;

// Url conecci'on db
//const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWD}@${BD_HOST}/${BD_NAME}?retryWrites=true&w=majority`;
const MONGO_URI = `mongodb://${DB_USER}:${DB_PASSWD}@cluster0-shard-00-00.m7wl6.mongodb.net:27017,cluster0-shard-00-01.m7wl6.mongodb.net:27017,cluster0-shard-00-02.m7wl6.mongodb.net:27017/${BD_NAME}?ssl=true&replicaSet=atlas-8uq28c-shard-0&authSource=admin&retryWrites=true&w=majority`
//const MONGO_URI = `mongodb://localhost:27017/secondChance` //--afcarrion base local
/* Clase para realizar la conección con la db y operaciones basicas con esta */
class MongoLib {
  // Se inicializan los parametros base de la db
  constructor() {
    this.client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    this.dbName = BD_NAME;
  }

  /* Metodo para generar la conección con la db */
  connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((err) => {
          if (err) {
            reject(err);
          }

          // eslint-disable-next-line no-console
          console.log('Connected succesfully to mongo');
          resolve(this.client.db(this.dbName));
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
      return db.collection(collection).findOne({ _id: ObjectID(id) });
    });
  }

  /* Metodo que trae un objeto de la bd segun el phone y la coleccion */
  getByPhone(collection, phone){
    return this.connect().then((db) => {
      return db.collection(collection).findOne({ phone:  phone});
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
      return db.collection(collection).find({phoneOwner: reaction.phoneUser, phoneUser: reaction.phoneOwner}).count();
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
        return db.collection(collection).updateOne({ _id: ObjectID(id) }, { $set: data });
      })
      .then((result) => result.upsertedId || id);
  }

  /* Metodo que elimina un objeto en la db segun el id y la colección */
  delete(collection, id) {
    return this.connect()
      .then((db) => {
        return db.collection(collection).deleteOne({ _id: ObjectID(id) });
      })
      .then(() => id);
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