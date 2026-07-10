// Prisma Client singleton pattern
let prisma = null;

function getPrismaClient() {
  if (prisma) return prisma;
  
  try {
    // Import from the generated directory (as per prisma/schema.prisma config)
    const { PrismaClient } = require('../../generated/prisma');
    prisma = new PrismaClient();
    console.log('✓ Prisma Client initialized successfully');
  } catch (error) {
    console.error('✗ Failed to initialize Prisma Client:', error.message);
    throw error;
  }
  
  return prisma;
}

// Initialize on module load
const client = getPrismaClient();

module.exports = client;

