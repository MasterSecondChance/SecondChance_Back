const express = require('express');

const { upload } = require("../services/images");
const singleUpload = upload.single("image");
const passport = require('passport');
require("../utils/auth/strategies/jwt");
const ImageService = require("../services/images");

require("../utils/auth/strategies/jwt");

function imagesApi(app) {

    const router = express.Router();
    app.use('/api/images', router);

     router.get("/", async function(req, res, next){
         try {
             const images = await ImageService.getImages();
            res.status(200).json({
                data: images,
                message: 'Images listed',
            });
            } catch (err) {
            next(err);
        }
    });

    router.get("/:imageId", async function(req, res, next){
        const { imageId } = req.params;
        try {
          const image = await ImageService.getImage({ imageId });
          res.status(200).json({
            data: image,
            message: 'image retrieved',
          });
        } catch (err) {
          next(err);
        }
    });

    router.post("/", passport.authenticate("jwt", {session:false}), function (req, res, next) {
        try {
            singleUpload(req, res, async function (err) {
                if (err) {
                  return res.json({
                    success: false,
                    errors: {
                      title: "Image Upload Error",
                      detail: err.message,
                      error: err,
                    },
                  });
                }
                let imagePath = { profilePicture: req.file.location };
                const createImageId = await ImageService.createImage( imagePath );
                res.status(201).json({
                    data: createImageId,
                    path: imagePath,
                    message: 'image created',
                });
              });
        } catch (error) {
            next(error)
        }
    });
 
}

module.exports = imagesApi;