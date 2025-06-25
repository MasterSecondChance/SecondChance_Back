const express = require('express');
const passport = require('passport');
const UsersService = require('../services/users');
const { userSchema, updateUserSchema } = require('../schemas/users');
const { asyncHandler, validateRequest, validateObjectId, NotFoundError, ConflictError } = require('../utils/errorHandler');
require("../utils/auth/strategies/jwt");

function usersApi(app) {
  const router = express.Router();
  app.use('/users', router);

  const usersService = new UsersService();

  router.get('/',
    passport.authenticate("jwt", {session:false}),
    asyncHandler(async (req, res) => {
      const { phone } = req.query;
      const users = await usersService.getUsers({ phone });
      res.status(200).json({
        success: true,
        data: users,
        message: 'users listed successfully',
      });
    })
  );

  router.get('/:userId',
    passport.authenticate("jwt", {session:false}),
    validateObjectId('userId'),
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const user = await usersService.getUser({ userId });
      
      if (!user || Object.keys(user).length === 0) {
        throw new NotFoundError('User not found');
      }
      
      res.status(200).json({
        success: true,
        data: user,
        message: 'user retrieved successfully',
      });
    })
  );

  router.post('/',
    validateRequest(userSchema),
    asyncHandler(async (req, res) => {
      const { body: user } = req;
      const { phone } = user;

      // Check if user already exists
      const existUser = await usersService.getUserExist(phone);
      if (existUser && existUser !== '') {
        throw new ConflictError('User with this phone number already exists');
      }

      const createUserId = await usersService.createUser({ user });
      if (!createUserId) {
        throw new ConflictError('Failed to create user - phone number may already exist');
      }

      res.status(201).json({
        success: true,
        data: createUserId,
        phone: user.phone,
        message: 'user created successfully',
      });
    })
  );

  router.put('/:userId',
    passport.authenticate("jwt", {session:false}),
    validateObjectId('userId'),
    validateRequest(updateUserSchema),
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const { body: user } = req;

      // Verify user exists before updating
      const existingUser = await usersService.getUser({ userId });
      if (!existingUser || Object.keys(existingUser).length === 0) {
        throw new NotFoundError('User not found');
      }

      const updateUserId = await usersService.updateUser({ userId, user });
      res.status(200).json({
        success: true,
        data: updateUserId,
        message: 'user updated successfully',
      });
    })
  );

  router.delete('/:userId',
    passport.authenticate("jwt", {session:false}),
    validateObjectId('userId'),
    asyncHandler(async (req, res) => {
      const { userId } = req.params;
      
      // Verify user exists before deleting
      const existingUser = await usersService.getUser({ userId });
      if (!existingUser || Object.keys(existingUser).length === 0) {
        throw new NotFoundError('User not found');
      }

      const deleteUserId = await usersService.deleteUser({ userId });
      res.status(200).json({
        success: true,
        data: deleteUserId,
        message: 'user deleted successfully',
      });
    })
  );
}

module.exports = usersApi;