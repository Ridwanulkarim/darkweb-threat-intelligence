const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');

const incidentController = {
  createIncident: async (req, res, next) => {
    try {
      const { orgId, reportId, status } = req.body;
      const incident = await prisma.incident.create({
        data: { orgId, reportId, status: status || 'NOT_STARTED' },
        include: { organization: true, report: true }
      });
      res.status(201).json(formatResponse(incident, 'Incident created successfully'));
    } catch (error) {
      next(error);
    }
  },

  getAllIncidents: async (req, res, next) => {
    try {
      const { page = 1, limit = 10, status, orgId } = req.query;
      const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));
      const where = {};
      if (status) where.status = status;
      if (orgId) where.orgId = orgId;

      const [incidents, total] = await Promise.all([
        prisma.incident.findMany({
          where,
          skip,
          take,
          include: { organization: true, report: true, alerts: true, responses: true },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.incident.count({ where })
      ]);

      res.json(formatResponse({ incidents, total, page: parseInt(page) }));
    } catch (error) {
      next(error);
    }
  },

  getIncidentById: async (req, res, next) => {
    try {
      const incident = await prisma.incident.findUnique({
        where: { id: req.params.id },
        include: {
          organization: true,
          report: true,
          alerts: true,
          responses: { include: { analyst: true } }
        }
      });
      if (!incident) return res.status(404).json(formatErrorResponse('Incident not found', 404));
      res.json(formatResponse(incident));
    } catch (error) {
      next(error);
    }
  },

  updateIncident: async (req, res, next) => {
    try {
      const incident = await prisma.incident.update({
        where: { id: req.params.id },
        data: req.body,
        include: { organization: true, report: true, responses: true }
      });
      res.json(formatResponse(incident, 'Incident updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  deleteIncident: async (req, res, next) => {
    try {
      // Delete related data first
      await prisma.incidentAlert.deleteMany({ where: { incidentId: req.params.id } });
      await prisma.incidentResponse.deleteMany({ where: { incidentId: req.params.id } });
      await prisma.incident.delete({ where: { id: req.params.id } });
      res.json(formatResponse(null, 'Incident deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = incidentController;
