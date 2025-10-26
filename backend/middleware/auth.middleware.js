const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Check for token in Authorization header (Bearer token) or x-auth-token
  let token = req.header('Authorization');
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7); // Remove 'Bearer ' prefix
  } else {
    token = req.header('x-auth-token');
  }

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
