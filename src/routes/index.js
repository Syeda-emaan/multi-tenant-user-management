const router = require('express').Router();
router.get('/health', (req, res) => res.json({ success: true, message: 'API is running' }));
router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/company', require('./company.routes'));
module.exports = router;