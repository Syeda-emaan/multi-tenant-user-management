const userRepo = require('../repositories/user.repository');
const AppError = require('../utils/AppError');
const { ROLES } = require('../constants/roles');
const { buildMeta } = require('../utils/pagination');

const SELF_FIELDS = ['name', 'phone', 'password'];
const MANAGER_ON_EMPLOYEE = ['name', 'email', 'phone', 'department', 'isActive', 'password'];
const ADMIN_ON_SELF = ['name', 'email', 'phone', 'department', 'password']; // cannot demote or deactivate self
const ADMIN_ON_OTHERS = [...MANAGER_ON_EMPLOYEE, 'role'];

const getTarget = async (actor, id) => {
  const target = await userRepo.findById(actor.companyId, id);
  if (!target) throw new AppError('User not found', 404); // 404 for other tenants' ids too
  return target;
};

exports.create = async (actor, data) => {
  if (actor.role === ROLES.MANAGER && data.role !== ROLES.EMPLOYEE) {
    throw new AppError('Managers can only create employees', 403);
  }
  return userRepo.create({ ...data, companyId: actor.companyId, createdBy: actor._id });
};

exports.list = async (actor, query) => {
  const { data, total } = await userRepo.list(actor.companyId, query);
  return { data, meta: buildMeta(total, query.page, query.limit) };
};

exports.getOne = async (actor, id) => {
  if (actor.role === ROLES.EMPLOYEE && !actor._id.equals(id)) {
    throw new AppError('You can only view your own profile', 403);
  }
  return getTarget(actor, id);
};

exports.update = async (actor, id, data) => {
  const target = await getTarget(actor, id);
  const isSelf = actor._id.equals(target._id);

  let allowed;
  if (isSelf) allowed = actor.role === ROLES.ADMIN ? ADMIN_ON_SELF : SELF_FIELDS;
  else if (actor.role === ROLES.ADMIN) allowed = ADMIN_ON_OTHERS;
  else if (actor.role === ROLES.MANAGER && target.role === ROLES.EMPLOYEE) allowed = MANAGER_ON_EMPLOYEE;
  else throw new AppError('You do not have permission to edit this user', 403);

  const forbidden = Object.keys(data).filter((k) => !allowed.includes(k));
  if (forbidden.length) throw new AppError(`You cannot modify: ${forbidden.join(', ')}`, 403);

  Object.assign(target, data);
  await target.save(); // save() so the bcrypt hook runs
  return target;
};

exports.remove = async (actor, id) => {
  if (actor._id.equals(id)) throw new AppError('You cannot delete your own account', 400);
  const target = await getTarget(actor, id);
  if (actor.role === ROLES.MANAGER && target.role !== ROLES.EMPLOYEE) {
    throw new AppError('Managers can only delete employees', 403);
  }
  Object.assign(target, { isDeleted: true, isActive: false, deletedAt: new Date(), deletedBy: actor._id });
  await target.save();
};