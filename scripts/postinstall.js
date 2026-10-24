const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('>>> [Postinstall] Running deployment setup...');

// Build frontend assets if not present or during build
try {
  const distPath = path.join(__dirname, '../frontend/dist');
  if (!fs.existsSync(distPath) || process.env.RENDER) {
    console.log('>>> [Postinstall] Compiling frontend assets...');
    execSync('npm --prefix frontend install && npm --prefix frontend run build', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
  }
} catch (err) {
  console.warn('>>> [Postinstall] Frontend build notice:', err.message);
}
