
const express = require('express');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { idParamSchema } = require('../validations/notificationValidation');
const ctrl = require('../controllers/notificationController');
const router = express.Router();
router.use(authenticate);
router.get('/', ctrl.list);
router.patch('/:id/read', validate(idParamSchema, 'params'), ctrl.markRead);
module.exports = router;
