/**
 * Payment Handler - Menangani informasi pembayaran
 */

const config = require('../config/config');

class PaymentHandler {
  constructor() {
    this.paymentMethods = config.paymentInfo.methods;
    this.paymentNotes = config.paymentInfo.notes;
  }

  /**
   * Handle payment request
   */
  async handlePaymentRequest(message) {
    try {
      // Send Telegraph link with preview
      const telegraphMessage = this.formatTelegraphMessage();
      await message.reply(telegraphMessage);

      // Send quick payment summary after delay
      setTimeout(async () => {
        const quickSummary = this.formatQuickPaymentSummary();
        await message.reply(quickSummary);
      }, 2000);

    } catch (error) {
      console.error('❌ Error sending payment info:', error);
      await message.reply('❌ Maaf, terjadi kesalahan saat menampilkan informasi pembayaran.');
    }
  }

  /**
   * Format Telegraph message dengan link
   */
  formatTelegraphMessage() {
    let telegraphText = `💳 *${config.paymentInfo.storeName} - PAYMENT INFO*\n\n`;
    telegraphText += `┌─────────────────────────┐\n`;
    telegraphText += `│   🎨 *PAYMENT METHODS*   │\n`;
    telegraphText += `└─────────────────────────┘\n\n`;

    telegraphText += `🌟 *Lihat semua metode pembayaran dengan UI yang keren:*\n\n`;
    telegraphText += `🔗 *Link Payment:*\n`;
    telegraphText += `${config.paymentTelegraphUrl}\n\n`;

    telegraphText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    telegraphText += `⚡ *Metode Tersedia:*\n`;

    config.paymentInfo.methods.forEach((method, index) => {
      telegraphText += `${method.icon} *${method.name}*\n`;
      telegraphText += `   📱 ${method.account}\n`;
      if (index < config.paymentInfo.methods.length - 1) {
        telegraphText += `\n`;
      }
    });

    telegraphText += `\n👤 *Semua a.n:* ${config.paymentInfo.ownerName}\n\n`;
    telegraphText += `💡 *Klik link di atas untuk tampilan lengkap!*`;

    return telegraphText;
  }

  /**
   * Format quick payment summary
   */
  formatQuickPaymentSummary() {
    let summaryText = `⚡ *QUICK PAYMENT SUMMARY*\n\n`;
    summaryText += `🏪 *${config.paymentInfo.storeName}*\n\n`;

    config.paymentInfo.methods.forEach((method, index) => {
      summaryText += `${method.icon} *${method.name}:* ${method.account}\n`;
    });

    summaryText += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    summaryText += `📋 *Cara Bayar:*\n`;
    summaryText += `1️⃣ Transfer sesuai nominal\n`;
    summaryText += `2️⃣ Screenshot bukti\n`;
    summaryText += `3️⃣ Kirim ke admin\n`;
    summaryText += `4️⃣ Tunggu konfirmasi\n\n`;

    summaryText += `⚠️ *Penting:* Semua rekening a.n. ${config.paymentInfo.ownerName}\n\n`;
    summaryText += `🔗 *Detail lengkap:* ${config.paymentTelegraphUrl}`;

    return summaryText;
  }

  /**
   * Format tips pembayaran
   */
  formatPaymentTips() {
    let tipsText = `💡 *TIPS PEMBAYARAN AMAN*\n\n`;
    tipsText += `┌─────────────────────────┐\n`;
    tipsText += `│     🛡️ *KEAMANAN*       │\n`;
    tipsText += `└─────────────────────────┘\n\n`;

    tipsText += `✅ *DO (Lakukan):*\n`;
    tipsText += `• Cek kembali nomor rekening\n`;
    tipsText += `• Screenshot bukti transfer\n`;
    tipsText += `• Konfirmasi dalam 1x24 jam\n`;
    tipsText += `• Simpan bukti pembayaran\n\n`;

    tipsText += `❌ *DON'T (Jangan):*\n`;
    tipsText += `• Transfer ke rekening lain\n`;
    tipsText += `• Berikan PIN/password\n`;
    tipsText += `• Abaikan konfirmasi\n`;
    tipsText += `• Hapus bukti transfer\n\n`;

    tipsText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    tipsText += `🚀 *PROSES CEPAT:*\n\n`;
    tipsText += `1️⃣ Transfer sesuai nominal\n`;
    tipsText += `2️⃣ Screenshot bukti\n`;
    tipsText += `3️⃣ Kirim ke admin\n`;
    tipsText += `4️⃣ Tunggu konfirmasi\n`;
    tipsText += `5️⃣ Pesanan diproses\n\n`;

    tipsText += `⏰ *Jam Verifikasi:*\n`;
    tipsText += `Senin-Jumat: 08:00-17:00 WIB\n`;
    tipsText += `Sabtu: 08:00-12:00 WIB\n\n`;

    tipsText += `📞 *Butuh Bantuan?*\n`;
    tipsText += `Ketik *kontak* untuk hubungi admin\n\n`;

    tipsText += `🔄 Menu utama: ketik *menu*`;

    return tipsText;
  }

  /**
   * Get payment method icon
   */
  getPaymentIcon(type) {
    const icons = {
      'Bank Transfer': '🏦',
      'E-Wallet': '📱',
      'QR Code': '📱',
      'Credit Card': '💳',
      'Debit Card': '💳'
    };
    
    return icons[type] || '💰';
  }

