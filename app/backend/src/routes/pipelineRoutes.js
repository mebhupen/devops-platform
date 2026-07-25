const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const { authorize, ROLES } = require('../middleware/rbac');
const ctrl = require('../controllers/pipelineController');
router.use(authenticate);
router.get('/', ctrl.list);
router.post('/', authorize(ROLES.ADMIN, ROLES.DEVOPS, ROLES.DEVELOPER), ctrl.create);
module.exports = router;
