import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().min(5).max(50).required(),
  password: Joi.string().min(6).max(50).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().min(5).max(50).required(),
  password: Joi.string().min(6).max(50).required(),
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});


export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().min(5).max(50).required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).max(50).required(),
});

