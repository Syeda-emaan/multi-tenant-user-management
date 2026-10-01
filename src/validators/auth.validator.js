const Joi = require('joi');

const password = Joi.string()
  .pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,64}$/)
  .messages({ 'string.pattern.base': 'Password must be 8-64 characters with at least one letter and one number' });
const email = Joi.string().email().lowercase().trim();
const namePattern = /^[A-Za-z][A-Za-z\s.'-]{1,59}$/;
const name = Joi.string().trim().pattern(namePattern).messages({
  'string.pattern.base': 'Name must contain only letters and be at least 2 characters',
});
const companyNamePattern = /^[A-Za-z0-9][A-Za-z0-9\s&.,'-]{1,99}$/;

exports.registerCompany = Joi.object({
  companyName: Joi.string().trim().pattern(companyNamePattern).required().messages({
    'string.pattern.base': 'Company name looks invalid',
  }),
  companyEmail: email.required(),
  name: name.required(),
  email: email.required(),
  password: password.required(),
});

exports.login = Joi.object({ email: email.required(), password: Joi.string().required() });
exports.password = password;
exports.email = email;
exports.name = name;