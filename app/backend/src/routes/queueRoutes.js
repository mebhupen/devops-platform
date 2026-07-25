const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { authorize, ROLES } = require('../middleware/rbac');
const ctrl = require('../controllers/queueController');
router.use(authenticate);
router.get('/', authorize(ROLES.ADMIN, ROLES.DEVOPS), ctrl.list);
module.exports = router;
