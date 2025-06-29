/**
 * Menu Handler - Menangani semua interaksi menu
 */

const { MessageMedia } = require('whatsapp-web.js');
const config = require('../config/config');
const MessageFormatter = require('../utils/messageFormatter');

class MenuHandler {
  constructor() {
    this.formatter = new MessageFormatter();
  }

  /**
   * Handle menu commands
   */
  async handleMenuCommand(message, command) {
    switch (command) {
      case 'menu':
      case 'help':
      case 'bantuan':
        await this.sendMainMenu(message);
        break;
      case 'info':
        await this.sendBotInfo(message);
        break;
      default:
        await this.sendMainMenu(message);
    }
  }

  /**
   * Kirim menu utama dengan tombol interaktif
   */
  async sendMainMenu(message) {
    const menuText = this.formatter.formatMainMenu();
    
    try {
      await message.reply(menuText);
      
      // Kirim menu dengan opsi pilihan
      setTimeout(async () => {
        const optionsText = this.formatter.formatMenuOptions();
        await message.reply(optionsText);
      }, 1000);

    } catch (error) {
      console.error('❌ Error sending main menu:', error);
      await message.reply('❌ Maaf, terjadi kesalahan saat menampilkan menu.');
    }
  }

  /**
   * Handle pilihan menu dari user
   */
  async handleMenuSelection(message, selection) {
    const choice = selection.toLowerCase().trim();

    switch (choice) {
      case '1':
      case 'produk':
      case 'info produk':
        await this.sendProductInfo(message);
        break;
      
      case '2':
      case 'kontak':
      case 'kontak admin':
        await this.sendContactInfo(message);
        break;
      
      case '3':
      case 'jadwal':
      case 'jam operasional':
        await this.sendOperationalHours(message);
        break;
      
      case '4':
      case 'faq':
      case 'pertanyaan':
        await this.sendFAQ(message);
        break;
      
      case '5':
      case 'kuis':
      case 'quiz':
        await this.sendQuizMenu(message);
        break;
      
      case '6':
      case 'polling':
      case 'poll':
        await this.sendPollingMenu(message);
        break;
      
      default:
        await this.sendMainMenu(message);
    }
  }

  /**
   * Kirim informasi produk
   */
  async sendProductInfo(message) {
    const productText = `🛍️ *INFORMASI PRODUK*

┌─────────────────────────┐
│  📦 *KATEGORI PRODUK*   │
└─────────────────────────┘

🔹 *Kategori A*
   • Produk Premium Quality
   • Garansi 1 Tahun
   • Free Konsultasi

🔹 *Kategori B*
   • Produk Standard Quality  
   • Garansi 6 Bulan
   • Support 24/7

🔹 *Kategori C*
   • Produk Basic Quality
   • Garansi 3 Bulan
   • Manual Lengkap

━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 *HARGA SPESIAL*
🎯 Diskon hingga 30% untuk pembelian hari ini!

📞 *Info Lebih Lanjut:*
Ketik *"kontak"* untuk berbicara dengan admin

🔄 Kembali ke menu utama: ketik *menu*`;

    await message.reply(productText);
  }

  /**
   * Kirim informasi kontak
   */
  async sendContactInfo(message) {
    const contactText = `📞 *KONTAK ADMIN*

┌─────────────────────────┐
│    👨‍💼 *CUSTOMER SERVICE*  │
└─────────────────────────┘

📱 *WhatsApp Admin:*
   +62 812-3456-7890

📧 *Email:*
   admin@example.com

🌐 *Website:*
   www.example.com

📍 *Alamat Kantor:*
   Jl. Contoh No. 123
   Jakarta Selatan 12345

━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ *Jam Layanan:*
   Senin - Jumat: 08:00 - 17:00 WIB
   Sabtu: 08:00 - 12:00 WIB
   Minggu: Libur

🚨 *Kontak Darurat:*
   +62 811-9999-8888
   (Hanya untuk urusan mendesak)

🔄 Kembali ke menu utama: ketik *menu*`;

    await message.reply(contactText);
  }

  /**
   * Kirim jadwal operasional
   */
  async sendOperationalHours(message) {
    const scheduleText = `⏰ *JADWAL OPERASIONAL*

┌─────────────────────────┐
│     🕐 *JAM LAYANAN*     │
└─────────────────────────┘

📅 *Hari Kerja:*
   🔹 Senin - Jumat
      08:00 - 17:00 WIB

   🔹 Sabtu
      08:00 - 12:00 WIB

   🔹 Minggu & Hari Libur
      ❌ TUTUP

━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ *Respon Time:*
   • Jam kerja: 5-15 menit
   • Luar jam kerja: 1-3 jam
   • Weekend: Hari kerja berikutnya

📱 *Auto-Reply:*
   Aktif 24/7 untuk informasi dasar

🎯 *Tips Cepat Direspon:*
   • Kirim pesan saat jam kerja
   • Sertakan detail yang jelas
   • Gunakan menu FAQ untuk info umum

🔄 Kembali ke menu utama: ketik *menu*`;

    await message.reply(scheduleText);
  }

