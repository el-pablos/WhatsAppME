/**
 * Robust Wrapper for WhatsApp Me Bot
 * Handles errors and ensures graceful startup
 */

console.log('🚀 WhatsApp Me Bot - Robust Startup');

// Environment check first
try {
  require('./env-check.js');
} catch (error) {
  console.error('❌ Environment check failed:', error.message);
  process.exit(1);
}

// Graceful error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.log('🔄 Attempting graceful shutdown...');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  console.log('🔄 Attempting graceful shutdown...');
  process.exit(1);
});

// Start the main application
try {
  console.log('🤖 Loading main application...');
  require('./index.js');
} catch (error) {
  console.error('❌ Failed to start main application:', error);
  
  if (error.code === 'MODULE_NOT_FOUND') {
    console.log('💡 Try running: npm install --production');
  }
  
  process.exit(1);
}
