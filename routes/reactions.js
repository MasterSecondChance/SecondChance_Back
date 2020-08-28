const express = require('express');
const passport = require('passport');
const ReactionsServices = require('../services/reactions');
const MatchesServices = require('../services/matches');
const UsersServices = require('../services/users');
const ArticlesServices = require('../services/articles');
const { reactionSchema } = require('../schemas/reactions');
require("../utils/auth/strategies/jwt");

function reactionsApi(app) {
    
  const router = express.Router();
  app.use('/api/reactions', router);

  const reactionsService = new ReactionsServices();
  const usersServices = new UsersServices();
  const articlesServices = new ArticlesServices();

  router.get('/',
             // passport.authenticate("jwt", {session:false}),
              async function (req, res, next) {
    const { tags } = req.query;
    try {
      const reactions = await reactionsService.getReactions({ tags });
      res.status(200).json({
        data: reactions,
        message: 'reaction listed',
      });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:reactionId', async function (req, res, next) {
    const { reactionId } = req.params;
    try {
      const reaction = await reactionsService.getReaction({ reactionId });
      res.status(200).json({
        data: reaction,
        message: 'reaction retrieved',
      });
    } catch (err) {
      next(err);
    }
  });

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
              //passport.authenticate("jwt", {session:false}),
              async function (req, res, next) {
    const { reactionId } = req.params;
    try {
      const deleteReactionId = await reactionsService.deleteReaction({ reactionId });
      res.status(200).json({
        data: deleteReactionId,
        message: 'Reaction deleted',
      });
    } catch (err) {
      next(err);
    }
  });
}

module.exports = reactionsApi;