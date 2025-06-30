/**
 * Product Handler - Menangani katalog produk dengan WhatsApp Business style
 */

const ProductManager = require('../utils/productManager');
const MessageFormatter = require('../utils/messageFormatter');

class ProductHandler {
  constructor() {
    this.productManager = new ProductManager();
    this.formatter = new MessageFormatter();
  }

  /**
   * Handle product commands
   */
  async handleProductCommand(message, command) {
    const userId = message.from;
    const args = command.split(' ').slice(1);

    try {
      if (command.includes('add produk') || command.includes('tambah produk')) {
        await this.handleAddProductFlow(message);
      } else if (command.includes('produk') || command.includes('katalog')) {
        if (args.length > 0 && args[0].startsWith('prod_')) {
          // Show specific product
          await this.showProductDetail(message, args[0]);
        } else if (args.length > 0) {
          // Search products
          await this.searchProducts(message, args.join(' '));
        } else {
          // Show product catalog
          await this.showProductCatalog(message);
        }
      } else if (command.includes('kategori')) {
        if (args.length > 0) {
          await this.showCategoryProducts(message, args[0]);
        } else {
          await this.showCategories(message);
        }
      }
    } catch (error) {
      console.error('❌ Error in product handler:', error);
      await message.reply('❌ Maaf, terjadi kesalahan saat memproses permintaan produk.');
    }
  }

  /**
   * Show product catalog dengan WhatsApp Business style
   */
  async showProductCatalog(message, page = 1) {
    const result = this.productManager.getAllProducts({ page: page });
    
    if (result.products.length === 0) {
      await message.reply('📦 Belum ada produk yang tersedia saat ini.');
      return;
    }

    // Header catalog
    let catalogText = `🛍️ *KATALOG PRODUK TAM STORE*\n\n`;
    catalogText += `┌─────────────────────────┐\n`;
    catalogText += `│     📦 *PRODUK TERBARU*  │\n`;
    catalogText += `└─────────────────────────┘\n\n`;

    // Show featured products first
    const featuredProducts = result.products.filter(p => p.featured);
    if (featuredProducts.length > 0) {
      catalogText += `⭐ *PRODUK UNGGULAN*\n\n`;
      
      for (const product of featuredProducts.slice(0, 2)) {
        catalogText += this.formatProductCard(product, true);
        catalogText += `\n`;
      }
      
      catalogText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    }

    // Show regular products
    const regularProducts = result.products.filter(p => !p.featured);
    if (regularProducts.length > 0) {
      catalogText += `📋 *SEMUA PRODUK*\n\n`;
      
      for (const product of regularProducts.slice(0, 3)) {
        catalogText += this.formatProductCard(product, false);
        catalogText += `\n`;
      }
    }

    // Pagination info
    if (result.pagination.totalPages > 1) {
      catalogText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      catalogText += `📄 Halaman ${result.pagination.currentPage} dari ${result.pagination.totalPages}\n`;
      catalogText += `📊 Total: ${result.pagination.totalProducts} produk\n\n`;
      
      if (result.pagination.hasNext) {
        catalogText += `➡️ Ketik *produk hal ${result.pagination.currentPage + 1}* untuk halaman berikutnya\n`;
      }
    }

    // Navigation
    catalogText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    catalogText += `🔍 *Cara Berbelanja:*\n`;
    catalogText += `• Ketik *produk [nama]* untuk cari produk\n`;
    catalogText += `• Ketik *produk [ID]* untuk detail lengkap\n`;
    catalogText += `• Ketik *kategori* untuk lihat kategori\n\n`;
    catalogText += `🛒 Siap berbelanja? Hubungi admin untuk order!`;

    await message.reply(catalogText);

    // Send quick actions after delay
    setTimeout(async () => {
      await this.sendQuickActions(message);
    }, 1500);
  }

  /**
   * Format product card dengan WhatsApp Business style
   */
  formatProductCard(product, isFeatured = false) {
    const priceFormatted = this.productManager.formatPrice(product.price);
    const originalPriceFormatted = product.originalPrice 
      ? this.productManager.formatPrice(product.originalPrice) 
      : null;

    let card = ``;
    
    // Product header
    if (isFeatured) {
      card += `⭐ `;
    }
    card += `*${product.name}*\n`;
    
    // Price section
    if (originalPriceFormatted && product.originalPrice > product.price) {
      const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
      card += `💰 ${priceFormatted} `;
      card += `~${originalPriceFormatted}~ (-${discount}%)\n`;
    } else {
      card += `💰 ${priceFormatted}\n`;
    }

    // Description (truncated)
    const shortDesc = product.description.length > 80 
      ? product.description.substring(0, 80) + '...' 
      : product.description;
    card += `📝 ${shortDesc}\n`;

    // Stock info
    if (product.variants && product.variants.length > 0) {
      const totalStock = product.variants.reduce((sum, v) => sum + (v.stock || 0), 0);
      if (totalStock > 0) {
        card += `📦 Stok: ${totalStock} unit (${product.variants.length} varian)\n`;
      } else {
        card += `❌ Stok habis\n`;
      }
    }

    // Quick info
    if (product.condition === 'new') {
      card += `✨ Kondisi: Baru\n`;
    }
    
    if (product.warranty) {
      card += `🛡️ Garansi: ${product.warranty}\n`;
    }

    // Action button
    card += `\n🔍 Detail: *produk ${product.id}*\n`;
    card += `🛒 Order: *order ${product.id}*`;

    return card;
  }

