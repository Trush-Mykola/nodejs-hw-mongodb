import Joi from 'joi';

export const resetUserPasswordSchema = Joi.object({
  email: Joi.string().required().email(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required().min(3),
  token: Joi.string().required(),
});
