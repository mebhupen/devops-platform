
const bcrypt = require('bcryptjs');
const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;

async function hashPassword(pw) { return bcrypt.hash(pw, rounds); }
async function comparePassword(pw, hash) { return bcrypt.compare(pw, hash); }

module.exports = { hashPassword, comparePassword };
