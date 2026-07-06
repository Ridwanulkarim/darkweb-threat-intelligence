const authService = require('../services/authService');
const { formatResponse, formatErrorResponse } = require('../utils/helpers');

const authController = {
  registerAdmin: async (req, res, next) => {
    try {
      const result = await authService.registerAdmin(req.body);
      res.status(201).json(formatResponse(result, 'Admin registered successfully'));
    } catch (error) {
      next(error);
    }
  },

  adminLogin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.adminLogin(email, password);
      res.json(formatResponse(result, 'Admin logged in successfully'));
    } catch (error) {
      next(error);
    }
  },

  registerAnalyst: async (req, res, next) => {
    try {
      const result = await authService.registerAnalyst(req.body);
      res.status(201).json(formatResponse(result, 'Analyst registered successfully'));
    } catch (error) {
      next(error);
    }
  },

  analystLogin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.analystLogin(email, password);
      res.json(formatResponse(result, 'Analyst logged in successfully'));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
