const prisma = require('../database/prisma');

/**
 * Get all analysts
 * GET /api/analyst
 */
const getAllAnalysts = async (req, res) => {
  try {
    const analysts = await prisma.analyst.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
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
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
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
 * Create new analyst
 * POST /api/analyst
 */
const createAnalyst = async (req, res) => {
  try {
    const { name, email, password, role = 'ANALYST' } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
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

    // Hash password (in production, use bcrypt)
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const analyst = await prisma.analyst.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
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
 */
const updateAnalyst = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;

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

    // Update analyst
    const updatedAnalyst = await prisma.analyst.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
        ...(status && { status }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
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
 * Delete analyst
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
