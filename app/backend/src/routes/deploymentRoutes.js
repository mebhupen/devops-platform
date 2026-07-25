
const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorize, ROLES } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const { createDeploymentSchema } = require('../validations/deploymentValidation');
const ctrl = require('../controllers/deploymentController');
const router = express.Router();
router.use(authenticate);
router.get('/', ctrl.list);
router.post('/', authorize(ROLES.ADMIN, ROLES.DEVOPS), validate(createDeploymentSchema), ctrl.create);
module.exports = router;
