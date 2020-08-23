const MongoLib = require('../lib/mongo');


const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require( 'path' );
const s3 = new aws.S3();
const { config } = require('./../config/index');

const collection = 'Images'
const mongoDB = new MongoLib();

aws.config.update({
  secretAccessKey: config.secretAccessKey,
  accessKeyId: config.accessKeyId,
  Bucket: 'trode-s3'
});

const upload = multer({
  storage: multerS3({
    acl: "public-read",
    s3,
    ContentType: "mimetype",
    bucket:'trode-s3',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING_METADATA"  });
    },
    key: function (req, file, cb) {
        cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
    },
  }),
});

async function createImage(imagePath) {
    const createImageId = await mongoDB.create(collection, imagePath);
    return createImageId;
} 

async function getImages(){
    const images = await mongoDB.getAll(collection);
    return images || [];
}

async function getImage({ imageId }) {
    const user = await mongoDB.get(collection, imageId);
    return user || {};
  }

module.exports ={ 
    upload, 
    createImage, 
    getImages,
    getImage
};