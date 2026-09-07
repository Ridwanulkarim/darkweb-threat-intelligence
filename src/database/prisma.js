// Prisma Client singleton pattern
let prisma = null;

function getPrismaClient() {
  if (prisma) return prisma;
  
  try {
    // Import from the generated directory (as per prisma/schema.prisma config)
    const { PrismaClient } = require('../../generated/prisma');
    const basePrisma = new PrismaClient({
      log: ['error', 'warn'],
    });

    // Auto-reconnect extension for cloud environments like Render
    prisma = basePrisma.$extends({
      query: {
        async $allOperations({ operation, model, args, query }) {
          try {
            return await query(args);
          } catch (error) {
            const isConnectionDrop = 
              error.code === 'P1017' || 
              error.code === 'P1001' || 
              error.message?.includes('Server has closed the connection') ||
              error.message?.includes('Connection is closed');

            if (isConnectionDrop) {
              console.warn(`[Prisma] Connection closed by database server (${error.code || 'P1017'}). Reconnecting...`);
              await basePrisma.$disconnect().catch(() => {});
              await basePrisma.$connect().catch(() => {});
              return await query(args);
            }
            throw error;
          }
        }
      }
    });

    console.log('✓ Prisma Client initialized successfully with auto-reconnect retry');
  } catch (error) {
    console.error('✗ Failed to initialize Prisma Client:', error.message);
    throw error;
  }
  
  return prisma;
}

// Initialize on module load
const client = getPrismaClient();

module.exports = client;

