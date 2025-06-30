/**
 * Order Handler - Menangani pemesanan produk dengan WhatsApp Business style
 */

const ProductManager = require('../utils/productManager');
const UserManager = require('../utils/userManager');

class OrderHandler {
  constructor() {
    this.productManager = new ProductManager();
    this.userManager = new UserManager();
    this.orderSessions = new Map(); // Store order sessions
  }

  /**
   * Handle order commands
   */
  async handleOrderCommand(message, command) {
    const userId = message.from;
    const args = command.split(' ').slice(1);

    try {
      if (args.length > 0 && args[0].startsWith('prod_')) {
        // Order specific product
        await this.startOrderProcess(message, args[0]);
      } else if (command.includes('cara order')) {
        await this.showOrderGuide(message);
      } else {
        await this.showOrderHelp(message);
      }
    } catch (error) {
      console.error('❌ Error in order handler:', error);
      await message.reply('❌ Maaf, terjadi kesalahan saat memproses pesanan.');
    }
  }

  /**
   * Start order process for specific product
   */
  async startOrderProcess(message, productId) {
    const product = this.productManager.getProductById(productId);
    const userId = message.from;
    
    if (!product) {
      await message.reply('❌ Produk tidak ditemukan. Ketik *produk* untuk melihat katalog.');
      return;
    }

    // Check stock availability
    const totalStock = product.variants && product.variants.length > 0
      ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
      : 1;

    if (totalStock === 0) {
      await message.reply(`❌ Maaf, produk "${product.name}" sedang habis stok.\n\n` +
                         `🔔 Ketik *notify ${productId}* untuk notifikasi saat stok tersedia\n` +
                         `🔙 Lihat produk lain: ketik *produk*`);
      return;
    }

    // Create order session
    this.orderSessions.set(userId, {
      productId: productId,
      product: product,
      step: 'variant_selection',
      startTime: Date.now()
    });

    // Show order form
    await this.showOrderForm(message, product);
  }

  /**
   * Show order form dengan WhatsApp Business style
   */
  async showOrderForm(message, product) {
    const priceFormatted = this.productManager.formatPrice(product.price);
    
    let orderText = `🛒 *FORM PEMESANAN*\n\n`;
    orderText += `┌─────────────────────────┐\n`;
    orderText += `│     📦 *ORDER PRODUK*    │\n`;
    orderText += `└─────────────────────────┘\n\n`;

    // Product info
    orderText += `🛍️ *Produk:* ${product.name}\n`;
    orderText += `💰 *Harga:* ${priceFormatted}\n\n`;

    // Variants selection
    if (product.variants && product.variants.length > 0) {
      orderText += `🎨 *Pilih Varian:*\n\n`;
      
      product.variants.forEach((variant, index) => {
        const variantPrice = this.productManager.formatPrice(variant.price);
        const stockStatus = variant.stock > 0 ? `✅ ${variant.stock} unit` : '❌ Habis';
        const isAvailable = variant.stock > 0;
        
        orderText += `${index + 1}️⃣ ${variant.name}\n`;
        orderText += `   💰 ${variantPrice}\n`;
        orderText += `   📦 ${stockStatus}\n`;
        
        if (isAvailable) {
          orderText += `   ✅ *Pilih: ketik ${index + 1}*\n\n`;
        } else {
          orderText += `   ❌ *Tidak tersedia*\n\n`;
        }
      });
    } else {
      // No variants, direct order
      orderText += `📦 *Stok tersedia*\n\n`;
      orderText += `✅ *Lanjut order: ketik "lanjut"*\n\n`;
    }

    orderText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    orderText += `📋 *Informasi Pemesanan:*\n`;
    orderText += `• Pilih varian yang diinginkan\n`;
    orderText += `• Isi data pengiriman\n`;
    orderText += `• Konfirmasi pesanan\n`;
    orderText += `• Lakukan pembayaran\n\n`;

    orderText += `❌ *Batal order:* ketik *batal*\n`;
    orderText += `🔙 *Kembali ke produk:* ketik *produk ${product.id}*`;

    await message.reply(orderText);
  }

  /**
   * Process order step
   */
  async processOrderStep(message, userInput) {
    const userId = message.from;
    const session = this.orderSessions.get(userId);

    if (!session) {
      await message.reply('❌ Tidak ada sesi order aktif. Ketik *produk* untuk mulai berbelanja.');
      return;
    }

    // Check session timeout (30 minutes)
    if (Date.now() - session.startTime > 30 * 60 * 1000) {
      this.orderSessions.delete(userId);
      await message.reply('⏰ Sesi order telah berakhir. Silakan mulai order baru.');
      return;
    }

    switch (session.step) {
      case 'variant_selection':
        await this.handleVariantSelection(message, session, userInput);
        break;
      case 'quantity_input':
        await this.handleQuantityInput(message, session, userInput);
        break;
      case 'customer_info':
        await this.handleCustomerInfo(message, session, userInput);
        break;
      case 'confirmation':
        await this.handleOrderConfirmation(message, session, userInput);
        break;
    }
  }

