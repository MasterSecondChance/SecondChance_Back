const express = require('express');
const passport = require('passport');
const MatchesServices = require('../services/matches');
const { matchSchema } = require('../schemas/matches');
const { asyncHandler, validateRequest, validateObjectId, NotFoundError, ConflictError } = require('../utils/errorHandler');
require("../utils/auth/strategies/jwt");

function matchesApi(app) {
    
  const router = express.Router();
  app.use('/matches', router);

  const matchesService = new MatchesServices();

  router.get('/',
    passport.authenticate("jwt", {session:false}),
    asyncHandler(async (req, res) => {
      const { tags } = req.query;
      const matches = await matchesService.getMatches({ tags });
      res.status(200).json({
        success: true,
        data: matches,
        message: 'matches listed successfully',
      });
    })
  );

  router.get('/:matchId',
    passport.authenticate("jwt", {session:false}),
    validateObjectId('matchId'),
    asyncHandler(async (req, res) => {
      const { matchId } = req.params;
      const match = await matchesService.getMatch({ matchId });
      
      if (!match || Object.keys(match).length === 0) {
        throw new NotFoundError('Match not found');
      }
      
      res.status(200).json({
        success: true,
        data: match,
        message: 'match retrieved successfully',
      });
    })
  );

  router.get('/phone/:phoneFirst',
    passport.authenticate("jwt", {session:false}),
    asyncHandler(async (req, res) => {
      const { phoneFirst } = req.params;
      const matches = await matchesService.getMatchesByPhone({ phoneFirst });
      res.status(200).json({
        success: true,
        data: matches,
        message: 'matches by phone retrieved successfully',
      });
    })
  );

  router.post('/', 
              passport.authenticate("jwt", {session:false}),
              async function (req, res, next) {
    const { body: match } = req;
    let result = null;
    var matchOwner = {};
    matchOwner.nameFirst = match.nameSecond;
    matchOwner.phoneFirst = match.phoneSecond;
    matchOwner.urlPhotoArticleFirst = match.urlPhotoArticleSecond;
    matchOwner.firstArticleName = match.secondArticleName;
    matchOwner.nameSecond =  match.nameFirst;
    matchOwner.phoneSecond = match.phoneFirst;
    matchOwner.urlPhotoArticleSecond = match.urlPhotoArticleFirst;
    matchOwner.secondArticleName = match.firstArticleName;
    matchOwner.urlChat = match.urlChat;
    matchOwner.date = match.date;
    result = matchSchema.validate(match);
    if (result.error) {
      res.status(400).json({
        data: null,
        message: result.error.details[0].message,
      })
    }else{
        try {
          const createMatchId = await matchesService.createMatch(match);
          const createMatchOwnerId = await matchesService.createMatch(matchOwner);

          let message = 'Match created'
    
          if(!createMatchId || !createMatchOwnerId) {
            message = 'Duplicated Match'
          }
    
          res.status(201).json({
            data: createMatchId,
            message,
          });
        } catch (err) {
          next(err);
        }
    }
  });

  router.delete('/:phoneFirst/:phoneSecond',
              passport.authenticate("jwt", {session:false}),
              async function (req, res, next) {
    const { phoneFirst, phoneSecond } = req.params;
    try {
      const deleteMatchPhone = await matchesService.deleteMatch({ phoneFirst, phoneSecond });
      res.status(200).json({
        data: deleteMatchPhone,
        message: 'Match deleted',
      });
    } catch (err) {
      next(err);
    }
  });
}

module.exports = matchesApi;