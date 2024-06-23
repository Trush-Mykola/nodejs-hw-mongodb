import Joi from 'joi';

export const resetUserPasswordSchema = Joi.object({
  email: Joi.string().required().email(),
});
