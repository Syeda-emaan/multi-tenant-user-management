const Company = require('../models/Company');

exports.create = (data) => Company.create(data);
exports.findById = (id) => Company.findOne({ _id: id, isDeleted: false });
exports.hardDelete = (id) => Company.deleteOne({ _id: id });