  /**
   * Format QRIS information (jika ada)
   */
  formatQRISInfo() {
    const qrisMethod = this.paymentMethods.find(method => 
      method.type === 'QR Code' || method.name.toLowerCase().includes('qris')
    );

    if (!qrisMethod) return null;

    let qrisText = `📱 *PEMBAYARAN QRIS*\n\n`;
    qrisText += `┌─────────────────────────┐\n`;
    qrisText += `│      📱 *SCAN & PAY*     │\n`;
    qrisText += `└─────────────────────────┘\n\n`;

    qrisText += `🔍 *Cara Bayar QRIS:*\n\n`;
    qrisText += `1️⃣ Buka aplikasi e-wallet\n`;
    qrisText += `2️⃣ Pilih "Scan QR" atau "QRIS"\n`;
    qrisText += `3️⃣ Scan QR Code yang diberikan\n`;
    qrisText += `4️⃣ Masukkan nominal pembayaran\n`;
    qrisText += `5️⃣ Konfirmasi pembayaran\n`;
    qrisText += `6️⃣ Screenshot bukti berhasil\n\n`;

    qrisText += `💡 *Keuntungan QRIS:*\n`;
    qrisText += `• ⚡ Pembayaran instan\n`;
    qrisText += `• 🔒 Aman dan terpercaya\n`;
    qrisText += `• 📱 Support semua e-wallet\n`;
    qrisText += `• 💸 Tanpa biaya admin\n\n`;

    qrisText += `🏪 *Merchant: ${qrisMethod.accountName}*\n\n`;

    qrisText += `❗ *Penting:*\n`;
    qrisText += `Pastikan scan QR dari sumber resmi\n`;
    qrisText += `dan selalu konfirmasi ke admin!`;

    return qrisText;
  }

  /**
   * Handle specific payment method request
   */
  async handleSpecificPaymentMethod(message, methodName) {
    const method = this.paymentMethods.find(m => 
      m.name.toLowerCase().includes(methodName.toLowerCase())
    );

    if (!method) {
      await this.handlePaymentRequest(message);
      return;
    }

    const icon = this.getPaymentIcon(method.type);
    
    let methodText = `${icon} *PEMBAYARAN ${method.name.toUpperCase()}*\n\n`;
    methodText += `┌─────────────────────────┐\n`;
    methodText += `│    💳 *DETAIL REKENING*  │\n`;
    methodText += `└─────────────────────────┘\n\n`;

    methodText += `🏦 *Bank/Platform:* ${method.name}\n`;
    methodText += `📋 *Jenis:* ${method.type}\n`;
    methodText += `🔢 *Nomor:* ${method.account}\n`;
    methodText += `👤 *Atas Nama:* ${method.accountName}\n\n`;

    methodText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Add specific instructions based on method type
    if (method.type === 'Bank Transfer') {
      methodText += `📝 *Cara Transfer:*\n`;
      methodText += `1️⃣ Login ke mobile banking\n`;
      methodText += `2️⃣ Pilih transfer antar bank\n`;
      methodText += `3️⃣ Masukkan nomor rekening\n`;
      methodText += `4️⃣ Input nominal sesuai invoice\n`;
      methodText += `5️⃣ Konfirmasi transfer\n`;
      methodText += `6️⃣ Screenshot bukti berhasil\n\n`;
    } else if (method.type === 'E-Wallet') {
      methodText += `📱 *Cara Transfer E-Wallet:*\n`;
      methodText += `1️⃣ Buka aplikasi ${method.name}\n`;
      methodText += `2️⃣ Pilih "Transfer" atau "Kirim"\n`;
      methodText += `3️⃣ Input nomor: ${method.account}\n`;
      methodText += `4️⃣ Masukkan nominal pembayaran\n`;
      methodText += `5️⃣ Konfirmasi transfer\n`;
      methodText += `6️⃣ Screenshot bukti berhasil\n\n`;
    }

    methodText += `⚠️ *Pastikan:*\n`;
    methodText += `• Nomor rekening benar\n`;
    methodText += `• Nominal sesuai tagihan\n`;
    methodText += `• Simpan bukti transfer\n`;
    methodText += `• Konfirmasi ke admin\n\n`;

    methodText += `📞 Konfirmasi: ketik *kontak*\n`;
    methodText += `🔄 Menu utama: ketik *menu*`;

    await message.reply(methodText);
  }

  /**
   * Generate payment confirmation template
   */
  generateConfirmationTemplate() {
    let template = `📋 *TEMPLATE KONFIRMASI PEMBAYARAN*\n\n`;
    template += `┌─────────────────────────┐\n`;
    template += `│   📝 *COPY & EDIT*       │\n`;
    template += `└─────────────────────────┘\n\n`;

    template += `*KONFIRMASI PEMBAYARAN*\n\n`;
    template += `👤 Nama: [Nama Lengkap]\n`;
    template += `📞 No. HP: [Nomor HP]\n`;
    template += `🛒 Pesanan: [Detail Pesanan]\n`;
    template += `💰 Nominal: Rp [Jumlah Transfer]\n`;
    template += `🏦 Via: [Metode Pembayaran]\n`;
    template += `📅 Tanggal: [DD/MM/YYYY]\n`;
    template += `⏰ Waktu: [HH:MM]\n\n`;

    template += `📎 *Jangan lupa lampirkan:*\n`;
    template += `• Screenshot bukti transfer\n`;
    template += `• Foto struk (jika ada)\n\n`;

    template += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    template += `✅ Copy template di atas\n`;
    template += `✏️ Edit sesuai data Anda\n`;
    template += `📤 Kirim ke admin\n\n`;

    template += `📞 Kontak admin: ketik *kontak*`;

    return template;
  }
}

module.exports = PaymentHandler;
