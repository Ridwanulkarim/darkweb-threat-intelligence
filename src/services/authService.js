const prisma = require('../database/prisma');
const logger = require('../utils/logger');
const { hashPassword, comparePassword, generateToken } = require('../utils/helpers');

const authService = {
  // Register admin
  registerAdmin: async (data, callerUser = null) => {
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

      // Check if admin already exists with this email
      const existing = await prisma.admin.findUnique({ where: { email } });
      if (existing) {
        const error = new Error('An administrator with this email is already registered');
        error.status = 409;
        throw error;
      }

      const hashedPassword = hashPassword(password);
      const admin = await prisma.admin.create({
        data: {
          name,
          email,
          password: hashedPassword,
          status: 'ACTIVE'
        },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          createdAt: true
        }
      });
      logger.info(`Admin registered successfully: ${admin.email}`);
      return admin;
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
      const validPassword = admin ? comparePassword(password, admin.password) : false;

      // Prevent user enumeration: identical response whether user exists or password mismatch
      if (!admin || !validPassword) {
        const error = new Error('Invalid email or password');
        error.status = 401;
        throw error;
      }

      if (admin.status !== 'ACTIVE') {
        const error = new Error('Admin account is inactive. Please contact system administrator.');
        error.status = 403;
        throw error;
      }

      const token = generateToken({ id: admin.id, email: admin.email, role: 'ADMIN' });
      logger.info(`Admin logged in successfully: ${email}`);
      return { 
        token, 
        admin: { 
          id: admin.id, 
          name: admin.name,
          email: admin.email,
          role: 'ADMIN' 
        } 
      };
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

      const { name, email, password } = data;

      if (!name || !email || !password) {
        const error = new Error('Name, email, and password are required');
        error.status = 400;
        throw error;
      }

      // Check if analyst already exists with this email
      const existing = await prisma.analyst.findUnique({ where: { email } });
      if (existing) {
        const error = new Error('An analyst with this email is already registered');
        error.status = 409;
        throw error;
      }

      // STRICT PRIVILEGE SEPARATION: Under no circumstances can client self-assign 'ADMIN'
      // Allowed analyst roles are strictly 'ANALYST' or 'RESEARCHER'
      let assignedRole = 'ANALYST';
      if (data.role && data.role.toUpperCase() === 'RESEARCHER') {
        assignedRole = 'RESEARCHER';
      }

      const hashedPassword = hashPassword(password);
      const analyst = await prisma.analyst.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: assignedRole,
          status: 'ACTIVE'
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          createdAt: true
        }
      });
      logger.info(`Analyst registered successfully: ${analyst.email} as ${assignedRole}`);
      return analyst;
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
      const validPassword = analyst ? comparePassword(password, analyst.password) : false;

      // Prevent user enumeration: identical response whether user exists or password mismatch
      if (!analyst || !validPassword) {
        const error = new Error('Invalid email or password');
        error.status = 401;
        throw error;
      }

      if (analyst.status !== 'ACTIVE') {
        const error = new Error('Analyst account is inactive. Please contact administrator.');
        error.status = 403;
        throw error;
      }

      const token = generateToken({ 
        id: analyst.id, 
        email: analyst.email, 
        role: analyst.role 
      });
      logger.info(`Analyst logged in successfully: ${email}`);
      return { 
        token, 
        analyst: { 
          id: analyst.id, 
          name: analyst.name,
          email: analyst.email, 
          role: analyst.role 
        } 
      };
    } catch (error) {
      logger.error(`Error analyst login: ${error.message}`);
      throw error;
    }
  }
};

module.exports = authService;
