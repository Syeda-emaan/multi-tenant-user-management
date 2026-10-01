const router = require('express').Router();
const ctrl = require('../controllers/company.controller');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants/roles');
const v = require('../validators/company.validator');

router.use(protect);
router.get('/', ctrl.get);
router.put('/', authorize(ROLES.ADMIN), validate(v.updateCompany), ctrl.update);

module.exports = router;