  /**
   * Show product detail dengan format WhatsApp Business
   */
  async showProductDetail(message, productId) {
    const product = this.productManager.getProductById(productId);
    
    if (!product) {
      await message.reply('❌ Produk tidak ditemukan. Ketik *produk* untuk melihat katalog.');
      return;
    }

    let detailText = `🛍️ *DETAIL PRODUK*\n\n`;
    detailText += `┌─────────────────────────┐\n`;
    detailText += `│     📦 *${product.name}*\n`;
    detailText += `└─────────────────────────┘\n\n`;

    // Price section with discount
    const priceFormatted = this.productManager.formatPrice(product.price);
    if (product.originalPrice && product.originalPrice > product.price) {
      const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
      const originalPriceFormatted = this.productManager.formatPrice(product.originalPrice);
      detailText += `💰 *Harga: ${priceFormatted}*\n`;
      detailText += `🏷️ Harga Normal: ~${originalPriceFormatted}~\n`;
      detailText += `🎯 *HEMAT ${discount}%!*\n\n`;
    } else {
      detailText += `💰 *Harga: ${priceFormatted}*\n\n`;
    }

    // Description
    detailText += `📝 *Deskripsi:*\n${product.description}\n\n`;

    // Specifications
    if (product.specifications && Object.keys(product.specifications).length > 0) {
      detailText += `⚙️ *Spesifikasi:*\n`;
      Object.entries(product.specifications).forEach(([key, value]) => {
        detailText += `• ${key}: ${value}\n`;
      });
      detailText += `\n`;
    }

    // Variants
    if (product.variants && product.variants.length > 0) {
      detailText += `🎨 *Varian Tersedia:*\n`;
      product.variants.forEach((variant, index) => {
        const variantPrice = this.productManager.formatPrice(variant.price);
        const stockStatus = variant.stock > 0 ? `✅ ${variant.stock} unit` : '❌ Habis';
        detailText += `${index + 1}. ${variant.name} - ${variantPrice} (${stockStatus})\n`;
      });
      detailText += `\n`;
    }

    // Additional info
    detailText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    detailText += `📋 *Informasi Tambahan:*\n`;
    
    if (product.weight) {
      detailText += `⚖️ Berat: ${product.weight}\n`;
    }
    
    if (product.dimensions) {
      detailText += `📏 Dimensi: ${product.dimensions}\n`;
    }
    
    if (product.warranty) {
      detailText += `🛡️ Garansi: ${product.warranty}\n`;
    }
    
    detailText += `✨ Kondisi: ${product.condition === 'new' ? 'Baru' : 'Bekas'}\n`;
    
    if (product.tags && product.tags.length > 0) {
      detailText += `🏷️ Tags: ${product.tags.join(', ')}\n`;
    }

    // Order section
    detailText += `\n🛒 *CARA ORDER:*\n`;
    detailText += `1️⃣ Ketik: *order ${product.id}*\n`;
    detailText += `2️⃣ Atau hubungi admin langsung\n`;
    detailText += `3️⃣ Sebutkan varian yang diinginkan\n\n`;

    detailText += `📞 *Kontak Admin:* ketik *kontak*\n`;
    detailText += `🔙 *Kembali ke katalog:* ketik *produk*`;

    await message.reply(detailText);
  }

  /**
   * Send quick actions
   */
  async sendQuickActions(message) {
    const quickActionsText = `⚡ *AKSI CEPAT*\n\n` +
                           `🔍 *Cari Produk:*\n` +
                           `• ketik *produk smartphone*\n` +
                           `• ketik *produk batik*\n\n` +
                           `📂 *Kategori:*\n` +
                           `• ketik *kategori electronics*\n` +
                           `• ketik *kategori fashion*\n\n` +
                           `⭐ *Produk Unggulan:*\n` +
                           `• ketik *produk unggulan*\n\n` +
                           `🛒 *Bantuan Order:*\n` +
                           `• ketik *cara order*\n` +
                           `• ketik *kontak*`;

    await message.reply(quickActionsText);
  }

