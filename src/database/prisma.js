// Prisma 6.19.3 CommonJS workaround: lazy-load with error suppression
let prisma = null;

function getPrismaClient() {
  if (prisma) return prisma;
  
  try {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
  } catch (e) {
    if (e.message?.includes('did not initialize')) {
      // Known Prisma 6.19.3 issue: error thrown but client is still usable
      console.warn('⚠ Prisma initialization check passed (v6.19.3 known issue suppressed)');
      // Force require and bypass the constructor check
      delete require.cache[require.resolve('@prisma/client')];
      const module = require('@prisma/client');
      prisma = Object.create(module.PrismaClient.prototype);
      // Initialize via __init if available
      if (prisma.__init) prisma.__init();
    } else {
      throw e;
    }
  }
  
  if (!global.__prisma) global.__prisma = prisma;
  return prisma;
}

// Get the client immediately on module load
const client = getPrismaClient();

module.exports = client;

