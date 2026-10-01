const asyncHandler = require('../utils/asyncHandler');
const companyService = require('../services/company.service');

exports.get = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await companyService.get(req.user) });
});
exports.update = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Company updated', data: await companyService.update(req.user, req.body) });
});