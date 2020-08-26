/* eslint-disable no-useless-escape */
const joi = require('@hapi/joi')

const mongoIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const matchUserFirstSchema = joi.string().max(120);
const matchUserSecondSchema = joi.string().max(120);
const matchUrlChatSchema = joi.string().regex(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/);
//const matchDateSchema = joi.string().regex(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]$/); // 01-12-2011 19:20 | 01/12/2011 19:20
const matchDateSchema = joi.string();

const matchSchema = joi.object({
  phoneFirst: matchUserFirstSchema.required(),
  phoneSecond: matchUserSecondSchema.required(),
  urlChat: matchUrlChatSchema.required(),
  date: matchDateSchema,
});

module.exports = {
  mongoIdSchema,
  matchSchema,
};