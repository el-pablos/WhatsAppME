/**
 * Konfigurasi WhatsApp Bot
 * Sesuaikan pengaturan sesuai kebutuhan Anda
 */

module.exports = {
  // Pengaturan Bot
  bot: {
    name: "WhatsApp Me Bot",
    version: "1.0.0",
    adminOfflineMessage: true, // Aktifkan auto-reply saat admin offline
    maxAutoReplyPerUser: 1, // Maksimal auto-reply per user
  },

  // Jam Operasional (24 jam format)
  operationalHours: {
    start: "08:00",
    end: "17:00",
    timezone: "Asia/Jakarta",
    workDays: [1, 2, 3, 4, 5], // Senin-Jumat (0=Minggu, 1=Senin, dst)
  },

  // Pesan Auto-Reply (akan dipilih secara acak)
  autoReplyMessages: [
    `🤖 *Halo! Terima kasih telah menghubungi kami.*

Saat ini admin sedang tidak tersedia atau di luar jam operasional. Tim kami akan merespons pesan Anda dalam waktu 1-3 jam kerja.

📋 *Sementara menunggu, Anda bisa:*
• Cek menu utama dengan mengetik *menu*
• Baca FAQ untuk pertanyaan umum
• Lihat info produk terbaru kami

⏰ *Jam Operasional:*
Senin - Jumat: 08:00 - 17:00 WIB

Terima kasih atas kesabaran Anda! 🙏`,

    `👋 *Selamat datang di layanan WhatsApp kami!*

Mohon maaf, admin sedang tidak online saat ini. Pesan Anda sangat penting bagi kami dan akan dibalas dalam waktu maksimal 3 jam kerja.

🔍 *Tips cepat mendapat jawaban:*
• Ketik *menu* untuk melihat layanan kami
• Cek bagian FAQ untuk solusi instan
• Pastikan pesan Anda jelas dan spesifik

📞 *Untuk urusan mendesak:*
Silakan hubungi nomor darurat yang tersedia di menu kontak.

Kami akan segera membantu Anda! ✨`,

    `💬 *Halo! Kami telah menerima pesan Anda.*

Admin kami sedang sibuk melayani pelanggan lain atau berada di luar jam kerja. Estimasi waktu respon adalah 1-2 jam pada hari kerja.

📚 *Sambil menunggu, yuk explore:*
• Ketik *menu* untuk navigasi lengkap
• Baca panduan FAQ untuk jawaban cepat
• Lihat katalog produk terbaru

🕐 *Jam Layanan:*
Senin - Jumat: 08:00 - 17:00 WIB
(Respon di luar jam kerja pada hari berikutnya)

Terima kasih sudah memilih layanan kami! 🌟`
  ],

  // Informasi Pembayaran
  paymentInfo: {
    methods: [
      {
        name: "BCA",
        type: "Bank Transfer",
        account: "1234567890",
        accountName: "PT. CONTOH BISNIS"
      },
      {
        name: "DANA",
        type: "E-Wallet",
        account: "081234567890",
        accountName: "NAMA PENERIMA"
      },
      {
        name: "QRIS",
        type: "QR Code",
        account: "qris-static-code-here",
        accountName: "MERCHANT NAME"
      }
    ],
    notes: [
      "Konfirmasi pembayaran dengan mengirim bukti transfer",
      "Pembayaran akan diverifikasi dalam 1x24 jam",
      "Untuk pembayaran di atas Rp 1.000.000 harap konfirmasi terlebih dahulu"
    ]
  },

  // File Paths
  files: {
    userData: "./data/users.json",
    quizData: "./data/quiz.json",
    sessionPath: "./session"
  }
};
