
const nodemailer = require('nodemailer');
const { logger } = require('../config/logger');

let transporter;
function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  return transporter;
}

async function sendEmail({ to, subject, html, text }) {
  if (!process.env.EMAIL_HOST) {
    logger.info(`[MOCK EMAIL] To:${to} Subject:${subject}`);
    return { mocked: true };
  }
  const info = await getTransporter().sendMail({
    from: process.env.EMAIL_FROM,
    to, subject, html, text
  });
  logger.info(`Email sent ${info.messageId}`);
  return info;
}

async function sendVerificationEmail(user, token) {
  const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  return sendEmail({
    to: user.email,
    subject: 'Verify your email',
    html: `<p>Hello ${user.name},</p><p>Verify email: <a href="${url}">${url}</a></p>`
  });
}

async function sendPasswordResetEmail(user, token) {
  const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  return sendEmail({
    to: user.email,
    subject: 'Reset password',
    html: `<p>Hello ${user.name},</p><p>Reset: <a href="${url}">${url}</a> - expires in 1 hour</p>`
  });
}

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail };
