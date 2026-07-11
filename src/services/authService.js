const prisma = require('../database/prisma');
const logger = require('../utils/logger');
const { hashPassword, comparePassword, generateToken } = require('../utils/helpers');

const authService = {
  // Register admin
  registerAdmin: async (data) => {
    try {
      if (!data) {
        const error = new Error('Request body is required');
        error.status = 400;
        throw error;
      }

      const { name, email, password } = data;

      if (!name || !email || !password) {
        const error = new Error('Name, email, and password are required');
        error.status = 400;
        throw error;
      }

      const hashedPassword = hashPassword(data.password);
      const admin = await prisma.admin.create({
        data: {
          name,
          email,
          password: hashedPassword,
          status: 'ACTIVE'
        }
      });
      logger.info(`Admin registered: ${admin.email}`);
      return { id: admin.id, email: admin.email };
    } catch (error) {
      logger.error(`Error registering admin: ${error.message}`);
      throw error;
    }
  },

  // Admin login
  adminLogin: async (email, password) => {
    try {
      if (!email || !password) {
        const error = new Error('Email and password are required');
        error.status = 400;
        throw error;
      }

      const admin = await prisma.admin.findUnique({ where: { email } });
      if (!admin) throw new Error('Admin not found');

      const validPassword = comparePassword(password, admin.password);
      if (!validPassword) throw new Error('Invalid password');

      if (admin.status !== 'ACTIVE') throw new Error('Admin account is inactive');

      const token = generateToken({ id: admin.id, email: admin.email, role: 'ADMIN' });
      logger.info(`Admin logged in: ${email}`);
      return { token, admin: { id: admin.id, email: admin.email } };
    } catch (error) {
      logger.error(`Error admin login: ${error.message}`);
      throw error;
    }
  },

  // Register analyst
  registerAnalyst: async (data) => {
    try {
      if (!data) {
        const error = new Error('Request body is required');
        error.status = 400;
        throw error;
      }

      const { name, email, password, role } = data;

      if (!name || !email || !password) {
        const error = new Error('Name, email, and password are required');
        error.status = 400;
        throw error;
      }

      const hashedPassword = hashPassword(data.password);
      const analyst = await prisma.analyst.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || 'ANALYST',
          status: 'ACTIVE'
        }
      });
      logger.info(`Analyst registered: ${analyst.email}`);
      return { id: analyst.id, email: analyst.email };
    } catch (error) {
      logger.error(`Error registering analyst: ${error.message}`);
      throw error;
    }
  },

  // Analyst login
  analystLogin: async (email, password) => {
    try {
      if (!email || !password) {
        const error = new Error('Email and password are required');
        error.status = 400;
        throw error;
      }

      const analyst = await prisma.analyst.findUnique({ where: { email } });
      if (!analyst) throw new Error('Analyst not found');

      const validPassword = comparePassword(password, analyst.password);
      if (!validPassword) throw new Error('Invalid password');

      if (analyst.status !== 'ACTIVE') throw new Error('Analyst account is inactive');

      const token = generateToken({ 
        id: analyst.id, 
        email: analyst.email, 
        role: analyst.role 
      });
      logger.info(`Analyst logged in: ${email}`);
      return { token, analyst: { id: analyst.id, email: analyst.email, role: analyst.role } };
    } catch (error) {
      logger.error(`Error analyst login: ${error.message}`);
      throw error;
    }
  }
};

module.exports = authService;
