const alertService = require('../services/alertService');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');

// Alert Controller
const alertController = {
  createAlert: async (req, res, next) => {
    try {
      const alert = await alertService.createAlert(req.body);
      res.status(201).json(formatResponse(alert, 'Alert created successfully'));
    } catch (error) {
      next(error);
    }
  },

  getAllAlerts: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, level, reportId } = req.query;
      const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
      
      const { alerts, total } = await alertService.getAllAlerts({
        skip,
        take,
        level,
        reportId
      });

      res.json(formatResponse({ alerts, total, page: parseInt(page) }));
    } catch (error) {
      next(error);
    }
  },

  getAlertById: async (req, res, next) => {
    try {
      const alert = await alertService.getAlertById(req.params.id);
      res.json(formatResponse(alert));
    } catch (error) {
      if (error.message === 'Alert not found') {
        return res.status(404).json(formatErrorResponse('Alert not found', 404));
      }
      next(error);
    }
  },

  updateAlert: async (req, res, next) => {
    try {
      const alert = await alertService.updateAlert(req.params.id, req.body);
      res.json(formatResponse(alert, 'Alert updated successfully'));
    } catch (error) {
      if (error.message === 'Alert not found') {
        return res.status(404).json(formatErrorResponse('Alert not found', 404));
      }
      next(error);
    }
  },

  deleteAlert: async (req, res, next) => {
    try {
      await alertService.deleteAlert(req.params.id);
      res.json(formatResponse(null, 'Alert deleted successfully'));
    } catch (error) {
      if (error.message === 'Alert not found') {
        return res.status(404).json(formatErrorResponse('Alert not found', 404));
      }
      next(error);
    }
  }
};

module.exports = alertController;
