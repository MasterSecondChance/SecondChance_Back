/* eslint-disable no-useless-escape */
const joi = require('joi')

const mongoIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const reactionTypeSchema = joi.string().max(60);
const reactionPhoneSchema = joi.string().trim().regex(/^[0-9]{7,10}$/).required();

const reactionSchema = joi.object({
  type: reactionTypeSchema.required(),
  phoneOwner: reactionPhoneSchema.required(),
  phoneUser: reactionPhoneSchema.required(),
  idArticle: mongoIdSchema.required(),
});


module.exports = {
  mongoIdSchema,
  reactionSchema
};