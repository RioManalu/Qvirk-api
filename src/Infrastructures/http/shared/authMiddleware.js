const AuthenticationError = require('../../../Commons/Exeptions/AuthenticationError');

function getBearerToken(req, res, next) {
  const authHeader = req.get('authorization');
  // cek keadaan dan format
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if(!token) {
    const error = new AuthenticationError('Access denied. No token provided.');
    return next(error);
  }
  req.token = token;
  next();
}

module.exports = getBearerToken;