  /**
   * Kirim FAQ
   */
  async sendFAQ(message) {
    const faqText = `❓ *FREQUENTLY ASKED QUESTIONS*

┌─────────────────────────┐
│      🤔 *FAQ UMUM*       │
└─────────────────────────┘

*Q1: Bagaimana cara memesan?*
A: Hubungi admin via WhatsApp atau ketik *kontak*

*Q2: Apakah ada garansi?*
A: Ya, semua produk bergaransi. Detail di *info produk*

*Q3: Metode pembayaran apa saja?*
A: Transfer Bank, E-Wallet, QRIS. Ketik *payment*

*Q4: Berapa lama pengiriman?*
A: 1-3 hari kerja untuk area Jabodetabek

*Q5: Bisa COD?*
A: Ya, untuk area tertentu dengan minimum order

━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Q6: Bagaimana cara komplain?*
A: Hubungi admin dengan menyertakan:
   • Nomor order
   • Foto produk
   • Deskripsi masalah

*Q7: Apakah bisa refund?*
A: Ya, sesuai syarat & ketentuan yang berlaku

*Q8: Produk ori atau KW?*
A: 100% original dengan sertifikat resmi

🔄 Kembali ke menu utama: ketik *menu*
💬 Pertanyaan lain? Ketik *kontak*`;

    await message.reply(faqText);
  }

  /**
   * Kirim menu kuis
   */
  async sendQuizMenu(message) {
    const quizMenuText = `🧠 *MENU KUIS INTERAKTIF*

┌─────────────────────────┐
│     🎯 *PILIH KUIS*      │
└─────────────────────────┘

🔹 *Kuis Tersedia:*

1️⃣ *Pengetahuan Umum*
   • 5 pertanyaan menarik
   • Tingkat: Mudah-Sedang
   • Durasi: ~3 menit

2️⃣ *Teknologi*
   • 3 pertanyaan tech
   • Tingkat: Sedang
   • Durasi: ~2 menit

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎮 *Cara Main:*
   • Ketik: *kuis 1* atau *kuis 2*
   • Jawab dengan A, B, C, atau D
   • Lihat skor akhir & pembahasan

🏆 *Reward:*
   Skor sempurna = Diskon spesial!

🔄 Kembali ke menu utama: ketik *menu*`;

    await message.reply(quizMenuText);
  }

  /**
   * Kirim menu polling
   */
  async sendPollingMenu(message) {
    const pollMenuText = `📊 *MENU POLLING*

┌─────────────────────────┐
│    🗳️ *POLLING AKTIF*    │
└─────────────────────────┘

🔹 *Polling Tersedia:*

1️⃣ *Media Sosial Favorit*
   📱 Platform mana yang paling sering digunakan?

2️⃣ *Metode Pembayaran*
   💳 Cara bayar favorit Anda?

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🗳️ *Cara Ikut Polling:*
   • Ketik: *poll 1* atau *poll 2*
   • Pilih opsi yang tersedia
   • Lihat hasil real-time

📈 *Manfaat:*
   • Bantu kami memahami preferensi
   • Dapatkan insight menarik
   • Kontribusi untuk layanan lebih baik

🔄 Kembali ke menu utama: ketik *menu*`;

    await message.reply(pollMenuText);
  }

  /**
   * Kirim informasi bot
   */
  async sendBotInfo(message) {
    const infoText = `🤖 *INFORMASI BOT*

┌─────────────────────────┐
│    ℹ️ *WHATSAPP BOT*     │
└─────────────────────────┘

📋 *Detail Bot:*
   • Nama: ${config.bot.name}
   • Versi: ${config.bot.version}
   • Status: 🟢 Online

⚡ *Fitur Utama:*
   🔹 Auto-reply cerdas
   🔹 Menu interaktif
   🔹 Kuis & Polling
   🔹 Info pembayaran
   🔹 FAQ lengkap

🛠️ *Teknologi:*
   • Node.js 24+
   • WhatsApp Web API
   • Real-time processing

━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 *Tips Penggunaan:*
   • Ketik *menu* untuk navigasi
   • Gunakan keyword spesifik
   • Baca FAQ untuk info cepat

🔄 Menu utama: ketik *menu*`;

    await message.reply(infoText);
  }
}

module.exports = MenuHandler;
