/**
 * PM2 Ecosystem Configuration
 * Alternative process manager untuk production deployment
 */

module.exports = {
  apps: [{
    name: 'whatsapp-me-bot',
    script: 'index.js',
    
    // Instance configuration
    instances: 1,
    exec_mode: 'fork',
    
    // Auto restart configuration
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    
    // Environment variables
    env: {
      NODE_ENV: 'production',
      TZ: 'Asia/Jakarta'
    },
    
    // Logging configuration
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Advanced configuration
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    
    // Monitoring
    monitoring: false,
    
    // Source map support
    source_map_support: true,
    
    // Merge logs
    merge_logs: true,
    
    // Kill timeout
    kill_timeout: 5000,
    
    // Listen timeout
    listen_timeout: 8000,
    
    // Graceful shutdown
    shutdown_with_message: true
  }],

  deploy: {
    production: {
      user: 'node',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:username/whatsapp-me-bot.git',
      path: '/var/www/whatsapp-me-bot',
      'pre-deploy-local': '',
      'post-deploy': 'npm install --production && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