  /**
   * Handle variant selection
   */
  async handleVariantSelection(message, session, userInput) {
    const product = session.product;
    const variantIndex = parseInt(userInput) - 1;

    if (userInput.toLowerCase() === 'lanjut' && (!product.variants || product.variants.length === 0)) {
      // No variants, proceed to quantity
      session.selectedVariant = null;
      session.step = 'quantity_input';
      await this.askQuantity(message, session);
      return;
    }

    if (isNaN(variantIndex) || variantIndex < 0 || variantIndex >= product.variants.length) {
      await message.reply('❌ Pilihan tidak valid. Silakan pilih nomor varian yang tersedia.');
      return;
    }

    const selectedVariant = product.variants[variantIndex];
    
    if (selectedVariant.stock <= 0) {
      await message.reply('❌ Varian ini sedang habis stok. Silakan pilih varian lain.');
      return;
    }

    session.selectedVariant = selectedVariant;
    session.step = 'quantity_input';
    
    await this.askQuantity(message, session);
  }

  /**
   * Ask for quantity
   */
  async askQuantity(message, session) {
    const product = session.product;
    const variant = session.selectedVariant;
    const maxStock = variant ? variant.stock : 10;

    let quantityText = `📊 *PILIH JUMLAH*\n\n`;
    quantityText += `🛍️ *Produk:* ${product.name}\n`;
    
    if (variant) {
      quantityText += `🎨 *Varian:* ${variant.name}\n`;
      quantityText += `💰 *Harga:* ${this.productManager.formatPrice(variant.price)}\n`;
    } else {
      quantityText += `💰 *Harga:* ${this.productManager.formatPrice(product.price)}\n`;
    }
    
    quantityText += `📦 *Stok tersedia:* ${maxStock} unit\n\n`;
    quantityText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    quantityText += `🔢 *Masukkan jumlah yang diinginkan:*\n`;
    quantityText += `• Minimal: 1 unit\n`;
    quantityText += `• Maksimal: ${Math.min(maxStock, 10)} unit\n\n`;
    quantityText += `💡 *Contoh:* ketik *2* untuk 2 unit\n\n`;
    quantityText += `❌ *Batal:* ketik *batal*`;

    await message.reply(quantityText);
  }

  /**
   * Handle quantity input
   */
  async handleQuantityInput(message, session, userInput) {
    const quantity = parseInt(userInput);
    const variant = session.selectedVariant;
    const maxStock = variant ? variant.stock : 10;

    if (isNaN(quantity) || quantity < 1) {
      await message.reply('❌ Jumlah tidak valid. Masukkan angka minimal 1.');
      return;
    }

    if (quantity > maxStock) {
      await message.reply(`❌ Jumlah melebihi stok tersedia (${maxStock} unit). Silakan kurangi jumlah.`);
      return;
    }

    if (quantity > 10) {
      await message.reply('❌ Maksimal pembelian 10 unit per transaksi. Untuk pembelian dalam jumlah besar, hubungi admin.');
      return;
    }

    session.quantity = quantity;
    session.step = 'customer_info';
    
    await this.askCustomerInfo(message, session);
  }

  /**
   * Ask for customer information
   */
  async askCustomerInfo(message, session) {
    const product = session.product;
    const variant = session.selectedVariant;
    const quantity = session.quantity;
    
    const unitPrice = variant ? variant.price : product.price;
    const totalPrice = unitPrice * quantity;
    const totalFormatted = this.productManager.formatPrice(totalPrice);

    let infoText = `📝 *DATA PENGIRIMAN*\n\n`;
    infoText += `📋 *Ringkasan Pesanan:*\n`;
    infoText += `🛍️ ${product.name}\n`;
    
    if (variant) {
      infoText += `🎨 Varian: ${variant.name}\n`;
    }
    
    infoText += `🔢 Jumlah: ${quantity} unit\n`;
    infoText += `💰 Total: ${totalFormatted}\n\n`;
    infoText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    infoText += `📮 *Masukkan data pengiriman:*\n\n`;
    infoText += `*Format:*\n`;
    infoText += `Nama: [Nama lengkap]\n`;
    infoText += `HP: [Nomor WhatsApp]\n`;
    infoText += `Alamat: [Alamat lengkap]\n`;
    infoText += `Kota: [Kota]\n`;
    infoText += `Kodepos: [Kode pos]\n\n`;
    infoText += `📝 *Contoh:*\n`;
    infoText += `Nama: John Doe\n`;
    infoText += `HP: 081234567890\n`;
    infoText += `Alamat: Jl. Merdeka No. 123\n`;
    infoText += `Kota: Jakarta Selatan\n`;
    infoText += `Kodepos: 12345\n\n`;
    infoText += `❌ *Batal:* ketik *batal*`;

    await message.reply(infoText);
  }