  /**
   * Search products
   */
  async searchProducts(message, query) {
    const result = this.productManager.searchProducts(query);
    
    if (result.products.length === 0) {
      await message.reply(`🔍 Tidak ditemukan produk dengan kata kunci "${query}".\n\n` +
                         `💡 *Coba kata kunci lain:*\n` +
                         `• smartphone, laptop, fashion\n` +
                         `• atau ketik *produk* untuk lihat semua`);
      return;
    }

    let searchText = `🔍 *HASIL PENCARIAN: "${query}"*\n\n`;
    searchText += `📊 Ditemukan ${result.products.length} produk\n\n`;
    searchText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    result.products.slice(0, 5).forEach((product, index) => {
      searchText += `${index + 1}. ${this.formatProductCard(product)}\n\n`;
    });

    if (result.products.length > 5) {
      searchText += `➕ Dan ${result.products.length - 5} produk lainnya...\n\n`;
    }

    searchText += `🔍 *Pencarian lebih spesifik:*\n`;
    searchText += `• ketik *produk ${query} murah*\n`;
    searchText += `• ketik *kategori* untuk filter kategori`;

    await message.reply(searchText);
  }

  /**
   * Show categories
   */
  async showCategories(message) {
    const categories = this.productManager.getAllCategories();
    const stats = this.productManager.getProductStats();

    let categoriesText = `📂 *KATEGORI PRODUK*\n\n`;
    categoriesText += `┌─────────────────────────┐\n`;
    categoriesText += `│    🗂️ *SEMUA KATEGORI*   │\n`;
    categoriesText += `└─────────────────────────┘\n\n`;

    stats.categoryStats.forEach((category, index) => {
      categoriesText += `${category.icon} *${category.name}*\n`;
      categoriesText += `📝 ${category.description}\n`;
      categoriesText += `📦 ${category.productCount} produk tersedia\n`;
      categoriesText += `🔍 Lihat: *kategori ${category.id}*\n\n`;
    });

    categoriesText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    categoriesText += `📊 *Ringkasan:*\n`;
    categoriesText += `• Total Kategori: ${stats.totalCategories}\n`;
    categoriesText += `• Total Produk: ${stats.totalProducts}\n`;
    categoriesText += `• Produk Unggulan: ${stats.featuredProducts}\n\n`;
    categoriesText += `🔙 Kembali ke katalog: ketik *produk*`;

    await message.reply(categoriesText);
  }

  /**
   * Show products by category
   */
  async showCategoryProducts(message, categoryId) {
    const result = this.productManager.getAllProducts({ category: categoryId });
    const categories = this.productManager.getAllCategories();
    const category = categories.find(c => c.id === categoryId);

    if (!category) {
      await message.reply('❌ Kategori tidak ditemukan. Ketik *kategori* untuk melihat daftar kategori.');
      return;
    }

    if (result.products.length === 0) {
      await message.reply(`📂 Kategori "${category.name}" belum memiliki produk.\n\n` +
                         `🔙 Kembali ke kategori: ketik *kategori*`);
      return;
    }

    let categoryText = `${category.icon} *${category.name.toUpperCase()}*\n\n`;
    categoryText += `📝 ${category.description}\n\n`;
    categoryText += `📦 ${result.products.length} produk tersedia\n\n`;
    categoryText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    result.products.slice(0, 4).forEach((product, index) => {
      categoryText += `${index + 1}. ${this.formatProductCard(product)}\n\n`;
    });

    if (result.products.length > 4) {
      categoryText += `➕ Dan ${result.products.length - 4} produk lainnya...\n\n`;
    }

    categoryText += `🔍 *Pencarian dalam kategori:*\n`;
    categoryText += `• ketik *produk ${categoryId} [kata kunci]*\n\n`;
    categoryText += `📂 Kategori lain: ketik *kategori*\n`;
    categoryText += `🔙 Semua produk: ketik *produk*`;

    await message.reply(categoryText);
  }

  /**
   * Handle add product flow (untuk admin)
   */
  async handleAddProductFlow(message) {
    // Simple add product instruction
    const addProductText = `➕ *TAMBAH PRODUK BARU*\n\n` +
                          `📋 *Format untuk menambah produk:*\n\n` +
                          `*add produk*\n` +
                          `Nama: [Nama Produk]\n` +
                          `Kategori: [electronics/fashion/home]\n` +
                          `Harga: [Harga dalam Rupiah]\n` +
                          `Deskripsi: [Deskripsi produk]\n\n` +
                          `📝 *Contoh:*\n` +
                          `*add produk*\n` +
                          `Nama: iPhone 15 Pro\n` +
                          `Kategori: electronics\n` +
                          `Harga: 18999000\n` +
                          `Deskripsi: iPhone terbaru dengan kamera 48MP\n\n` +
                          `⚠️ *Catatan:* Fitur ini hanya untuk admin`;

    await message.reply(addProductText);
  }
}

module.exports = ProductHandler;
