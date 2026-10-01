const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

exports.registerCompany = asyncHandler(async (req, res) => {
  const data = await authService.registerCompany(req.body);
  res.status(201).json({ success: true, message: 'Company registered', data });
});
exports.login = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Login successful', data: await authService.login(req.body) });
});
exports.me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await authService.me(req.user) });
});