
const express = require('express');
const { validate } = require('../middleware/validate');
const { registerSchema, loginSchema, refreshSchema, forgotSchema, resetSchema, changePasswordSchema } = require('../validations/authValidation');
const { authenticate } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimiter');
const ctrl = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email,password,name]
 *             properties:
 *               email: { type: string, example: user@example.com }
 *               password: { type: string, example: Password123! }
 *               name: { type: string, example: Bhupendra }
 *               role: { type: string, example: Developer }
 *     responses:
 *       201: { description: Created }
 *       409: { description: Email exists }
 */
router.post('/register', authRateLimiter, validate(registerSchema), ctrl.register);
router.post('/login', authRateLimiter, validate(loginSchema), ctrl.login);
router.post('/refresh', validate(refreshSchema), ctrl.refresh);
router.post('/logout', authenticate, ctrl.logout);
router.post('/verify-email', ctrl.verifyEmail);
router.get('/verify-email', ctrl.verifyEmail);
router.post('/forgot-password', authRateLimiter, validate(forgotSchema), ctrl.forgotPassword);
router.post('/reset-password', validate(resetSchema), ctrl.resetPassword);
router.post('/change-password', authenticate, validate(changePasswordSchema), ctrl.changePassword);
router.get('/me', authenticate, ctrl.me);

module.exports = router;
