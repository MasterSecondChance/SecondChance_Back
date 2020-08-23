/* eslint-disable no-useless-escape */
const joi = require('@hapi/joi')

const mongoIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const reactionTypeSchema = joi.string().max(60);


const reactionSchema = joi.object({
  type: reactionTypeSchema.required(),
  idUser: mongoIdSchema.required(),
  idArticle: mongoIdSchema.required(),
});


module.exports = {
  mongoIdSchema,
  reactionSchema
};