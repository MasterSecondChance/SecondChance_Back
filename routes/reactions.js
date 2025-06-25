const express = require('express');
const passport = require('passport');
const ReactionsServices = require('../services/reactions');
const MatchesServices = require('../services/matches');
const UsersServices = require('../services/users');
const ArticlesServices = require('../services/articles');
const { reactionSchema } = require('../schemas/reactions');
const { asyncHandler, validateRequest, validateObjectId, NotFoundError } = require('../utils/errorHandler');
require("../utils/auth/strategies/jwt");

function reactionsApi(app) {
    
  const router = express.Router();
  app.use('/reactions', router);

  const reactionsService = new ReactionsServices();
  const usersServices = new UsersServices();
  const articlesServices = new ArticlesServices();

  router.get('/',
    passport.authenticate("jwt", {session:false}),
    asyncHandler(async (req, res) => {
      const { tags } = req.query;
      const reactions = await reactionsService.getReactions({ tags });
      res.status(200).json({
        success: true,
        data: reactions,
        message: 'reactions listed successfully',
      });
    })
  );

  router.get('/:reactionId',
    passport.authenticate("jwt", {session:false}),
    validateObjectId('reactionId'),
    asyncHandler(async (req, res) => {
      const { reactionId } = req.params;
      const reaction = await reactionsService.getReaction({ reactionId });
      
      if (!reaction || Object.keys(reaction).length === 0) {
        throw new NotFoundError('Reaction not found');
      }
      
      res.status(200).json({
        success: true,
        data: reaction,
        message: 'reaction retrieved successfully',
      });
    })
  );

  router.post('/', 
              passport.authenticate("jwt", {session:false}),
              async function (req, res, next) {
    const { body: reaction } = req;
    const phone = reaction.phoneOwner;
    const phoneUser = reaction.phoneUser;
    let result = null
    result = reactionSchema.validate(reaction);

    if (result.error) {
      res.status(400).json({
        data: null,
        message: result.error.details[0].message,
      })
    }else{
        try {
          const createReactionId = await reactionsService.createReaction({ reaction });
          let message; 
          let existMatch;
          let dataOwner;
          let dataUser;
          let articleOwner;
          if(!createReactionId) {
            message = 'Duplicated Reaction'
            existMatch = 0; 
          }else{
            if (reaction.type !== "DisLike"){
              var articleId = {};
              articleId = reaction.idArticle;
              articleOwner = await articlesServices.getArticle({articleId});
              existMatch = await reactionsService.getReactionsMatch({reaction});
              dataOwner = await usersServices.getUserExist(phone);
              dataUser = await usersServices.getUserExist(phoneUser);
            }else{
              existMatch = [];
            }
            message = 'Reaction created';
          }
          if(existMatch.length !== 0){
            /**Hay un match */
            res.status(201).json({
              data: createReactionId,
              message,
              match: 1,
              owner: dataOwner,
              user: dataUser,
              articleOwner: articleOwner,
              articleUser: existMatch
            });
          }else{
            res.status(201).json({
              data: createReactionId,
              message,
              match: 0,
            });
          }
          
        } catch (err) {
          next(err);
        }
    }
  });

  router.delete('/:reactionId',
    passport.authenticate("jwt", {session:false}),
    validateObjectId('reactionId'),
    asyncHandler(async (req, res) => {
      const { reactionId } = req.params;
      
      // Verify reaction exists before deleting
      const existingReaction = await reactionsService.getReaction({ reactionId });
      if (!existingReaction || Object.keys(existingReaction).length === 0) {
        throw new NotFoundError('Reaction not found');
      }

      const deleteReactionId = await reactionsService.deleteReaction({ reactionId });
      res.status(200).json({
        success: true,
        data: deleteReactionId,
        message: 'reaction deleted successfully',
      });
    })
  );
}

module.exports = reactionsApi;