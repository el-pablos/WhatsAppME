/**
 * Environment Check for Pterodactyl
 */

console.log('🔍 Environment Check Starting...');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

console.log('📋 Node.js version:', nodeVersion);

if (majorVersion >= 20) {
  console.log('✅ Node.js version is compatible');
} else if (majorVersion >= 16) {
  console.log('⚠️ Node.js version is minimum supported. Recommend 20+');
} else {
  console.error('❌ Node.js version too old. Requires 20+');
  process.exit(1);
}

// Check required files
const requiredFiles = [
  'package.json',
  'index.js',
  'config/config.js',
  'handlers/menuHandler.js',
  'handlers/quizHandler.js',
  'handlers/paymentHandler.js',
  'utils/userManager.js',
  'utils/messageFormatter.js'
];

let missingFiles = [];

requiredFiles.forEach(file => {
  try {
    require('fs').accessSync(file);
    console.log('✅ Found:', file);
  } catch (error) {
    console.error('❌ Missing:', file);
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.error('❌ Missing required files:', missingFiles);
  process.exit(1);
}

// Check dependencies
console.log('📦 Checking dependencies...');

const requiredDeps = [
  'whatsapp-web.js',
  'qrcode-terminal',
  'fs-extra',
  'moment',
  'moment-timezone',
  'node-cron'
];

let missingDeps = [];

requiredDeps.forEach(dep => {
  try {
    require(dep);
    console.log('✅ Dependency OK:', dep);
  } catch (error) {
    console.error('❌ Missing dependency:', dep);
    missingDeps.push(dep);
  }
});

if (missingDeps.length > 0) {
  console.error('❌ Missing dependencies:', missingDeps);
  console.log('💡 Run: npm install --production');
  process.exit(1);
}

console.log('🎉 Environment check passed!');
console.log('✅ Ready to start WhatsApp Me Bot');
