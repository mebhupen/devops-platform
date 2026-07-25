
const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorize, ROLES } = require('../middleware/rbac');
const { validate } = require('../middleware/validate');
const { createProjectSchema, updateProjectSchema, idParamSchema } = require('../validations/projectValidation');
const { cacheMiddleware } = require('../middleware/cache');
const ctrl = require('../controllers/projectController');

const router = express.Router();
router.use(authenticate);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: List projects with pagination, search, filter, sort
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *         example: 10
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         example: test
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *         example: active
 *       - in: query
 *         name: sortBy
 *         schema: { type: string }
 *         example: created_at
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string }
 *         example: desc
 *     responses:
 *       200: { description: List }
 */
router.get('/', cacheMiddleware('projects', 30), ctrl.list);
router.get('/:id', validate(idParamSchema, 'params'), ctrl.getOne);
router.post('/', authorize(ROLES.ADMIN, ROLES.DEVOPS, ROLES.DEVELOPER), validate(createProjectSchema), ctrl.create);
router.put('/:id', validate(idParamSchema, 'params'), authorize(ROLES.ADMIN, ROLES.DEVOPS), validate(updateProjectSchema), ctrl.update);
router.delete('/:id', validate(idParamSchema, 'params'), authorize(ROLES.ADMIN), ctrl.remove);
router.post('/:id/restore', validate(idParamSchema, 'params'), authorize(ROLES.ADMIN), ctrl.restore);

module.exports = router;
