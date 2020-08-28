const express = require("express");
const passport = require("passport");
const boom = require("@hapi/boom");
const jwt = require("jsonwebtoken");
const ArticlesServices = require('../services/articles');
const api = express.Router();

const { config } = require("../config");

// Basic strategy
require("../utils/auth/strategies/basic");

api.post("/token", async function(req, res, next) {

  passport.authenticate("basic", async function(error, user) {
    
    const articlesService = new ArticlesServices();
    try {
      if (error || !user) {
        next(boom.unauthorized());
      }

      req.login(user, { session: false }, async function(error) {
        if (error) {
          next(error);
        }
        
        if (!user) {
          return res.status(400).json(
            { 
              "error": "Incorrect credencials"
            }
          );
        }

        //Valdiación si tiene una prenda
        const phoneOwner = user.phone;
        const Articles = await articlesService.getArticles({phoneOwner});
        const numArticles = Articles.length;
        const payload = { sub: user._id, email: user.email };
        const token = jwt.sign(payload, config.authJwtSecret, {
          expiresIn: "30m"
        });

        return res.status(200).json(
          { 
            access_token: token,
            user: user,
            articles: numArticles
          }
        );
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

module.exports = api;