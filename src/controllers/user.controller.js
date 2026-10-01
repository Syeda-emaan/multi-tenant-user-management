const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/user.service');

exports.create = asyncHandler(async (req, res) => {
  const data = await userService.create(req.user, req.body);
  res.status(201).json({ success: true, message: 'User created', data });
});
exports.list = asyncHandler(async (req, res) => {
  const { data, meta } = await userService.list(req.user, req.validated.query);
  res.json({ success: true, data, meta });
});
exports.getOne = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await userService.getOne(req.user, req.params.id) });
});
exports.update = asyncHandler(async (req, res) => {
  const data = await userService.update(req.user, req.params.id, req.body);
  res.json({ success: true, message: 'User updated', data });
});
exports.remove = asyncHandler(async (req, res) => {
  await userService.remove(req.user, req.params.id);
  res.json({ success: true, message: 'User deleted' });
});