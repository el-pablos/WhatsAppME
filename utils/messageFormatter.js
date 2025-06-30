/**
 * Message Formatter - Format pesan dengan desain yang menarik
 */

const moment = require('moment-timezone');
const config = require('../config/config');

class MessageFormatter {
  constructor() {
    this.timezone = config.operationalHours.timezone;
  }

  /**
   * Format main menu
   */
  formatMainMenu() {
    const currentTime = moment().tz(this.timezone).format('HH:mm');
    const currentDate = moment().tz(this.timezone).format('DD/MM/YYYY');
    
    let menuText = `🤖 *SELAMAT DATANG DI ${config.bot.name.toUpperCase()}*\n\n`;
    menuText += `┌─────────────────────────┐\n`;
    menuText += `│     🏠 *MENU UTAMA*      │\n`;
    menuText += `└─────────────────────────┘\n\n`;
    
    menuText += `📅 ${currentDate} | ⏰ ${currentTime} WIB\n\n`;
    
    menuText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    menuText += `Halo! 👋 Saya adalah asisten virtual yang siap membantu Anda 24/7. `;
    menuText += `Pilih menu di bawah ini untuk mendapatkan informasi yang Anda butuhkan.\n\n`;
    
    menuText += `✨ *Fitur yang tersedia:*\n`;
    menuText += `• 📋 Informasi lengkap produk & layanan\n`;
    menuText += `• 📞 Kontak admin dan customer service\n`;
    menuText += `• ⏰ Jadwal operasional terkini\n`;
    menuText += `• ❓ FAQ untuk jawaban cepat\n`;
    menuText += `• 🧠 Kuis interaktif dengan hadiah\n`;
    menuText += `• 📊 Polling dan survei menarik\n`;
    menuText += `• 💳 Informasi pembayaran lengkap\n\n`;
    
    return menuText;
  }

  /**
   * Format menu options
   */
  formatMenuOptions() {
    let optionsText = `🎯 *PILIH MENU YANG DIINGINKAN:*\n\n`;
    
    optionsText += `1️⃣ *Katalog Produk*\n`;
    optionsText += `   🛍️ Jelajahi produk terbaru dengan harga terbaik\n\n`;
    
    optionsText += `2️⃣ *Kontak Admin*\n`;
    optionsText += `   📞 Hubungi customer service\n\n`;
    
    optionsText += `3️⃣ *Jam Operasional*\n`;
    optionsText += `   ⏰ Jadwal layanan & respon time\n\n`;
    
    optionsText += `4️⃣ *FAQ*\n`;
    optionsText += `   ❓ Pertanyaan yang sering ditanyakan\n\n`;
    
    optionsText += `5️⃣ *Kuis Interaktif*\n`;
    optionsText += `   🧠 Tes pengetahuan berhadiah\n\n`;
    
    optionsText += `6️⃣ *Polling*\n`;
    optionsText += `   📊 Ikut survei & lihat hasilnya\n\n`;
    
    optionsText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    optionsText += `💡 *Cara menggunakan:*\n`;
    optionsText += `• Ketik angka (1-6) atau nama menu\n`;
    optionsText += `• Contoh: ketik *1* atau *produk*\n`;
    optionsText += `• Untuk kembali ke menu: ketik *menu*\n\n`;
    
    optionsText += `🔍 *Pencarian cepat:*\n`;
    optionsText += `• Ketik *produk* untuk lihat katalog\n`;
    optionsText += `• Ketik *payment* untuk info pembayaran\n`;
    optionsText += `• Ketik *kuis* untuk mulai kuis\n`;
    optionsText += `• Ketik *poll* untuk ikut polling\n\n`;
    
    optionsText += `🤝 Kami siap membantu Anda!`;
    
    return optionsText;
  }

  /**
   * Format welcome message for new users
   */
  formatWelcomeMessage(userName = '') {
    const greeting = this.getTimeBasedGreeting();
    const name = userName ? ` ${userName}` : '';
    
    let welcomeText = `${greeting}${name}! 🌟\n\n`;
    welcomeText += `🎉 *Selamat datang di ${config.bot.name}!*\n\n`;
    
    welcomeText += `Saya adalah asisten virtual yang akan membantu Anda mendapatkan informasi `;
    welcomeText += `tentang produk, layanan, dan menjawab pertanyaan Anda.\n\n`;
    
    welcomeText += `🚀 *Mulai dengan mengetik:*\n`;
    welcomeText += `• *menu* - Lihat semua pilihan\n`;
    welcomeText += `• *info* - Tentang bot ini\n`;
    welcomeText += `• *bantuan* - Panduan penggunaan\n\n`;
    
    welcomeText += `💬 Atau langsung tanyakan apa yang Anda butuhkan!\n\n`;
    welcomeText += `Saya online 24/7 untuk membantu Anda! ✨`;
    
    return welcomeText;
  }

  /**
   * Get time-based greeting
   */
  getTimeBasedGreeting() {
    const hour = moment().tz(this.timezone).hour();
    
    if (hour >= 5 && hour < 12) {
      return '🌅 Selamat pagi';
    } else if (hour >= 12 && hour < 15) {
      return '☀️ Selamat siang';
    } else if (hour >= 15 && hour < 18) {
      return '🌤️ Selamat sore';
    } else {
      return '🌙 Selamat malam';
    }
  }

