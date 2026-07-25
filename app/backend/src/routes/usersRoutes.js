const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { authorize, ROLES } = require('../middleware/rbac');
const ctrl = require('../controllers/usersController');
router.use(authenticate);
router.get('/', authorize(ROLES.ADMIN), ctrl.list);
router.get('/:id', authorize(ROLES.ADMIN), ctrl.getById);
module.exports = router;
