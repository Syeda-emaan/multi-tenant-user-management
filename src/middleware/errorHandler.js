const AppError = require('../utils/AppError');

module.exports = (err, req, res, next) => {
  let error = err;

  if (err.type === 'entity.parse.failed') error = new AppError('Invalid JSON body', 400);
  else if (err.name === 'CastError') error = new AppError(`Invalid ${err.path}`, 400);
  else if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'value';
    error = new AppError(`${field} is already in use`, 409);
  } else if (err.name === 'ValidationError' && err.errors) {
    error = new AppError('Validation failed', 400, Object.values(err.errors).map((e) => e.message));
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    error = new AppError('Invalid or expired token', 401);
  }

  if (!error.isOperational) console.error(err);

  res.status(error.isOperational ? error.statusCode : 500).json({
    success: false,
    message: error.isOperational ? error.message : 'Internal server error',
    ...(error.details && { errors: error.details }),
    ...(process.env.NODE_ENV === 'development' && !error.isOperational && { stack: err.stack }),
  });
};