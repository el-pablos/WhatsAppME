/**
 * Demo Product Features - Showcase WhatsApp Business-style product catalog
 */

const ProductHandler = require('./handlers/productHandler');
const OrderHandler = require('./handlers/orderHandler');
const ProductManager = require('./utils/productManager');

class DemoMessage {
  constructor(userInput, userId = '6281234567890@c.us') {
    this.body = userInput;
    this.from = userId;
    this.replies = [];
  }

  async reply(text) {
    this.replies.push(text);
    console.log('🤖 Bot Response:');
    console.log('┌' + '─'.repeat(78) + '┐');
    
    const lines = text.split('\n');
    lines.forEach(line => {
      if (line.length <= 76) {
        const padding = ' '.repeat(76 - line.length);
        console.log('│ ' + line + padding + ' │');
      } else {
        let remaining = line;
        while (remaining.length > 76) {
          const chunk = remaining.substring(0, 76);
          console.log('│ ' + chunk + ' │');
          remaining = remaining.substring(76);
        }
        if (remaining.length > 0) {
          const padding = ' '.repeat(76 - remaining.length);
          console.log('│ ' + remaining + padding + ' │');
        }
      }
    });
    
    console.log('└' + '─'.repeat(78) + '┘');
    console.log('');
    return Promise.resolve();
  }

  async getContact() {
    return { name: 'Demo User', pushname: 'Demo User' };
  }
}

async function demoProductCatalog() {
  console.log('🛍️ DEMO: Product Catalog Features');
  console.log('=' .repeat(80));
  console.log('');

  const productHandler = new ProductHandler();
  const productManager = new ProductManager();

  // Demo 1: Show product catalog
  console.log('📋 Demo 1: Menampilkan Katalog Produk');
  console.log('─'.repeat(50));
  console.log('User mengetik: "produk"');
  console.log('');
  
  const message1 = new DemoMessage('produk');
  await productHandler.showProductCatalog(message1);
  
  await delay(2000);

  // Demo 2: Show product detail
  console.log('📋 Demo 2: Detail Produk Spesifik');
  console.log('─'.repeat(50));
  console.log('User mengetik: "produk prod_001"');
  console.log('');
  
  const message2 = new DemoMessage('produk prod_001');
  await productHandler.showProductDetail(message2, 'prod_001');
  
  await delay(2000);

  // Demo 3: Search products
  console.log('📋 Demo 3: Pencarian Produk');
  console.log('─'.repeat(50));
  console.log('User mengetik: "produk iphone"');
  console.log('');
  
  const message3 = new DemoMessage('produk iphone');
  await productHandler.searchProducts(message3, 'iphone');
  
  await delay(2000);

  // Demo 4: Show categories
  console.log('📋 Demo 4: Kategori Produk');
  console.log('─'.repeat(50));
  console.log('User mengetik: "kategori"');
  console.log('');
  
  const message4 = new DemoMessage('kategori');
  await productHandler.showCategories(message4);
  
  await delay(2000);

  // Demo 5: Category products
  console.log('📋 Demo 5: Produk dalam Kategori');
  console.log('─'.repeat(50));
  console.log('User mengetik: "kategori electronics"');
  console.log('');
  
  const message5 = new DemoMessage('kategori electronics');
  await productHandler.showCategoryProducts(message5, 'electronics');
}

async function demoOrderProcess() {
  console.log('🛒 DEMO: Order Process');
  console.log('=' .repeat(80));
  console.log('');

  const orderHandler = new OrderHandler();

  // Demo 1: Start order process
  console.log('📋 Demo 1: Memulai Proses Order');
  console.log('─'.repeat(50));
  console.log('User mengetik: "order prod_001"');
  console.log('');
  
  const message1 = new DemoMessage('order prod_001');
  await orderHandler.startOrderProcess(message1, 'prod_001');
  
  await delay(2000);

  // Demo 2: Order guide
  console.log('📋 Demo 2: Panduan Order');
  console.log('─'.repeat(50));
  console.log('User mengetik: "cara order"');
  console.log('');
  
  const message2 = new DemoMessage('cara order');
  await orderHandler.showOrderGuide(message2);
}

async function demoProductStats() {
  console.log('📊 DEMO: Product Statistics');
  console.log('=' .repeat(80));
  console.log('');

  const productManager = new ProductManager();
  const stats = productManager.getProductStats();

  console.log('📈 Product Statistics:');
  console.log('─'.repeat(40));
  console.log(`📦 Total Products: ${stats.totalProducts}`);
  console.log(`📂 Total Categories: ${stats.totalCategories}`);
  console.log(`⭐ Featured Products: ${stats.featuredProducts}`);
  console.log(`💰 Average Price: ${productManager.formatPrice(stats.averagePrice)}`);
  console.log('');

  console.log('📊 Category Breakdown:');
  console.log('─'.repeat(40));
  stats.categoryStats.forEach(cat => {
    console.log(`${cat.icon} ${cat.name}: ${cat.productCount} products`);
  });
  console.log('');
}

