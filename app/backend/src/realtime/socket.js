
const { Server } = require('socket.io');
const { verifyAccessToken } = require('../utils/token');
const { logger } = require('../config/logger');

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: { origin: process.env.CORS_ORIGIN?.split(',') || '*', methods: ['GET','POST'] }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) return next(new Error('Auth required'));
    try {
      const decoded = verifyAccessToken(token);
      socket.user = decoded;
      next();
    } catch (err) { next(new Error('Invalid token')); }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected ${socket.id} user ${socket.user.id}`);
    socket.join(`user:${socket.user.id}`);
    if (socket.user.role) socket.join(`role:${socket.user.role}`);

    socket.on('join:deployment', (deploymentId) => {
      socket.join(`deployment:${deploymentId}`);
    });

    socket.on('disconnect', () => logger.info(`Socket disconnected ${socket.id}`));
  });

  return io;
}

function getIO() { return io; }

module.exports = { initSocket, getIO };
