const prisma = require('../database/prisma');
const { formatResponse, formatErrorResponse, getPaginationParams } = require('../utils/helpers');

const organizationController = {
  // Create organization
  createOrganization: async (req, res, next) => {
    try {
      const { name, country } = req.body;
      const org = await prisma.organization.create({
        data: { name, country }
      });
      res.status(201).json(formatResponse(org, 'Organization created successfully'));
    } catch (error) {
      next(error);
    }
  },

  // Get all organizations
  getAllOrganizations: async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const { skip, take } = getPaginationParams(parseInt(page), parseInt(limit));

      const [orgs, total] = await Promise.all([
        prisma.organization.findMany({
          where: { isDeleted: false },
          skip,
          take,
          include: { _count: { select: { incidents: true, users: true } } }
        }),
        prisma.organization.count({ where: { isDeleted: false } })
      ]);

      res.json(formatResponse({ organizations: orgs, total, page: parseInt(page) }));
    } catch (error) {
      next(error);
    }
  },

  // Get organization by ID
  getOrganizationById: async (req, res, next) => {
    try {
      const org = await prisma.organization.findUnique({
        where: { id: req.params.id },
        include: { incidents: true, users: true }
      });
      if (!org || org.isDeleted) return res.status(404).json(formatErrorResponse('Organization not found', 404));
      res.json(formatResponse(org));
    } catch (error) {
      next(error);
    }
  },

  // Update organization
  updateOrganization: async (req, res, next) => {
    try {
      const org = await prisma.organization.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(formatResponse(org, 'Organization updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  // Delete organization (soft delete)
  deleteOrganization: async (req, res, next) => {
    try {
      const org = await prisma.organization.update({
        where: { id: req.params.id },
        data: { isDeleted: true, deletedAt: new Date() }
      });
      res.json(formatResponse(org, 'Organization deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = organizationController;