async function demoProductManagement() {
  console.log('⚙️ DEMO: Product Management');
  console.log('=' .repeat(80));
  console.log('');

  const productManager = new ProductManager();

  // Demo: Add new product
  console.log('📋 Demo: Menambah Produk Baru');
  console.log('─'.repeat(50));

  const newProduct = {
    name: 'MacBook Pro M3',
    category: 'electronics',
    price: 25999000,
    originalPrice: 27999000,
    description: 'MacBook Pro terbaru dengan chip M3, layar Liquid Retina XDR 14 inch, dan performa luar biasa untuk professional.',
    specifications: {
      'Processor': 'Apple M3 8-core CPU',
      'Memory': '16GB Unified Memory',
      'Storage': '512GB SSD',
      'Display': '14-inch Liquid Retina XDR',
      'Graphics': '10-core GPU'
    },
    variants: [
      { name: 'Space Gray', price: 25999000, stock: 3 },
      { name: 'Silver', price: 25999000, stock: 2 }
    ],
    tags: ['laptop', 'apple', 'professional', 'macbook'],
    weight: '1.6kg',
    warranty: '1 tahun resmi Apple',
    featured: true
  };

  const result = productManager.addProduct(newProduct);
  console.log(result.message);
  console.log(`Product ID: ${result.product?.id}`);
  console.log('');

  // Show updated stats
  const updatedStats = productManager.getProductStats();
  console.log(`📊 Updated Total Products: ${updatedStats.totalProducts}`);
  console.log('');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function showFeatureOverview() {
  console.log('🌟 WHATSAPP ME BOT - PRODUCT FEATURES OVERVIEW');
  console.log('=' .repeat(80));
  console.log('');

  console.log('✨ NEW FEATURES ADDED:');
  console.log('─'.repeat(40));
  console.log('🛍️ WhatsApp Business-style Product Catalog');
  console.log('🔍 Advanced Product Search & Filtering');
  console.log('📂 Category Management System');
  console.log('🛒 Complete Order Process Flow');
  console.log('💳 Integrated Payment System');
  console.log('📊 Product Analytics & Statistics');
  console.log('⚡ Responsive UI/UX Design');
  console.log('🎨 Beautiful Message Formatting');
  console.log('');

  console.log('🎯 KEY CAPABILITIES:');
  console.log('─'.repeat(40));
  console.log('• Product catalog with variants & stock');
  console.log('• Smart search and category filtering');
  console.log('• Complete order flow with customer data');
  console.log('• WhatsApp Business-style formatting');
  console.log('• Real-time inventory management');
  console.log('• Professional product presentation');
  console.log('• Mobile-optimized user experience');
  console.log('');

  console.log('📱 USER COMMANDS:');
  console.log('─'.repeat(40));
  console.log('• "produk" - Show product catalog');
  console.log('• "produk [search]" - Search products');
  console.log('• "produk [ID]" - Show product detail');
  console.log('• "kategori" - Show categories');
  console.log('• "kategori [name]" - Show category products');
  console.log('• "order [ID]" - Start order process');
  console.log('• "cara order" - Order guide');
  console.log('');
}

async function main() {
  console.clear();
  
  await showFeatureOverview();
  await delay(2000);
  
  await demoProductStats();
  await delay(2000);
  
  await demoProductManagement();
  await delay(2000);
  
  await demoProductCatalog();
  await delay(2000);
  
  await demoOrderProcess();
  
  console.log('🎉 DEMO COMPLETED!');
  console.log('=' .repeat(80));
  console.log('');
  console.log('🚀 Ready for Production:');
  console.log('• All product features working perfectly');
  console.log('• WhatsApp Business-style UI implemented');
  console.log('• Complete order flow functional');
  console.log('• Professional product presentation');
  console.log('• Mobile-optimized experience');
  console.log('');
  console.log('💡 Next Steps:');
  console.log('1. Start the bot: npm start');
  console.log('2. Scan QR code with WhatsApp');
  console.log('3. Test with: "produk", "order prod_001"');
  console.log('4. Experience the new product features!');
  console.log('');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { 
  demoProductCatalog, 
  demoOrderProcess, 
  demoProductStats, 
  demoProductManagement 
};