  /**
   * Format error message
   */
  formatErrorMessage(error = 'Terjadi kesalahan sistem') {
    let errorText = `❌ *OOPS! ADA MASALAH*\n\n`;
    errorText += `┌─────────────────────────┐\n`;
    errorText += `│      ⚠️ *ERROR*          │\n`;
    errorText += `└─────────────────────────┘\n\n`;
    
    errorText += `🔍 *Detail Error:*\n`;
    errorText += `${error}\n\n`;
    
    errorText += `🛠️ *Solusi yang bisa dicoba:*\n`;
    errorText += `• Ketik *menu* untuk kembali ke menu utama\n`;
    errorText += `• Coba ulangi perintah Anda\n`;
    errorText += `• Hubungi admin jika masalah berlanjut\n\n`;
    
    errorText += `📞 *Butuh bantuan?*\n`;
    errorText += `Ketik *kontak* untuk menghubungi admin\n\n`;
    
    errorText += `🙏 Mohon maaf atas ketidaknyamanan ini.`;
    
    return errorText;
  }

  /**
   * Format success message
   */
  formatSuccessMessage(message, details = '') {
    let successText = `✅ *BERHASIL!*\n\n`;
    successText += `🎉 ${message}\n\n`;
    
    if (details) {
      successText += `📋 *Detail:*\n`;
      successText += `${details}\n\n`;
    }
    
    successText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    successText += `🔄 Kembali ke menu: ketik *menu*\n`;
    successText += `💬 Bantuan lain: ketik *bantuan*`;
    
    return successText;
  }

  /**
   * Format loading message
   */
  formatLoadingMessage(action = 'Memproses permintaan') {
    let loadingText = `⏳ *MOHON TUNGGU...*\n\n`;
    loadingText += `🔄 ${action}...\n\n`;
    loadingText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    loadingText += `⚡ Proses ini biasanya memakan waktu beberapa detik.\n`;
    loadingText += `Terima kasih atas kesabaran Anda! 🙏`;
    
    return loadingText;
  }

  /**
   * Format maintenance message
   */
  formatMaintenanceMessage() {
    let maintenanceText = `🔧 *SEDANG MAINTENANCE*\n\n`;
    maintenanceText += `┌─────────────────────────┐\n`;
    maintenanceText += `│    ⚙️ *PERBAIKAN*        │\n`;
    maintenanceText += `└─────────────────────────┘\n\n`;
    
    maintenanceText += `Maaf, sistem sedang dalam perbaikan untuk memberikan `;
    maintenanceText += `layanan yang lebih baik.\n\n`;
    
    maintenanceText += `⏰ *Estimasi selesai:*\n`;
    maintenanceText += `Dalam 15-30 menit\n\n`;
    
    maintenanceText += `🔄 *Silakan coba lagi nanti*\n\n`;
    
    maintenanceText += `📞 *Untuk urusan mendesak:*\n`;
    maintenanceText += `Hubungi admin melalui nomor darurat\n\n`;
    
    maintenanceText += `🙏 Terima kasih atas pengertian Anda!`;
    
    return maintenanceText;
  }

  /**
   * Format help message
   */
  formatHelpMessage() {
    let helpText = `📖 *PANDUAN PENGGUNAAN BOT*\n\n`;
    helpText += `┌─────────────────────────┐\n`;
    helpText += `│     💡 *BANTUAN*         │\n`;
    helpText += `└─────────────────────────┘\n\n`;
    
    helpText += `🎯 *Perintah Utama:*\n`;
    helpText += `• *menu* - Tampilkan menu utama\n`;
    helpText += `• *info* - Informasi tentang bot\n`;
    helpText += `• *kontak* - Hubungi admin\n`;
    helpText += `• *faq* - Pertanyaan umum\n`;
    helpText += `• *payment* - Info pembayaran\n\n`;
    
    helpText += `🎮 *Fitur Interaktif:*\n`;
    helpText += `• *kuis* - Mulai kuis\n`;
    helpText += `• *poll* - Ikut polling\n`;
    helpText += `• *kuis 1* - Kuis pengetahuan umum\n`;
    helpText += `• *poll 2* - Polling metode bayar\n\n`;
    
    helpText += `💡 *Tips Penggunaan:*\n`;
    helpText += `• Gunakan kata kunci yang jelas\n`;
    helpText += `• Ketik *menu* jika bingung\n`;
    helpText += `• Bot aktif 24/7\n`;
    helpText += `• Admin online jam kerja\n\n`;
    
    helpText += `❓ *Masih bingung?*\n`;
    helpText += `Ketik *kontak* untuk berbicara dengan admin`;
    
    return helpText;
  }

  /**
   * Format typing indicator
   */
  formatTypingIndicator() {
    return '⌨️ Bot sedang mengetik...';
  }

  /**
   * Add decorative border
   */
  addBorder(text, style = 'simple') {
    const borders = {
      simple: '━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      double: '═══════════════════════════',
      dotted: '・・・・・・・・・・・・・・・・・・・・・・・・・・・',
      stars: '✦✧✦✧✦✧✦✧✦✧✦✧✦✧✦✧✦✧✦✧✦✧✦✧✦'
    };
    
    const border = borders[style] || borders.simple;
    return `${border}\n${text}\n${border}`;
  }
}

module.exports = MessageFormatter;
