const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { authorize, ROLES } = require('../middleware/rbac');
const ctrl = require('../controllers/rolesController');
router.use(authenticate);
router.get('/', authorize(ROLES.ADMIN), ctrl.list);
module.exports = router;
