
const { verifyAccessToken } = require('../utils/token');
const AppError = require('../utils/AppError');
const userRepository = require('../repositories/userRepository');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new AppError('Authentication required', 401);
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await userRepository.findById(decoded.id);
    if (!user) throw new AppError('User not found', 401);
    if (user.deleted_at) throw new AppError('Account deleted', 401);
    if (!user.is_email_verified) throw new AppError('Email not verified', 403);
    if (user.is_locked && new Date(user.locked_until) > new Date()) throw new AppError('Account locked. Try later', 423);
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired token', 401));
    }
    next(err);
  }
}

module.exports = { authenticate };
