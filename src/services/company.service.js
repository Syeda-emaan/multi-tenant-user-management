const companyRepo = require('../repositories/company.repository');
const AppError = require('../utils/AppError');

exports.get = async (actor) => {
  const company = await companyRepo.findById(actor.companyId);
  if (!company) throw new AppError('Company not found', 404);
  return company;
};

exports.update = async (actor, data) => {
  const company = await exports.get(actor);
  Object.assign(company, data);
  await company.save();
  return company;
};