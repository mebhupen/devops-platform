
const express = require('express');
const ctrl = require('../controllers/healthController');
const router = express.Router();
router.get('/', ctrl.health);
router.get('/ready', ctrl.readiness);
router.get('/live', ctrl.liveness);
router.get('/health', ctrl.health);
module.exports = router;
