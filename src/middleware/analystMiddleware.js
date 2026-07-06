const analystMiddleware = (req, res, next) => {
  const allowedRoles = ['ANALYST', 'ADMIN'];
  if (!allowedRoles.includes(req.user?.role)) {
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Analyst privileges required'
    });
  }
  next();
};

module.exports = analystMiddleware;
