/**
 * WhatsApp Me Bot - Main Application
 * Bot WhatsApp dengan fitur auto-reply, menu interaktif, kuis, dan payment handler
 */

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs-extra');
const moment = require('moment-timezone');
const cron = require('node-cron');

// Import modules
const config = require('./config/config');
const MenuHandler = require('./handlers/menuHandler');
const QuizHandler = require('./handlers/quizHandler');
const PaymentHandler = require('./handlers/paymentHandler');
const UserManager = require('./utils/userManager');
const MessageFormatter = require('./utils/messageFormatter');

class WhatsAppBot {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: "whatsapp-me-bot",
        dataPath: config.files.sessionPath
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      }
    });

    this.userManager = new UserManager();
    this.menuHandler = new MenuHandler();
    this.quizHandler = new QuizHandler();
    this.paymentHandler = new PaymentHandler();
    this.messageFormatter = new MessageFormatter();

    this.initializeBot();
    this.setupCronJobs();
  }

  /**
   * Inisialisasi bot dan event handlers
   */
  initializeBot() {
    // Event: QR Code untuk login
    this.client.on('qr', (qr) => {
      console.log('🔗 Scan QR Code di bawah ini untuk login:');
      qrcode.generate(qr, { small: true });
      console.log('📱 Buka WhatsApp > Linked Devices > Link a Device');
    });

    // Event: Bot siap digunakan
    this.client.on('ready', () => {
      console.log('✅ WhatsApp Bot siap digunakan!');
      console.log(`🤖 Bot Name: ${config.bot.name}`);
      console.log(`📅 Started at: ${moment().tz(config.operationalHours.timezone).format('YYYY-MM-DD HH:mm:ss')}`);
    });

    // Event: Pesan masuk
    this.client.on('message', async (message) => {
      try {
        await this.handleMessage(message);
      } catch (error) {
        console.error('❌ Error handling message:', error);
      }
    });

    // Event: Koneksi terputus
    this.client.on('disconnected', (reason) => {
      console.log('⚠️ Bot disconnected:', reason);
    });

    // Event: Error
    this.client.on('auth_failure', (msg) => {
      console.error('❌ Authentication failed:', msg);
    });
  }

  /**
   * Handler utama untuk semua pesan masuk
   */
  async handleMessage(message) {
    // Skip pesan dari bot sendiri atau grup
    if (message.fromMe || message.from.includes('@g.us')) {
      return;
    }

    const userId = message.from;
    const messageBody = message.body.toLowerCase().trim();
    const contact = await message.getContact();

    console.log(`📨 Pesan dari ${contact.name || contact.pushname}: ${message.body}`);

    // Handle menu selection (numbers 1-6)
    if (/^[1-6]$/.test(messageBody)) {
      await this.menuHandler.handleMenuSelection(message, messageBody);
      return;
    }

    // Handle menu commands
    if (this.isMenuCommand(messageBody)) {
      await this.menuHandler.handleMenuCommand(message, messageBody);
      return;
    }

    // Handle quiz commands
    if (this.isQuizCommand(messageBody)) {
      await this.quizHandler.handleQuizCommand(message, messageBody);
      return;
    }

    // Handle payment keywords
    if (this.isPaymentKeyword(messageBody)) {
      await this.paymentHandler.handlePaymentRequest(message);
      return;
    }

    // Handle quiz answers
    if (await this.quizHandler.isUserInQuiz(userId)) {
      await this.quizHandler.handleQuizAnswer(message, messageBody);
      return;
    }

    // Handle poll votes
    if (await this.quizHandler.isUserInPoll(userId)) {
      await this.quizHandler.handlePollVote(message, messageBody);
      return;
    }

    // Auto-reply untuk chat pribadi saat admin offline
    if (this.shouldSendAutoReply(userId)) {
      await this.sendAutoReply(message);
    }
  }

  /**
   * Cek apakah pesan adalah command menu
   */
  isMenuCommand(messageBody) {
    const menuCommands = ['menu', 'help', 'bantuan', 'info'];
    return menuCommands.includes(messageBody);
  }

  /**
   * Cek apakah pesan adalah command kuis
   */
  isQuizCommand(messageBody) {
    const quizCommands = ['kuis', 'quiz', 'polling', 'poll'];
    return quizCommands.some(cmd => messageBody.includes(cmd));
  }

  /**
   * Cek apakah pesan mengandung keyword pembayaran
   */
  isPaymentKeyword(messageBody) {
    const paymentKeywords = ['payment', 'bayar', 'pembayaran', 'transfer', 'rekening', 'qris'];
    return paymentKeywords.some(keyword => messageBody.includes(keyword));
  }

  /**
   * Cek apakah harus mengirim auto-reply
   */
  shouldSendAutoReply(userId) {
    if (!config.bot.adminOfflineMessage) return false;
    
    // Cek apakah user sudah menerima auto-reply
    const userData = this.userManager.getUser(userId);
    if (userData.autoReplySent >= config.bot.maxAutoReplyPerUser) {
      return false;
    }

    // Cek jam operasional
    return !this.isOperationalHours();
  }

  /**
   * Cek apakah sedang dalam jam operasional
   */
  isOperationalHours() {
    const now = moment().tz(config.operationalHours.timezone);
    const currentDay = now.day();
    const currentTime = now.format('HH:mm');

    // Cek hari kerja
    if (!config.operationalHours.workDays.includes(currentDay)) {
      return false;
    }

    // Cek jam kerja
    return currentTime >= config.operationalHours.start && 
           currentTime <= config.operationalHours.end;
  }

  /**
   * Kirim auto-reply dengan pesan acak
   */
  async sendAutoReply(message) {
    const userId = message.from;
    const randomMessage = this.getRandomAutoReplyMessage();

    try {
      await message.reply(randomMessage);
      
      // Update counter auto-reply user
      this.userManager.incrementAutoReply(userId);
      
      console.log(`🤖 Auto-reply sent to ${userId}`);
    } catch (error) {
      console.error('❌ Error sending auto-reply:', error);
    }
  }

  /**
   * Ambil pesan auto-reply secara acak
   */
  getRandomAutoReplyMessage() {
    const messages = config.autoReplyMessages;
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }

  /**
   * Setup cron jobs untuk maintenance
   */
  setupCronJobs() {
    // Reset auto-reply counter setiap hari jam 00:00
    cron.schedule('0 0 * * *', () => {
      console.log('🔄 Resetting daily auto-reply counters...');
      this.userManager.resetDailyCounters();
    }, {
      timezone: config.operationalHours.timezone
    });

    // Backup data setiap 6 jam
    cron.schedule('0 */6 * * *', () => {
      console.log('💾 Creating data backup...');
      this.userManager.backupData();
    });
  }

  /**
   * Start bot
   */
  async start() {
    try {
      console.log('🚀 Starting WhatsApp Bot...');
      await this.client.initialize();
    } catch (error) {
      console.error('❌ Failed to start bot:', error);
      process.exit(1);
    }
  }

  /**
   * Stop bot gracefully
   */
  async stop() {
    try {
      console.log('🛑 Stopping WhatsApp Bot...');
      await this.client.destroy();
      console.log('✅ Bot stopped successfully');
    } catch (error) {
      console.error('❌ Error stopping bot:', error);
    }
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  if (global.bot) {
    await global.bot.stop();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  if (global.bot) {
    await global.bot.stop();
  }
  process.exit(0);
});

// Start the bot
const bot = new WhatsAppBot();
global.bot = bot;
bot.start();

module.exports = WhatsAppBot;
