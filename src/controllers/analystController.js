const prisma = require('../database/prisma');
const { hashPassword } = require('../utils/helpers');

// Projection to strictly prevent password hashes from ever leaving the database
const analystSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Get all analysts
 * GET /api/analyst
 */
const getAllAnalysts = async (req, res) => {
  try {
    const analysts = await prisma.analyst.findMany({
      select: analystSelect,
    });

    res.status(200).json({
      success: true,
      message: 'Analysts retrieved successfully',
      data: analysts,
      count: analysts.length,
    });
  } catch (error) {
    console.error('Error fetching analysts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analysts',
      error: error.message,
    });
  }
};

/**
 * Get analyst by ID
 * GET /api/analyst/:id
 */
const getAnalystById = async (req, res) => {
  try {
    const { id } = req.params;

    const analyst = await prisma.analyst.findUnique({
      where: { id },
      select: analystSelect,
    });

    if (!analyst) {
      return res.status(404).json({
        success: false,
        message: 'Analyst not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Analyst retrieved successfully',
      data: analyst,
    });
  } catch (error) {
    console.error('Error fetching analyst:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analyst',
      error: error.message,
    });
  }
};

/**
 * Create new analyst (Admin only)
 * POST /api/analyst
 */
const createAnalyst = async (req, res) => {
  try {
    const { name, email, password, role = 'ANALYST', status = 'ACTIVE' } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // Role validation
    const allowedRoles = ['ANALYST', 'MANAGER', 'ADMIN'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`,
      });
    }

    // Status validation
    const allowedStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses: ${allowedStatuses.join(', ')}`,
      });
    }

    // Check if email already exists
    const existingAnalyst = await prisma.analyst.findUnique({
      where: { email },
    });

    if (existingAnalyst) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password with bcrypt
    const hashedPassword = hashPassword(password);

    const analyst = await prisma.analyst.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        status,
      },
      select: analystSelect,
    });

    res.status(201).json({
      success: true,
      message: 'Analyst created successfully',
      data: analyst,
    });
  } catch (error) {
    console.error('Error creating analyst:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating analyst',
      error: error.message,
    });
  }
};

/**
 * Update analyst
 * PUT /api/analyst/:id
 * Only Admin or account owner can update.
 * Non-admins can only update name, email, and password (cannot escalate role or alter status).
 */
const updateAnalyst = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, status } = req.body;

    // Check if analyst exists
    const analyst = await prisma.analyst.findUnique({
      where: { id },
    });

    if (!analyst) {
      return res.status(404).json({
        success: false,
        message: 'Analyst not found',
      });
    }

    const isAdmin = req.user?.role === 'ADMIN';
    const isSelf = req.user?.id === id;

    // Authorization check
    if (!isAdmin && !isSelf) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You can only update your own profile or must be an Administrator',
      });
    }

    // Privilege escalation prevention: strictly reject role or status changes by non-admins
    if ((role !== undefined || status !== undefined) && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Only administrators can modify roles or account status',
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (password) updateData.password = hashPassword(password);

    if (email && email !== analyst.email) {
      const emailTaken = await prisma.analyst.findUnique({ where: { email } });
      if (emailTaken) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use by another analyst',
        });
      }
      updateData.email = email;
    }

    // Admin-only fields
    if (isAdmin) {
      if (role) {
        const allowedRoles = ['ANALYST', 'MANAGER', 'ADMIN'];
        if (!allowedRoles.includes(role)) {
          return res.status(400).json({
            success: false,
            message: `Invalid role. Allowed roles: ${allowedRoles.join(', ')}`,
          });
        }
        updateData.role = role;
      }

      if (status) {
        const allowedStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED'];
        if (!allowedStatuses.includes(status)) {
          return res.status(400).json({
            success: false,
            message: `Invalid status. Allowed statuses: ${allowedStatuses.join(', ')}`,
          });
        }
        updateData.status = status;
      }
    }

    // Update analyst in database
    const updatedAnalyst = await prisma.analyst.update({
      where: { id },
      data: updateData,
      select: analystSelect,
    });

    res.status(200).json({
      success: true,
      message: 'Analyst updated successfully',
      data: updatedAnalyst,
    });
  } catch (error) {
    console.error('Error updating analyst:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating analyst',
      error: error.message,
    });
  }
};

/**
 * Delete analyst (Admin only)
 * DELETE /api/analyst/:id
 */
const deleteAnalyst = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if analyst exists
    const analyst = await prisma.analyst.findUnique({
      where: { id },
    });

    if (!analyst) {
      return res.status(404).json({
        success: false,
        message: 'Analyst not found',
      });
    }

    // Delete analyst
    await prisma.analyst.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Analyst deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting analyst:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting analyst',
      error: error.message,
    });
  }
};

module.exports = {
  getAllAnalysts,
  getAnalystById,
  createAnalyst,
  updateAnalyst,
  deleteAnalyst,
};
