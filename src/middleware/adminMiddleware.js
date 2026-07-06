const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Admin privileges required'
    });
  }
  next();
};

module.exports = adminMiddleware;
