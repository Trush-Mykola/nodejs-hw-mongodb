import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(3),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});
