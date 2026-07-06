const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const helpers = {
  // Hash password
  hashPassword: (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
  },

  // Compare password
  comparePassword: (password, hash) => {
    return crypto.createHash('sha256').update(password).digest('hex') === hash;
  },

  // Generate JWT token
  generateToken: (payload, expiresIn = '24h') => {
    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', { expiresIn });
  },

  // Validate email
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Format response
  formatResponse: (data, message = 'Success', status = 200) => {
    return {
      status,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  },

  // Format error response
  formatErrorResponse: (message, status = 500, code = 'ERROR') => {
    return {
      status,
      code,
      message,
      timestamp: new Date().toISOString()
    };
  },

  // Pagination helper
  getPaginationParams: (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return { skip, take: limit };
  },

  // Filter builder
  buildWhereClause: (filters) => {
    const where = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        where[key] = filters[key];
      }
    });
    return where;
  }
};

module.exports = helpers;
