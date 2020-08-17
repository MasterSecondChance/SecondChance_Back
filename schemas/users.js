const joi = require('@hapi/joi')

const mongoIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/)
const userNameSchema = joi.string().max(120)
// eslint-disable-next-line no-useless-escape
const userEmailSchema = joi.string().regex(/^[\w\._]{5,30}(\+[\w]{0,10})?@[\w\.\-]{3,}?\.\w{2,5}$/)
const userPasswordSchema = joi.string().regex(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/)


const userSchema = joi.object({
  firstName: userNameSchema.required(),
  lastName: userNameSchema.required(),
  email: userEmailSchema.required(),
  password: userPasswordSchema.required(),
  profileId: mongoIdSchema,
});

const updateUserSchema = joi.object({
  firstName: userNameSchema.required(),
  lastName: userNameSchema.required(),
  email: userEmailSchema.required(),
  profileId: mongoIdSchema,
});

module.exports = {
  mongoIdSchema,
  userSchema,
  updateUserSchema,
};