/* eslint-disable no-useless-escape */
const joi = require('@hapi/joi')

const mongoIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const articleTypeSchema = joi.string().max(60);
const articledescriptionSchema = joi.string().max(120);
const articleColorSchema = joi.string().max(30);
const articleDateSchema = joi.string().regex(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]$/); // 01-12-2011 19:20 | 01/12/2011 19:20
const articleUrlSchema = joi.string().regex(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/);
const articleDepartmentSchema = joi.string().max(60);
const articleCitySchema = joi.string().trim().max(60);


const articleSchema = joi.object({
  type: articleTypeSchema.required(),
  description: articledescriptionSchema.required(),
  color: articleColorSchema.required(),
  date: articleDateSchema.required(),
  urlPhoto: articleUrlSchema.required(),
  department: articleDepartmentSchema.required(),
  city: articleCitySchema.required(),
});

const updateArticleSchema = joi.object({
  type: articleTypeSchema,
  description: articledescriptionSchema,
  color: articleColorSchema,
  date: articleDateSchema,
  urlPhoto: articleUrlSchema,
  department: articleDepartmentSchema,
  city: articleCitySchema,
});

module.exports = {
  mongoIdSchema,
  articleSchema,
  updateArticleSchema
};