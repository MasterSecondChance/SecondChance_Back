const express = require('express');
const passport = require('passport');
const ArticlesServices = require('../services/articles');
const ReactionsServices = require('../services/reactions');
const { articleSchema, updateArticleSchema } = require('../schemas/articles');
const { asyncHandler, validateRequest, validateObjectId, NotFoundError, ConflictError } = require('../utils/errorHandler');
const moment = require('moment');

require("../utils/auth/strategies/jwt");

function articlesApi(app) {
    
  const router = express.Router();
  app.use('/articles', router);

  const articlesService = new ArticlesServices();
  const reactionServices = new ReactionsServices();

  router.get('/',
    passport.authenticate("jwt", {session:false}),
    asyncHandler(async (req, res) => {
      const { phoneOwner } = req.query;
      const articles = await articlesService.getArticles({ phoneOwner });
      res.status(200).json({
        success: true,
        data: articles,
        message: 'articles listed successfully',
      });
    })
  );

  router.get('/categories/:category/:phoneUser',
    passport.authenticate("jwt", {session:false}),
    asyncHandler(async (req, res) => {
      const { category, phoneUser} = req.params;
      const idArticles = await reactionServices.getReactionsByPhoneUser({phoneUser});
      const articles = await articlesService.getArticlesByCategory({ category }, idArticles, phoneUser);
      res.status(200).json({
        success: true,
        data: articles,
        message: 'articles by category listed successfully',
      });
    })
  );

  router.get('/:articleId',
    validateObjectId('articleId'),
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      
      const [article, superLikes, likes, disLikes] = await Promise.all([
        articlesService.getArticle({ articleId }),
        reactionServices.getSuperLikesByArticle({ articleId }),
        reactionServices.getLikesByArticle({ articleId }),
        reactionServices.getDisLikesByArticle({ articleId })
      ]);

      if (!article || Object.keys(article).length === 0) {
        throw new NotFoundError('Article not found');
      }

      res.status(200).json({
        success: true,
        data: article,
        reactions: {
          likes: likes,
          superLikes: superLikes,
          dislikes: disLikes
        },
        message: 'article retrieved successfully',
      });
    })
  );

  /**Articles by ID without reaction */
  router.get('/unreaction/:phoneUser', 
    passport.authenticate("jwt", {session:false}),
    asyncHandler(async (req, res) => {
      const { phoneUser } = req.params;
      const idArticles = await reactionServices.getReactionsByPhoneUser({phoneUser});
      const articles = await articlesService.getArticleswithReaction(idArticles, phoneUser);
      res.status(200).json({
        success: true,
        data: articles,
        message: 'articles without reaction retrieved successfully',
      });
    })
  );

  router.post('/', 
    passport.authenticate("jwt", {session:false}),
    validateRequest(articleSchema),
    asyncHandler(async (req, res) => {
      const { body: article } = req;
      
      // Add timestamp
      const now = moment();
      article.date = now.format('MM/DD/YYYY HH:mm:ss A');

      const createArticleId = await articlesService.createArticle({ article });
      if (!createArticleId) {
        throw new ConflictError('Failed to create article');
      }

      res.status(201).json({
        success: true,
        data: createArticleId,
        message: 'article created successfully',
      });
    })
  );

  router.put('/:articleId',
    passport.authenticate("jwt", {session:false}),
    validateObjectId('articleId'),
    validateRequest(updateArticleSchema),
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      const { body: article } = req;

      // Verify article exists before updating
      const existingArticle = await articlesService.getArticle({ articleId });
      if (!existingArticle || Object.keys(existingArticle).length === 0) {
        throw new NotFoundError('Article not found');
      }

      const updateArticleId = await articlesService.updateArticle({ articleId, article });
      res.status(200).json({
        success: true,
        data: updateArticleId,
        message: 'article updated successfully',
      });
    })
  );

  router.delete('/:articleId',
    passport.authenticate("jwt", {session:false}),
    validateObjectId('articleId'),
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      
      // Verify article exists before deleting
      const existingArticle = await articlesService.getArticle({ articleId });
      if (!existingArticle || Object.keys(existingArticle).length === 0) {
        throw new NotFoundError('Article not found');
      }

      const deleteArticleId = await articlesService.deleteArticle({ articleId });
      res.status(200).json({
        success: true,
        data: deleteArticleId,
        message: 'article deleted successfully',
      });
    })
  );
}

module.exports = articlesApi;