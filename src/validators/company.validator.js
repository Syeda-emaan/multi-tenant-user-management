const Joi = require('joi');
exports.updateCompany = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  email: Joi.string().email().lowercase().trim(),
}).min(1);