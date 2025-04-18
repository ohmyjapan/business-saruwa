<template>
  <div class="admin-products-page">
    <!-- Header section with actions -->
    <div class="header-actions">
      <h1 class="page-title">Products</h1>
      <button class="btn-primary">
        <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add Product
      </button>
    </div>

    <!-- Filter section -->
    <div class="filter-section">
      <!-- Search -->
      <div class="search-box">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
        <input type="text" placeholder="Search products..." />
      </div>

      <!-- Filter dropdowns -->
      <div class="filter-controls">
        <select>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="kitchen">Kitchen</option>
        </select>

        <select>
          <option value="">All Stock Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

        <button class="btn-outline">Clear Filters</button>
      </div>
    </div>

    <!-- Products table -->
    <div class="products-table">
      <table>
        <thead>
        <tr>
          <th>PRODUCT</th>
          <th>SKU / JAN CODE</th>
          <th>CATEGORY</th>
          <th>PRICE</th>
          <th>STOCK</th>
          <th>STATUS</th>
          <th>ACTION</th>
        </tr>
        </thead>
        <tbody>
        <!-- Test products -->
        <tr v-for="product in products" :key="product.id">
          <td class="product-cell">
            <div class="product-info">
              <div class="product-image" v-if="product.image">
                <img :src="product.image" :alt="product.name" />
              </div>
              <div class="product-text">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-brand">{{ product.brand }}</div>
              </div>
            </div>
          </td>
          <td>{{ product.sku }}</td>
          <td>{{ product.category }}</td>
          <td>{{ formatPrice(product.price) }}</td>
          <td>
            <span :class="getStockClass(product.stock)">{{ product.stock }}</span>
          </td>
          <td>
            <span :class="getStatusClass(product.status)">{{ product.status }}</span>
          </td>
          <td>
            <div class="action-buttons">
              <button class="action-btn edit-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                </svg>
              </button>
              <button class="action-btn delete-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                  <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <div class="pagination-info">
        Showing 1 to {{ products.length }} of {{ totalProducts }} results
      </div>
      <div class="pagination-controls">
        <button class="pagination-btn prev-btn" :disabled="currentPage === 1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
        </button>
        <button class="pagination-btn" :class="{ active: currentPage === 1 }">1</button>
        <button class="pagination-btn" :class="{ active: currentPage === 2 }">2</button>
        <button class="pagination-btn next-btn" :disabled="currentPage === totalPages">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

// Tell Nuxt to use the admin layout
definePageMeta({
  layout: 'admin'
});

// Page state
const currentPage = ref(1);
const totalPages = ref(2);
const totalProducts = ref(20);

// Sample products data
const products = reactive([
  {
    id: 1,
    name: 'Wireless Headphones',
    brand: 'AudioTech',
    sku: 'AUDIO-WH-001',
    janCode: '4901234567890',
    image: null, // Using null for demo since we don't have actual images
    category: 'Electronics',
    price: 12800,
    stock: 45,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Smart Watch Series 5',
    brand: 'TechGear',
    sku: 'TECH-SW-005',
    janCode: '4901234567891',
    image: null,
    category: 'Electronics',
    price: 32500,
    stock: 12,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Professional Kitchen Knife Set',
    brand: 'ChefPro',
    sku: 'CHEF-KS-010',
    janCode: '4901234567892',
    image: null,
    category: 'Kitchen',
    price: 19800,
    stock: 25,
    status: 'Active'
  },
  {
    id: 4,
    name: 'Gaming Laptop 15"',
    brand: 'PowerGame',
    sku: 'GAME-LT-001',
    janCode: '4901234567893',
    image: null,
    category: 'Electronics',
    price: 129000,
    stock: 8,
    status: 'Low Stock'
  },
  {
    id: 5,
    name: 'Organic Cotton T-Shirt',
    brand: 'EcoWear',
    sku: 'ECO-TS-M-BLK',
    janCode: '4901234567894',
    image: null,
    category: 'Clothing',
    price: 3500,
    stock: 120,
    status: 'Active'
  },
  {
    id: 6,
    name: 'Bluetooth Speaker',
    brand: 'SoundBox',
    sku: 'SOUND-BS-001',
    janCode: '4901234567895',
    image: null,
    category: 'Electronics',
    price: 8500,
    stock: 0,
    status: 'Out of Stock'
  },
  {
    id: 7,
    name: 'Stainless Steel Water Bottle',
    brand: 'EcoLife',
    sku: 'ECO-WB-001',
    janCode: '4901234567896',
    image: null,
    category: 'Kitchen',
    price: 2800,
    stock: 75,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Premium Yoga Mat',
    brand: 'ZenFit',
    sku: 'ZEN-YM-001',
    janCode: '4901234567897',
    image: null,
    category: 'Sports',
    price: 4800,
    stock: 30,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Mechanical Keyboard',
    brand: 'TypeMaster',
    sku: 'TYPE-KB-001',
    janCode: '4901234567898',
    image: null,
    category: 'Electronics',
    price: 14500,
    stock: 18,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Winter Jacket',
    brand: 'NorthStyle',
    sku: 'NORTH-WJ-M-BLU',
    janCode: '4901234567899',
    image: null,
    category: 'Clothing',
    price: 18000,
    stock: 5,
    status: 'Low Stock'
  }
]);

