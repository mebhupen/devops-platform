
const authService = require('../services/authService');
const ApiResponse = require('../utils/ApiResponse');
const { verifyRefreshToken } = require('../utils/token');
const { sanitizeUser } = require('../utils/sanitizeUser');

async function register(req, res, next) { try { const user = await authService.register(req.body); return ApiResponse.success(res, { message: 'Registered. Verify email', data: user, statusCode: 201 }); } catch(e){ next(e); } }
async function login(req, res, next) { try { const result = await authService.login(req.body.email, req.body.password); return ApiResponse.success(res, { message: 'Login success', data: result }); } catch(e){ next(e); } }
async function refresh(req, res, next) { try { const result = await authService.refresh(req.body.refreshToken); return ApiResponse.success(res, { data: result }); } catch(e){ next(e); } }
async function logout(req, res, next) {
  try {
    let tokenId = null;
    try { const decoded = verifyRefreshToken(req.body.refreshToken); tokenId = decoded.tokenId; } catch {}
    await authService.logout(req.user?.id || req.body.userId, tokenId);
    return ApiResponse.success(res, { message: 'Logged out' });
  } catch(e){ next(e); }
}
async function verifyEmail(req, res, next) { try { const r = await authService.verifyEmail(req.body.token || req.query.token); return ApiResponse.success(res, { message: r.message }); } catch(e){ next(e); } }
async function forgotPassword(req, res, next) { try { const r = await authService.forgotPassword(req.body.email); return ApiResponse.success(res, { message: r.message }); } catch(e){ next(e); } }
async function resetPassword(req, res, next) { try { const r = await authService.resetPassword(req.body.token, req.body.password); return ApiResponse.success(res, { message: r.message }); } catch(e){ next(e); } }
async function changePassword(req, res, next) { try { const r = await authService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword); return ApiResponse.success(res, { message: r.message }); } catch(e){ next(e); } }
async function me(req, res) { return ApiResponse.success(res, { data: sanitizeUser(req.user) }); }

module.exports = { register, login, refresh, logout, verifyEmail, forgotPassword, resetPassword, changePassword, me };
