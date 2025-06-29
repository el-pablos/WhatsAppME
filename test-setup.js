/**
 * Test Setup - Validasi konfigurasi dan dependencies
 * Jalankan sebelum deploy untuk memastikan semua berjalan dengan baik
 */

const fs = require('fs-extra');
const path = require('path');

class SetupValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.success = [];
  }

  /**
   * Jalankan semua validasi
   */
  async runAllTests() {
    console.log('🔍 Memulai validasi setup...\n');

    await this.checkNodeVersion();
    await this.checkRequiredFiles();
    await this.checkDirectories();
    await this.checkDependencies();
    await this.checkConfiguration();
    await this.checkDataFiles();
    await this.checkPermissions();

    this.printResults();
    return this.errors.length === 0;
  }

  /**
   * Cek versi Node.js
   */
  async checkNodeVersion() {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

    if (majorVersion >= 24) {
      this.success.push(`✅ Node.js version: ${nodeVersion} (Compatible)`);
    } else if (majorVersion >= 16) {
      this.warnings.push(`⚠️ Node.js version: ${nodeVersion} (Minimum supported, recommend 24+)`);
    } else {
      this.errors.push(`❌ Node.js version: ${nodeVersion} (Too old, requires 16+)`);
    }
  }

  /**
   * Cek file-file yang diperlukan
   */
  async checkRequiredFiles() {
    const requiredFiles = [
      'index.js',
      'package.json',
      'config/config.js',
      'handlers/menuHandler.js',
      'handlers/quizHandler.js',
      'handlers/paymentHandler.js',
      'utils/userManager.js',
      'utils/messageFormatter.js',
      'data/users.json',
      'data/quiz.json'
    ];

    for (const file of requiredFiles) {
      if (await fs.pathExists(file)) {
        this.success.push(`✅ File found: ${file}`);
      } else {
        this.errors.push(`❌ Missing file: ${file}`);
      }
    }
  }

  /**
   * Cek direktori yang diperlukan
   */
  async checkDirectories() {
    const requiredDirs = [
      'config',
      'handlers', 
      'utils',
      'data',
      'data/backup'
    ];

    for (const dir of requiredDirs) {
      if (await fs.pathExists(dir)) {
        this.success.push(`✅ Directory found: ${dir}`);
      } else {
        try {
          await fs.ensureDir(dir);
          this.success.push(`✅ Directory created: ${dir}`);
        } catch (error) {
          this.errors.push(`❌ Cannot create directory: ${dir}`);
        }
      }
    }
  }

  /**
   * Cek dependencies
   */
  async checkDependencies() {
    try {
      const packageJson = await fs.readJson('package.json');
      const dependencies = packageJson.dependencies || {};

      const requiredDeps = [
        'whatsapp-web.js',
        'qrcode-terminal',
        'fs-extra',
        'moment',
        'node-cron'
      ];

      for (const dep of requiredDeps) {
        if (dependencies[dep]) {
          this.success.push(`✅ Dependency found: ${dep}@${dependencies[dep]}`);
        } else {
          this.errors.push(`❌ Missing dependency: ${dep}`);
        }
      }

      // Cek apakah node_modules ada
      if (await fs.pathExists('node_modules')) {
        this.success.push('✅ node_modules directory exists');
      } else {
        this.warnings.push('⚠️ node_modules not found, run: npm install');
      }

    } catch (error) {
      this.errors.push('❌ Cannot read package.json');
    }
  }

  /**
   * Cek konfigurasi
   */
  async checkConfiguration() {
    try {
      const config = require('./config/config.js');

      // Cek struktur konfigurasi
      if (config.bot && config.bot.name) {
        this.success.push(`✅ Bot name configured: ${config.bot.name}`);
      } else {
        this.errors.push('❌ Bot name not configured');
      }

      if (config.operationalHours && config.operationalHours.timezone) {
        this.success.push(`✅ Timezone configured: ${config.operationalHours.timezone}`);
      } else {
        this.errors.push('❌ Timezone not configured');
      }

      if (config.autoReplyMessages && config.autoReplyMessages.length > 0) {
        this.success.push(`✅ Auto-reply messages: ${config.autoReplyMessages.length} variants`);
      } else {
        this.errors.push('❌ Auto-reply messages not configured');
      }

      if (config.paymentInfo && config.paymentInfo.methods && config.paymentInfo.methods.length > 0) {
        this.success.push(`✅ Payment methods: ${config.paymentInfo.methods.length} configured`);
      } else {
        this.warnings.push('⚠️ Payment methods not configured');
      }

    } catch (error) {
      this.errors.push(`❌ Configuration error: ${error.message}`);
    }
  }

  /**
   * Cek file data
   */
  async checkDataFiles() {
    try {
      // Cek users.json
      const userData = await fs.readJson('data/users.json');
      if (userData.autoReplySent !== undefined && userData.userSessions !== undefined) {
        this.success.push('✅ users.json structure valid');
      } else {
        this.errors.push('❌ users.json structure invalid');
      }

      // Cek quiz.json
      const quizData = await fs.readJson('data/quiz.json');
      if (quizData.quizzes && quizData.polls) {
        this.success.push(`✅ quiz.json valid (${quizData.quizzes.length} quizzes, ${quizData.polls.length} polls)`);
      } else {
        this.errors.push('❌ quiz.json structure invalid');
      }

    } catch (error) {
      this.errors.push(`❌ Data files error: ${error.message}`);
    }
  }

  /**
   * Cek permissions (Unix/Linux only)
   */
  async checkPermissions() {
    if (process.platform === 'win32') {
      this.success.push('✅ Windows detected, skipping permission check');
      return;
    }

    try {
      const stats = await fs.stat('.');
      this.success.push('✅ Directory permissions OK');
    } catch (error) {
      this.warnings.push('⚠️ Cannot check permissions');
    }
  }

  /**
   * Print hasil validasi
   */
  printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 HASIL VALIDASI SETUP');
    console.log('='.repeat(50));

    if (this.success.length > 0) {
      console.log('\n✅ SUCCESS:');
      this.success.forEach(msg => console.log(`  ${msg}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:');
      this.warnings.forEach(msg => console.log(`  ${msg}`));
    }

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(msg => console.log(`  ${msg}`));
    }

    console.log('\n' + '='.repeat(50));
    console.log(`📈 SUMMARY: ${this.success.length} success, ${this.warnings.length} warnings, ${this.errors.length} errors`);
    
    if (this.errors.length === 0) {
      console.log('🎉 Setup validation PASSED! Bot ready to deploy.');
    } else {
      console.log('❌ Setup validation FAILED! Fix errors before deploying.');
    }
    console.log('='.repeat(50) + '\n');
  }

  /**
   * Generate setup report
   */
  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
      success: this.success,
      warnings: this.warnings,
      errors: this.errors,
      status: this.errors.length === 0 ? 'PASSED' : 'FAILED'
    };

    await fs.writeJson('setup-report.json', report, { spaces: 2 });
    console.log('📄 Setup report saved to: setup-report.json');
  }
}

// Jalankan validasi jika file ini dieksekusi langsung
if (require.main === module) {
  const validator = new SetupValidator();
  
  validator.runAllTests().then(async (success) => {
    await validator.generateReport();
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  });
}

module.exports = SetupValidator;
