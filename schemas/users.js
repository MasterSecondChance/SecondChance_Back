const joi = require('joi')

const mongoIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const userNameSchema = joi.string().max(120);
const userPhoneSchema = joi.string().trim().regex(/^[0-9]{7,10}$/);
// eslint-disable-next-line no-useless-escape
//const userUrlSchema = joi.string().regex(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/);
const userUrlSchema = joi.string();
const userEmailSchema = joi.string().regex(/^[\w\._]{5,30}(\+[\w]{0,10})?@[\w\.\-]{3,}?\.\w{2,5}$/);
const userPasswordSchema = joi.string().regex(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,}$/);


const userSchema = joi.object({
  userName: userNameSchema.required(),
  email: userEmailSchema,
  password: userPasswordSchema.required(),
  phone: userPhoneSchema.required(),
  urlPhoto: userUrlSchema.required(),
  profileId: mongoIdSchema,
});

const updateUserSchema = joi.object({
  userName: userNameSchema,
  email: userEmailSchema,
  password: userPasswordSchema,
  urlPhoto: userUrlSchema,
  phone: userPhoneSchema.required(),
  profileId: mongoIdSchema,
});

module.exports = {
  mongoIdSchema,
  userSchema,
  updateUserSchema,
};