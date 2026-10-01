const AppError = require('../utils/AppError');

module.exports = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true, convert: true });
  if (error) {
    return next(new AppError('Validation failed', 400, error.details.map((d) => d.message.replace(/"/g, ''))));
  }
  req.validated = { ...(req.validated || {}), [source]: value };
  if (source === 'body') req.body = value; // stripUnknown removes any companyId sent by the client
  next();
};