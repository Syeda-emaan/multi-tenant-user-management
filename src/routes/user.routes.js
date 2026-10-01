const router = require('express').Router();
const ctrl = require('../controllers/user.controller');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants/roles');
const v = require('../validators/user.validator');

const staff = authorize(ROLES.ADMIN, ROLES.MANAGER);
router.use(protect);

router.get('/', staff, validate(v.listUsers, 'query'), ctrl.list);
router.post('/', staff, validate(v.createUser), ctrl.create);
router.get('/:id', validate(v.idParam, 'params'), ctrl.getOne);
router.put('/:id', validate(v.idParam, 'params'), validate(v.updateUser), ctrl.update);
router.delete('/:id', staff, validate(v.idParam, 'params'), ctrl.remove);

module.exports = router;