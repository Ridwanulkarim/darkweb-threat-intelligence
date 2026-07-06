const prisma = require('../database/prisma');
const logger = require('../utils/logger');

const incidentService = {
  // Create incident
  createIncident: async (data) => {
    try {
      const incident = await prisma.incident.create({
        data: {
          orgId: data.orgId,
          reportId: data.reportId,
          status: data.status || 'NOT_STARTED'
        },
        include: {
          organization: true,
          report: true,
          alerts: true,
          responses: true
        }
      });
      logger.info(`Incident created: ${incident.id}`);
      return incident;
    } catch (error) {
      logger.error(`Error creating incident: ${error.message}`);
      throw error;
    }
  },

  // Get all incidents
  getIncidents: async (where = {}, skip = 0, take = 10) => {
    try {
      const [incidents, total] = await Promise.all([
        prisma.incident.findMany({
          where,
          skip,
          take,
          include: {
            organization: true,
            report: true,
            alerts: true,
            responses: { include: { analyst: true } }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.incident.count({ where })
      ]);
      return { incidents, total, page: Math.floor(skip / take) + 1 };
    } catch (error) {
      logger.error(`Error fetching incidents: ${error.message}`);
      throw error;
    }
  },

  // Get incident by ID
  getIncidentById: async (id) => {
    try {
      const incident = await prisma.incident.findUnique({
        where: { id },
        include: {
          organization: true,
          report: { include: { analyst: true } },
          alerts: true,
          responses: { include: { analyst: true } }
        }
      });
      return incident;
    } catch (error) {
      logger.error(`Error fetching incident ${id}: ${error.message}`);
      throw error;
    }
  },

  // Update incident status
  updateIncidentStatus: async (id, status) => {
    try {
      const incident = await prisma.incident.update({
        where: { id },
        data: { status },
        include: {
          organization: true,
          report: true,
          responses: { include: { analyst: true } }
        }
      });
      logger.info(`Incident status updated: ${id} -> ${status}`);
      return incident;
    } catch (error) {
      logger.error(`Error updating incident ${id}: ${error.message}`);
      throw error;
    }
  }
};

module.exports = incidentService;
