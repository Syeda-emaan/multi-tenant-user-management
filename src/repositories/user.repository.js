const User = require('../models/User');
const { escapeRegex } = require('../utils/pagination');

exports.create = (data) => User.create(data);

exports.findByEmail = (email) => User.findOne({ email: email.toLowerCase(), isDeleted: false }).select('+password');

// companyId is ALWAYS the first argument, which is what enforces tenant isolation
exports.findById = (companyId, id) => User.findOne({ _id: id, companyId, isDeleted: false });

exports.list = async (companyId, { page, limit, search, role, isActive, sortBy, order }) => {
  const filter = { companyId, isDeleted: false };
  if (role) filter.role = role;
  if (typeof isActive === 'boolean') filter.isActive = isActive;
  if (search) {
    const rx = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { department: rx }];
  }
  const [data, total] = await Promise.all([
    User.find(filter)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-__v')
      .lean(),
    User.countDocuments(filter),
  ]);
  return { data, total };
};