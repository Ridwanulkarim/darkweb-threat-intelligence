// In-memory sliding window rate limiter for authentication routes
const loginAttempts = new Map();

// Periodic cleanup every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of loginAttempts.entries()) {
    if (now - record.startTime > record.windowMs) {
      loginAttempts.delete(ip);
    }
  }
}, 10 * 60 * 1000);

const authRateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
  const maxAttempts = options.maxAttempts || 10; // 10 attempts per window

  return (req, res, next) => {
    // Determine client IP
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    let record = loginAttempts.get(clientIp);

    if (!record || now - record.startTime > windowMs) {
      record = {
        count: 1,
        startTime: now,
        windowMs
      };
      loginAttempts.set(clientIp, record);
      return next();
    }

    record.count += 1;

    if (record.count > maxAttempts) {
      const retryAfterSeconds = Math.ceil((record.startTime + windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        error: {
          code: 'TOO_MANY_REQUESTS',
          status: 429,
          message: `Too many authentication attempts. Please try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.`,
          timestamp: new Date().toISOString()
        }
      });
    }

    next();
  };
};

module.exports = authRateLimiter;
