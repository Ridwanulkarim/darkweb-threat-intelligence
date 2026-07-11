const helpers = require('../src/utils/helpers');

// Usage: node scripts/generate-test-token.js '{"sub":"test-user","role":"ANALYST"}'
const payloadArg = process.argv[2] || '{}';
let payload;
try {
  payload = JSON.parse(payloadArg);
} catch (e) {
  console.error('Invalid JSON payload. Example: node scripts/generate-test-token.js "{\"sub\":\"test-user\"}"');
  process.exit(1);
}

const token = helpers.generateToken(payload, '7d');
console.log(token);
