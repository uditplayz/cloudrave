const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // 1. Get token from header
  const token = req.header('x-auth-token');

  // 2. Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'Access denied. No token provided.' });
  }

  // 3. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Add user from payload to request object
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token.' });
  }
};