// Format price to JPY
const formatPrice = (price) => {
  return `¥${price.toLocaleString()}`;
};

// Get class for stock status
const getStockClass = (stock) => {
  if (stock === 0) return 'stock-status out-of-stock';
  if (stock <= 10) return 'stock-status low-stock';
  return 'stock-status in-stock';
};

// Get class for product status
const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'active': return 'status-badge active';
    case 'inactive': return 'status-badge inactive';
    case 'out of stock': return 'status-badge out-of-stock';
    case 'low stock': return 'status-badge low-stock';
    default: return 'status-badge';
  }
};
</script>

<style scoped>
.admin-products-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;
  min-height: calc(100vh - 4rem); /* Subtract header height */
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.btn-primary {
  display: flex;
  align-items: center;
  background-color: #0ea5e9;
  color: white;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0284c7;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.5rem;
  background-color: white;
  border-radius: 0.375rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  height: 1.25rem;
  width: 1.25rem;
  color: #94a3b8;
}

.search-box input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.filter-controls {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-controls select {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  min-width: 150px;
}

.btn-outline {
  background-color: white;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #64748b;
  cursor: pointer;
}

.btn-outline:hover {
  background-color: #f8fafc;
}

.products-table {
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  flex: 1;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

td {
  padding: 1rem;
  font-size: 0.875rem;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
}

tr:last-child td {
  border-bottom: none;
}

.product-cell {
  min-width: 250px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.product-image {
  width: 3rem;
  height: 3rem;
  background-color: #f1f5f9;
  border-radius: 0.25rem;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-text {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.product-brand {
  font-size: 0.75rem;
  color: #64748b;
}

.stock-status {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  display: inline-block;
}

.in-stock {
  background-color: #dcfce7;
  color: #166534;
}

.low-stock {
  background-color: #fef9c3;
  color: #854d0e;
}

.out-of-stock {
  background-color: #fee2e2;
  color: #991b1b;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  display: inline-block;
}

.active {
  background-color: #dbeafe;
  color: #1e40af;
}

.inactive {
  background-color: #e2e8f0;
  color: #475569;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}

.edit-btn {
  background-color: #dbeafe;
  color: #1e40af;
}

.edit-btn:hover {
  background-color: #bfdbfe;
}

.delete-btn {
  background-color: #fee2e2;
  color: #991b1b;
}

.delete-btn:hover {
  background-color: #fecaca;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 0;
}

.pagination-info {
  font-size: 0.875rem;
  color: #64748b;
}

.pagination-controls {
  display: flex;
  gap: 0.25rem;
}

.pagination-btn {
  min-width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  border: 1px solid #e2e8f0;
  background-color: white;
  font-size: 0.875rem;
  color: #1e293b;
  cursor: pointer;
  padding: 0 0.5rem;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f8fafc;
}

.pagination-btn.active {
  background-color: #0ea5e9;
  color: white;
  border-color: #0ea5e9;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>