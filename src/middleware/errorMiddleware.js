const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  res.status(status).json({
    error: {
      code,
      message,
      status,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = errorMiddleware;
