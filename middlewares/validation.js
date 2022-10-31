const { celebrate, Joi } = require('celebrate');
const { urlPattern, emailPattern } = require('../utils/patterns');

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().regex(emailPattern),
    password: Joi.string().required(),
    avatar: Joi.string().regex(urlPattern),
  }),
});

const validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().regex(emailPattern),
    password: Joi.string().required(),
  }),
});

module.exports = { validateUserBody, validateAuth };
