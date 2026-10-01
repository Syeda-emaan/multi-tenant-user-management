const companyRepo = require('../repositories/company.repository');
const userRepo = require('../repositories/user.repository');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/jwt');
const { ROLES } = require('../constants/roles');

exports.registerCompany = async ({ companyName, companyEmail, name, email, password }) => {
  const company = await companyRepo.create({ name: companyName, email: companyEmail });
  let user;
  try {
    user = await userRepo.create({ companyId: company._id, name, email, password, role: ROLES.ADMIN });
  } catch (err) {
    await companyRepo.hardDelete(company._id); // roll back so no orphan company is left
    throw err;
  }
  return { token: signToken(user), user, company };
};

exports.login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user || !(await user.comparePassword(password))) throw new AppError('Invalid email or password', 401);
  if (!user.isActive) throw new AppError('Your account is deactivated', 403);
  const company = await companyRepo.findById(user.companyId);
  if (!company || !company.isActive) throw new AppError('Your company is inactive', 403);
  return { token: signToken(user), user, company };
};

exports.me = async (user) => ({ user, company: await companyRepo.findById(user.companyId) });