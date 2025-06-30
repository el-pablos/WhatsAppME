/**
 * Product Manager - Mengelola produk dan katalog
 */

const fs = require('fs-extra');
const path = require('path');

class ProductManager {
  constructor() {
    this.dataFile = './data/products.json';
    this.data = this.loadProductData();
  }

  /**
   * Load product data dari file JSON
   */
  loadProductData() {
    try {
      if (!fs.existsSync(this.dataFile)) {
        const defaultData = {
          categories: [],
          products: [],
          settings: {
            currency: 'IDR',
            currencySymbol: 'Rp',
            showPrices: true,
            showStock: true,
            showVariants: true,
            maxProductsPerPage: 5,
            enableWishlist: true,
            enableCompare: true,
            autoGenerateId: true,
            lastProductId: 0
          }
        };
        this.saveProductData(defaultData);
        return defaultData;
      }
      return fs.readJsonSync(this.dataFile);
    } catch (error) {
      console.error('❌ Error loading product data:', error);
      return { categories: [], products: [], settings: {} };
    }
  }

  /**
   * Save product data ke file JSON
   */
  saveProductData(data = null) {
    try {
      const dataToSave = data || this.data;
      fs.ensureDirSync(path.dirname(this.dataFile));
      fs.writeJsonSync(this.dataFile, dataToSave, { spaces: 2 });
    } catch (error) {
      console.error('❌ Error saving product data:', error);
    }
  }

  /**
   * Generate product ID otomatis
   */
  generateProductId() {
    if (this.data.settings.autoGenerateId) {
      this.data.settings.lastProductId++;
      return `prod_${String(this.data.settings.lastProductId).padStart(3, '0')}`;
    }
    return `prod_${Date.now()}`;
  }

  /**
   * Add new product
   */
  addProduct(productData) {
    try {
      const product = {
        id: productData.id || this.generateProductId(),
        name: productData.name,
        category: productData.category,
        price: parseInt(productData.price),
        originalPrice: productData.originalPrice ? parseInt(productData.originalPrice) : null,
        currency: productData.currency || this.data.settings.currency,
        description: productData.description,
        images: productData.images || [],
        specifications: productData.specifications || {},
        variants: productData.variants || [],
        tags: productData.tags || [],
        weight: productData.weight || '',
        dimensions: productData.dimensions || '',
        warranty: productData.warranty || '',
        condition: productData.condition || 'new',
        featured: productData.featured || false,
        active: productData.active !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.data.products.push(product);
      this.saveProductData();
      
      return {
        success: true,
        product: product,
        message: `✅ Produk "${product.name}" berhasil ditambahkan!`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '❌ Gagal menambahkan produk!'
      };
    }
  }

  /**
   * Get all products
   */
  getAllProducts(options = {}) {
    let products = this.data.products.filter(p => p.active);

    // Filter by category
    if (options.category) {
      products = products.filter(p => p.category === options.category);
    }

    // Filter by featured
    if (options.featured) {
      products = products.filter(p => p.featured);
    }

    // Search by name or tags
    if (options.search) {
      const searchTerm = options.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    // Sort products
    if (options.sortBy) {
      switch (options.sortBy) {
        case 'price_asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'newest':
          products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          // Featured first, then by creation date
          products.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
      }
    }

    // Pagination
    const page = options.page || 1;
    const limit = options.limit || this.data.settings.maxProductsPerPage;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      products: products.slice(startIndex, endIndex),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(products.length / limit),
        totalProducts: products.length,
        hasNext: endIndex < products.length,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Get product by ID
   */
  getProductById(productId) {
    return this.data.products.find(p => p.id === productId && p.active);
  }

  /**
   * Get all categories
   */
  getAllCategories() {
    return this.data.categories.filter(c => c.active);
  }

  /**
   * Add new category
   */
  addCategory(categoryData) {
    try {
      const category = {
        id: categoryData.id || categoryData.name.toLowerCase().replace(/\s+/g, '_'),
        name: categoryData.name,
        description: categoryData.description || '',
        icon: categoryData.icon || '📦',
        active: categoryData.active !== false
      };

      // Check if category already exists
      const existingCategory = this.data.categories.find(c => c.id === category.id);
      if (existingCategory) {
        return {
          success: false,
          message: '❌ Kategori sudah ada!'
        };
      }

      this.data.categories.push(category);
      this.saveProductData();
      
      return {
        success: true,
        category: category,
        message: `✅ Kategori "${category.name}" berhasil ditambahkan!`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '❌ Gagal menambahkan kategori!'
      };
    }
  }

  /**
   * Update product
   */
  updateProduct(productId, updateData) {
    try {
      const productIndex = this.data.products.findIndex(p => p.id === productId);
      if (productIndex === -1) {
        return {
          success: false,
          message: '❌ Produk tidak ditemukan!'
        };
      }

      // Update product data
      this.data.products[productIndex] = {
        ...this.data.products[productIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      this.saveProductData();
      
      return {
        success: true,
        product: this.data.products[productIndex],
        message: `✅ Produk "${this.data.products[productIndex].name}" berhasil diupdate!`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '❌ Gagal mengupdate produk!'
      };
    }
  }

  /**
   * Delete product (soft delete)
   */
  deleteProduct(productId) {
    try {
      const productIndex = this.data.products.findIndex(p => p.id === productId);
      if (productIndex === -1) {
        return {
          success: false,
          message: '❌ Produk tidak ditemukan!'
        };
      }

      const productName = this.data.products[productIndex].name;
      this.data.products[productIndex].active = false;
      this.data.products[productIndex].updatedAt = new Date().toISOString();

      this.saveProductData();
      
      return {
        success: true,
        message: `✅ Produk "${productName}" berhasil dihapus!`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: '❌ Gagal menghapus produk!'
      };
    }
  }

  /**
   * Format price to currency
   */
  formatPrice(price, currency = null) {
    const curr = currency || this.data.settings.currency;
    const symbol = this.data.settings.currencySymbol;
    
    if (curr === 'IDR') {
      return `${symbol} ${price.toLocaleString('id-ID')}`;
    }
    
    return `${symbol} ${price.toLocaleString()}`;
  }

  /**
   * Get product statistics
   */
  getProductStats() {
    const activeProducts = this.data.products.filter(p => p.active);
    const featuredProducts = activeProducts.filter(p => p.featured);
    const categories = this.data.categories.filter(c => c.active);

    const categoryStats = categories.map(cat => ({
      ...cat,
      productCount: activeProducts.filter(p => p.category === cat.id).length
    }));

    return {
      totalProducts: activeProducts.length,
      totalCategories: categories.length,
      featuredProducts: featuredProducts.length,
      categoryStats: categoryStats,
      averagePrice: activeProducts.length > 0 
        ? Math.round(activeProducts.reduce((sum, p) => sum + p.price, 0) / activeProducts.length)
        : 0
    };
  }

  /**
   * Search products
   */
  searchProducts(query, options = {}) {
    return this.getAllProducts({
      ...options,
      search: query
    });
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(limit = 3) {
    return this.getAllProducts({
      featured: true,
      limit: limit
    });
  }
}

module.exports = ProductManager;
