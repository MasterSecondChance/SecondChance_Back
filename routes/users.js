const express = require('express');
const passport = require('passport');
const UsersService = require('../services/users');
const { userSchema, updateUserSchema } = require('../schemas/users');
require("../utils/auth/strategies/jwt");

function usersApi(app) {
  const router = express.Router();
  app.use('/api/users', router);

  const usersService = new UsersService();

  router.get('/',
              passport.authenticate("jwt", {session:false}),
              async function (req, res, next) {
    const { tags } = req.query;
    try {
      const users = await usersService.getUsers({ tags });
      res.status(200).json({
        data: users,
        message: 'users listed',
      });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:userId', async function (req, res, next) {
    const { userId } = req.params;
    try {
      const user = await usersService.getUser({ userId });
      res.status(200).json({
        data: user,
        message: 'user retrieved',
      });
    } catch (err) {
      next(err);
    }
  });

  router.post('/', async function (req, res, next) {
    const { body: user } = req;
    const phone = user.phone;
    let result = null

    const existUser = await usersService.getUserExist({phone});

    result = userSchema.validate(user)
    if (result.error || existUser !== {} ) {
      if(result.error){
        res.status(400).json({
          data: null,
          message: result.error.details[0].message,
        });
      }else{
        res.status(401).json({
          data: null,
          message: 'User Exists',
        });
      }
    }else{
        try {
          const createUserId = await usersService.createUser({ user });
          let message = 'user created'
    
          if(!createUserId) {
            message = 'Duplicated User'
          }
    
          res.status(201).json({
            data: createUserId,
            message,
          });
        } catch (err) {
          next(err);
        }
    }
  });

  router.put('/:userId',
              //passport.authenticate("jwt", {session:false}),
              async function (req, res, next) {
    const { userId } = req.params;
    const { body: user } = req;
    let result = null

    result = updateUserSchema.validate(user)
    
    if (result.error) {
      res.status(400).json({
        data: null,
        message: result.error.details[0].message,
      })
    }

    try {
      const updateUserId = await usersService.updateUser({ userId, user });
      res.status(200).json({
        data: updateUserId,
        message: 'users updated',
      });
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:userId',
              passport.authenticate("jwt", {session:false}),
              async function (req, res, next) {
    const { userId } = req.params;
    try {
      const deleteUserId = await usersService.deleteUser({ userId });
      res.status(200).json({
        data: deleteUserId,
        message: 'users deleted',
      });
    } catch (err) {
      next(err);
    }
  });
}

module.exports = usersApi;