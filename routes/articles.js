const express = require('express');
const passport = require('passport');
const ArticlesServices = require('../services/articles');
const ReactionsServices = require('../services/reactions');
const { articleSchema, updateArticleSchema } = require('../schemas/articles');
require("../utils/auth/strategies/jwt");

function articlesApi(app) {
    
  const router = express.Router();
  app.use('/api/articles', router);

  const articlesService = new ArticlesServices();
  const reactionServices = new ReactionsServices();

  router.get('/',
             // passport.authenticate("jwt", {session:false}),
              async function (req, res, next) {
    const { tags } = req.query;
    try {
      const articles = await articlesService.getArticles({ tags });
      res.status(200).json({
        data: articles,
        message: 'articles listed',
      });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:articleId', async function (req, res, next) {
    const { articleId } = req.params;
    try {
      const superLikes = await reactionServices.getSuperLikesByArticle({articleId});
      const likes = await reactionServices.getLikesByArticle({articleId});
      const disLikes = await reactionServices.getDisLikesByArticle({articleId});
      const article = await articlesService.getArticle({ articleId });
      res.status(200).json({
        data: article,
        like: likes,
        superLikes: superLikes,
        dislikes: disLikes,
        message: 'article retrieved',
      });
    } catch (err) {
      next(err);
    }
  });

  router.post('/', 
              //passport.authenticate("jwt", {session:false}),
              async function (req, res, next) {
    const { body: article } = req;
    let result = null
    result = articleSchema.validate(article)

    if (result.error) {
      res.status(400).json({
        data: null,
        message: result.error.details[0].message,
      })
    }else{
        try {
          const createArticleId = await articlesService.createArticle({ article });
          let message = 'Article created'
    
          if(!createArticleId) {
            message = 'Duplicated Article'
          }
    
          res.status(201).json({
            data: createArticleId,
            message,
          });
        } catch (err) {
          next(err);
        }
    }
  });

  router.put('/:articleId',
              //passport.authenticate("jwt", {session:false}),
              async function (req, res, next) {
    const { articleId } = req.params;
    const { body: article } = req;
    let result = null

    result = updateArticleSchema.validate(article);
    
    if (result.error) {
      res.status(400).json({
        data: null,
        message: result.error.details[0].message,
      })
    }else{
      try {
        const updateArticleId = await articlesService.updateArticle({ articleId, article });
        res.status(200).json({
          data: updateArticleId,
          message: 'Article updated',
        });
      } catch (err) {
        next(err);
      }
    }

  });

  router.delete('/:articleId',
              passport.authenticate("jwt", {session:false}),
              async function (req, res, next) {
    const { articleId } = req.params;
    try {
      const deleteArticleId = await articlesService.deleteArticle({ articleId });
      res.status(200).json({
        data: deleteArticleId,
        message: 'Article deleted',
      });
    } catch (err) {
      next(err);
    }
  });
}

module.exports = articlesApi;