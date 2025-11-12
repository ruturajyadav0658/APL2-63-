const jwt = require('jsonwebtoken');

function generateToken(userId) {
  const payload = { id: userId };
  const secret = process.env.JWT_SECRET || 'dev_secret';
  const expiresIn = process.env.JWT_EXPIRES || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = generateToken;


