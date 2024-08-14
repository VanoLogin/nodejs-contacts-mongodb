import Joi from 'joi';

const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Username must be a string',
    'string.max': 'Max letters must be 20',
    'string.min': 'Min letters must be 3',
    'any.required': 'Name is required',
  }),
  email: Joi.string()
    .email()
    .required()
    .messages({ 'string.base': 'Email must be a string' }),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .required()
    .messages({ 'string.base': 'PhoneNumber should be a string' }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phoneNumber: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});

export { createContactSchema, updateContactSchema };
