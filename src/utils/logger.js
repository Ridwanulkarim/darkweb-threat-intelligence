const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = {
  info: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message}\n`;
    console.log(logMessage);
    fs.appendFileSync(path.join(logDir, 'app.log'), logMessage);
  },
  error: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message}\n`;
    console.error(logMessage);
    fs.appendFileSync(path.join(logDir, 'error.log'), logMessage);
  },
  warn: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARN: ${message}\n`;
    console.warn(logMessage);
    fs.appendFileSync(path.join(logDir, 'app.log'), logMessage);
  },
  debug: (message) => {
    if (process.env.DEBUG === 'true') {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] DEBUG: ${message}\n`;
      console.log(logMessage);
    }
  }
};

module.exports = logger;
