const prisma = require('../src/database/prisma');

async function seed() {
  try {
    const report = await prisma.threatReport.create({
      data: {
        source: { create: { name: 'Test Source', type: 'INTERNAL' } },
        category: { create: { name: 'Test Category' } },
        analyst: { create: { name: 'Test Analyst', email: `test+${Date.now()}@example.com`, password: 'password' } },
        title: 'Test Threat Report',
        status: 'NEW'
      }
    });

    console.log('Seeded threat report id=', report.id);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
