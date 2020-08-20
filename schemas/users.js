const joi = require('@hapi/joi')

const mongoIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const userNameSchema = joi.string().max(120);
const userPhoneSchema = joi.string().trim().regex(/^[0-9]{7,10}$/).required()
// eslint-disable-next-line no-useless-escape
const userEmailSchema = joi.string().regex(/^[\w\._]{5,30}(\+[\w]{0,10})?@[\w\.\-]{3,}?\.\w{2,5}$/);
const userPasswordSchema = joi.string().regex(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/);


const userSchema = joi.object({
  userName: userNameSchema.required(),
  firstName: userNameSchema.required(),
  email: userEmailSchema.required(),
  password: userPasswordSchema.required(),
  phone: userPhoneSchema.required(),
  profileId: mongoIdSchema,
});

const updateUserSchema = joi.object({
  userName: userNameSchema,
  firstName: userNameSchema,
  email: userEmailSchema,
  password: userPasswordSchema,
  phone: userPhoneSchema.required(),
  profileId: mongoIdSchema,
});

module.exports = {
  mongoIdSchema,
  userSchema,
  updateUserSchema,
};