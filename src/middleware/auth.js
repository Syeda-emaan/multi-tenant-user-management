const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) throw new AppError('Authentication required', 401);

  let decoded;
  try {
    decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }

  const user = await User.findOne({ _id: decoded.id, companyId: decoded.companyId, isDeleted: false, isActive: true });
  if (!user) throw new AppError('User no longer exists or is deactivated', 401);

  const companyOk = await Company.exists({ _id: user.companyId, isDeleted: false, isActive: true });
  if (!companyOk) throw new AppError('Company is inactive', 403);

  req.user = user; // role and companyId always come from the DB, never from the request body
  next();
});

exports.authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : next(new AppError('You do not have permission to do this', 403));