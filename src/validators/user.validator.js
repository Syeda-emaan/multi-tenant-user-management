const Joi = require('joi');
const { ROLE_LIST } = require('../constants/roles');
const { password, email } = require('./auth.validator');

const namePattern = /^[A-Za-z][A-Za-z\s.'-]{1,59}$/;
const phonePattern = /^[+]?[\d\s-()]{7,20}$/;
const deptPattern = /^[A-Za-z][A-Za-z\s&/-]{1,49}$/;

const name = Joi.string().trim().pattern(namePattern).messages({
  'string.pattern.base': 'Name must contain only letters and be at least 2 characters',
});
const phone = Joi.string().trim().pattern(phonePattern).allow('').messages({
  'string.pattern.base': 'Enter a valid phone number',
});
const department = Joi.string().trim().pattern(deptPattern).allow('').messages({
  'string.pattern.base': 'Department must contain only letters',
});

exports.createUser = Joi.object({
  name: name.required(),
  email: email.required(),
  password: password.required(),
  role: Joi.string().valid(...ROLE_LIST).default('employee'),
  phone,
  department,
});

exports.updateUser = Joi.object({
  name,
  email,
  password,
  role: Joi.string().valid(...ROLE_LIST),
  phone,
  department,
  isActive: Joi.boolean(),
}).min(1);

exports.listUsers = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().max(50).allow(''),
  role: Joi.string().valid(...ROLE_LIST),
  isActive: Joi.boolean(),
  sortBy: Joi.string().valid('createdAt', 'name', 'email', 'role').default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});

exports.idParam = Joi.object({ id: Joi.string().hex().length(24).required() });