  /**
   * Handle customer info input
   */
  async handleCustomerInfo(message, session, userInput) {
    // Parse customer info
    const lines = userInput.split('\n');
    const customerInfo = {};

    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const cleanKey = key.trim().toLowerCase();
        const value = valueParts.join(':').trim();
        customerInfo[cleanKey] = value;
      }
    });

    // Validate required fields
    const requiredFields = ['nama', 'hp', 'alamat', 'kota'];
    const missingFields = requiredFields.filter(field => !customerInfo[field]);

    if (missingFields.length > 0) {
      await message.reply(`❌ Data tidak lengkap. Harap isi:\n• ${missingFields.join('\n• ')}\n\nSilakan kirim ulang data lengkap.`);
      return;
    }

    session.customerInfo = customerInfo;
    session.step = 'confirmation';
    
    await this.showOrderConfirmation(message, session);
  }

  /**
   * Show order confirmation
   */
  async showOrderConfirmation(message, session) {
    const product = session.product;
    const variant = session.selectedVariant;
    const quantity = session.quantity;
    const customerInfo = session.customerInfo;
    
    const unitPrice = variant ? variant.price : product.price;
    const subtotal = unitPrice * quantity;
    const shippingCost = 15000; // Fixed shipping cost
    const total = subtotal + shippingCost;

    let confirmText = `✅ *KONFIRMASI PESANAN*\n\n`;
    confirmText += `┌─────────────────────────┐\n`;
    confirmText += `│    📋 *DETAIL PESANAN*   │\n`;
    confirmText += `└─────────────────────────┘\n\n`;

    // Product details
    confirmText += `🛍️ *Produk:* ${product.name}\n`;
    if (variant) {
      confirmText += `🎨 *Varian:* ${variant.name}\n`;
    }
    confirmText += `🔢 *Jumlah:* ${quantity} unit\n`;
    confirmText += `💰 *Harga satuan:* ${this.productManager.formatPrice(unitPrice)}\n\n`;

    // Customer info
    confirmText += `📮 *Data Pengiriman:*\n`;
    confirmText += `👤 ${customerInfo.nama}\n`;
    confirmText += `📱 ${customerInfo.hp}\n`;
    confirmText += `📍 ${customerInfo.alamat}\n`;
    confirmText += `🏙️ ${customerInfo.kota}`;
    if (customerInfo.kodepos) {
      confirmText += ` ${customerInfo.kodepos}`;
    }
    confirmText += `\n\n`;

    // Price breakdown
    confirmText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    confirmText += `💰 *Rincian Biaya:*\n`;
    confirmText += `• Subtotal: ${this.productManager.formatPrice(subtotal)}\n`;
    confirmText += `• Ongkir: ${this.productManager.formatPrice(shippingCost)}\n`;
    confirmText += `• *Total: ${this.productManager.formatPrice(total)}*\n\n`;

    confirmText += `✅ *Konfirmasi:* ketik *ya* atau *konfirm*\n`;
    confirmText += `✏️ *Edit data:* ketik *edit*\n`;
    confirmText += `❌ *Batal:* ketik *batal*`;

    await message.reply(confirmText);
  }

  /**
   * Handle order confirmation
   */
  async handleOrderConfirmation(message, session, userInput) {
    const input = userInput.toLowerCase();

    if (input === 'ya' || input === 'konfirm' || input === 'confirm') {
      await this.finalizeOrder(message, session);
    } else if (input === 'edit') {
      session.step = 'customer_info';
      await this.askCustomerInfo(message, session);
    } else {
      await message.reply('❌ Pilihan tidak valid. Ketik *ya* untuk konfirmasi, *edit* untuk ubah data, atau *batal* untuk membatalkan.');
    }
  }

  /**
   * Finalize order
   */
  async finalizeOrder(message, session) {
    const userId = message.from;
    const orderId = `ORD${Date.now()}`;
    
    // Save order (in real implementation, save to database)
    const orderData = {
      orderId: orderId,
      userId: userId,
      product: session.product,
      variant: session.selectedVariant,
      quantity: session.quantity,
      customerInfo: session.customerInfo,
      status: 'pending_payment',
      createdAt: new Date().toISOString()
    };

    // Clear session
    this.orderSessions.delete(userId);

    // Send order success message
    let successText = `🎉 *PESANAN BERHASIL DIBUAT!*\n\n`;
    successText += `📋 *Order ID:* ${orderId}\n`;
    successText += `⏰ *Waktu:* ${new Date().toLocaleString('id-ID')}\n\n`;
    successText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    successText += `💳 *LANGKAH SELANJUTNYA:*\n\n`;
    successText += `1️⃣ *Lakukan Pembayaran*\n`;
    successText += `   Ketik *payment* untuk info pembayaran\n\n`;
    successText += `2️⃣ *Kirim Bukti Transfer*\n`;
    successText += `   Sertakan Order ID: ${orderId}\n\n`;
    successText += `3️⃣ *Tunggu Konfirmasi*\n`;
    successText += `   Admin akan konfirmasi dalam 1x24 jam\n\n`;
    successText += `📞 *Hubungi Admin:* ketik *kontak*\n`;
    successText += `💳 *Info Pembayaran:* ketik *payment*\n\n`;
    successText += `🙏 Terima kasih telah berbelanja di TAM Store!`;

    await message.reply(successText);

    // Send payment info after delay
    setTimeout(async () => {
      const PaymentHandler = require('./paymentHandler');
      const paymentHandler = new PaymentHandler();
      await paymentHandler.handlePaymentRequest(message);
    }, 3000);
  }

  /**
   * Cancel order
   */
  async cancelOrder(message) {
    const userId = message.from;
    
    if (this.orderSessions.has(userId)) {
      this.orderSessions.delete(userId);
      await message.reply('❌ Pesanan dibatalkan.\n\n🛍️ Mulai belanja lagi: ketik *produk*');
    } else {
      await message.reply('❌ Tidak ada pesanan aktif untuk dibatalkan.');
    }
  }

  /**
   * Show order guide
   */
  async showOrderGuide(message) {
    let guideText = `📖 *PANDUAN PEMESANAN*\n\n`;
    guideText += `┌─────────────────────────┐\n`;
    guideText += `│    🛒 *CARA ORDER*       │\n`;
    guideText += `└─────────────────────────┘\n\n`;

    guideText += `📋 *Langkah-langkah:*\n\n`;
    guideText += `1️⃣ *Pilih Produk*\n`;
    guideText += `   • Ketik *produk* untuk lihat katalog\n`;
    guideText += `   • Pilih produk yang diinginkan\n\n`;

    guideText += `2️⃣ *Mulai Order*\n`;
    guideText += `   • Ketik *order [ID produk]*\n`;
    guideText += `   • Contoh: *order prod_001*\n\n`;

    guideText += `3️⃣ *Pilih Varian & Jumlah*\n`;
    guideText += `   • Pilih varian yang tersedia\n`;
    guideText += `   • Tentukan jumlah pembelian\n\n`;

    guideText += `4️⃣ *Isi Data Pengiriman*\n`;
    guideText += `   • Nama, HP, alamat lengkap\n`;
    guideText += `   • Pastikan data benar\n\n`;

    guideText += `5️⃣ *Konfirmasi & Bayar*\n`;
    guideText += `   • Cek detail pesanan\n`;
    guideText += `   • Lakukan pembayaran\n`;
    guideText += `   • Kirim bukti transfer\n\n`;

    guideText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    guideText += `💡 *Tips:*\n`;
    guideText += `• Siapkan data lengkap sebelum order\n`;
    guideText += `• Cek stok sebelum memesan\n`;
    guideText += `• Simpan Order ID untuk referensi\n\n`;

    guideText += `🛍️ *Mulai belanja:* ketik *produk*`;

    await message.reply(guideText);
  }

  /**
   * Show order help
   */
  async showOrderHelp(message) {
    let helpText = `🆘 *BANTUAN ORDER*\n\n`;
    helpText += `🛒 *Perintah Order:*\n`;
    helpText += `• *order [ID]* - Pesan produk\n`;
    helpText += `• *cara order* - Panduan lengkap\n`;
    helpText += `• *batal* - Batalkan pesanan\n\n`;
    helpText += `📞 *Butuh bantuan?*\n`;
    helpText += `Ketik *kontak* untuk hubungi admin`;

    await message.reply(helpText);
  }

  /**
   * Check if user has active order session
   */
  hasActiveSession(userId) {
    return this.orderSessions.has(userId);
  }

  /**
   * Get user's active session
   */
  getActiveSession(userId) {
    return this.orderSessions.get(userId);
  }
}

module.exports = OrderHandler;
