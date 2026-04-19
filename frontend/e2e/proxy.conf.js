const { readFileSync, existsSync } = require('fs');

let target = 'https://localhost:5001';
if (existsSync('./e2e/tmp/api-url.json')) {
  const { apiUrl } = JSON.parse(readFileSync('./e2e/tmp/api-url.json', 'utf8'));
  target = apiUrl;
}

module.exports = {
  '/api': {
    target,
    secure: false,
    changeOrigin: true,
  }
};