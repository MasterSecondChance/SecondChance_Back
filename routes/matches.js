const express = require('express');
const passport = require('passport');
const MatchesServices = require('../services/matches');
const { matchSchema } = require('../schemas/matches');
require("../utils/auth/strategies/jwt");

function matchesApi(app) {
    
  const router = express.Router();
  app.use('/api/matches', router);

  const matchesService = new MatchesServices();

  router.get('/',
             // passport.authenticate("jwt", {session:false}),
              async function (req, res, next) {
    const { tags } = req.query;
    try {
      const matches = await matchesService.getMatches({ tags });
      res.status(200).json({
        data: matches,
        message: 'Matches listed',
      });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:matchId', async function (req, res, next) {
    const { matchId } = req.params;
    try {
      const match = await matchesService.getMatch({ matchId });
      res.status(200).json({
        data: match,
        message: 'Match retrieved',
      });
    } catch (err) {
      next(err);
    }
  });

  router.get('/phone/:phoneFirst', async function (req, res, next) {
    const { phoneFirst } = req.params;
    try {
      const matches = await matchesService.getMatchesByPhone({ phoneFirst });
      res.status(200).json({
        data: matches,
        message: 'Match retrieved',
      });
    } catch (err) {
      next(err);
    }
  });

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