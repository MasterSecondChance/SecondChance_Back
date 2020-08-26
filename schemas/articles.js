/* eslint-disable no-useless-escape */
const joi = require('@hapi/joi')

const mongoIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const articleTypeSchema = joi.string().max(60);
const articleSizeSchema = joi.string().max(10);
const articleNameSchema = joi.string().max(60);
const articleBrandSchema = joi.string().max(60);
const articleConditionSchema = joi.string().max(15);
const articledescriptionSchema = joi.string().max(120);
const articleColorSchema = joi.string().max(30);
const articleGenderSchema = joi.string().max(10);
//const articleDateSchema = joi.string().regex(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]$/); // 01-12-2011 19:20 | 01/12/2011 19:20
const articleDateSchema = joi.string();
//const articleUrlSchema = joi.string().regex(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/);
const articleUrlSchema = joi.string();
const articleCitySchema = joi.string().trim().max(60);
const articlePhoneOwnerSchema = joi.string().trim().regex(/^[0-9]{7,10}$/);


const articleSchema = joi.object({
  phoneOwner: articlePhoneOwnerSchema.required(),
  idOwner: mongoIdSchema.required(),
  type: articleTypeSchema.required(),
  size: articleSizeSchema.required(),
  name: articleNameSchema.required(),
  brand: articleBrandSchema.required(),
  condition: articleConditionSchema.required(),
  gender: articleGenderSchema.required(),
  description: articledescriptionSchema.required(),
  color: articleColorSchema.required(),
  date: articleDateSchema,
  urlPhoto: articleUrlSchema.required(),
  city: articleCitySchema.required(),
});

const updateArticleSchema = joi.object({
  phoneOwner: articlePhoneOwnerSchema,
  idOwner: mongoIdSchema,
  type: articleTypeSchema,
  size: articleSizeSchema,
  name: articleNameSchema,
  brand: articleBrandSchema,
  condition: articleConditionSchema,
  gender: articleGenderSchema,
  description: articledescriptionSchema,
  color: articleColorSchema,
  date: articleDateSchema,
  urlPhoto: articleUrlSchema,
  city: articleCitySchema,
});

module.exports = {
  mongoIdSchema,
  articleSchema,
  updateArticleSchema
};