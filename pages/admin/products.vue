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
        <input type="text" v-model="searchQuery" placeholder="Search products..." />
      </div>

      <!-- Filter dropdowns -->
      <div class="filter-controls">
        <select v-model="categoryFilter">
          <option value="">All Categories</option>
          <option v-for="category in availableCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>

        <select v-model="stockFilter">
          <option value="">All Stock Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

        <button class="btn-outline" @click="clearFilters">Clear Filters</button>
      </div>
    </div>

    <!-- Products table -->
    <div class="products-table">
      <table>
        <thead>
        <tr>
          <th>IMAGE</th>
          <th>ID</th>
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
          <!-- Product image column with hover enlargement -->
          <td class="product-image-cell">
            <div class="product-thumbnail">
              <div v-if="product.image" class="image-container image-hover">
                <img :src="product.image" :alt="product.name" />
                <div class="enlarged-image">
                  <img :src="product.image" :alt="product.name" />
                </div>
              </div>
              <div v-else class="image-placeholder image-hover">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div class="enlarged-image enlarged-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-16 h-16">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </td>

          <!-- Product ID column -->
          <td class="product-id-cell">
            #{{ product.id.toString().padStart(6, '0') }}
          </td>

          <td class="product-cell">
            <div class="product-text">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-brand">{{ product.brand }}</div>
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
              <button @click="editProduct(product.id)" class="action-btn edit-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                </svg>
              </button>
              <button class="action-btn delete-btn" @click="confirmDelete(product)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                  <path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6z" />
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
        <button class="pagination-btn prev-btn" :disabled="currentPage === 1" @click="prevPage">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
        </button>
        <button class="pagination-btn" :class="{ active: currentPage === 1 }" @click="goToPage(1)">1</button>
        <button class="pagination-btn" :class="{ active: currentPage === 2 }" @click="goToPage(2)">2</button>
        <button class="pagination-btn next-btn" :disabled="currentPage === totalPages" @click="nextPage">
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
import { useRouter } from 'vue-router';

// Tell Nuxt to use the admin layout
definePageMeta({
  layout: 'admin'
});

const router = useRouter();

// Page state
const currentPage = ref(1);
const totalPages = ref(2);
const totalProducts = ref(20);
const searchQuery = ref('');
const categoryFilter = ref('');
const stockFilter = ref('');

// Available categories for filter
const availableCategories = [
  'Electronics',
  'Kitchen',
  'Clothing',
  'Sports'
];

// Sample products data - IMPORTANT: Using STRING IDs, not numbers
const products = reactive([
  {
    id: "1", // Using string ID format
    name: 'Wireless Headphones',
    brand: 'AudioTech',
    sku: 'AUDIO-WH-001',
    janCode: '4901234567890',
    image: 'https://placehold.co/400x300/3498db/fff?text=Headphones', // Fixed URL
    category: 'Electronics',
    price: 12800,
    stock: 45,
    status: 'Active'
  },
  {
    id: "2", // Using string ID format
    name: 'Smart Watch Series 5',
    brand: 'TechGear',
    sku: 'TECH-SW-005',
    janCode: '4901234567891',
    image: 'https://placehold.co/400x300/2ecc71/fff?text=Watch', // Fixed URL
    category: 'Electronics',
    price: 32500,
    stock: 12,
    status: 'Active'
  },
  {
    id: "3", // Using string ID format
    name: 'Professional Kitchen Knife Set',
    brand: 'ChefPro',
    sku: 'CHEF-KS-010',
    janCode: '4901234567892',
    image: 'https://placehold.co/400x300/e74c3c/fff?text=Knife+Set', // Fixed URL
    category: 'Kitchen',
    price: 19800,
    stock: 25,
    status: 'Active'
  },
  {
    id: "4", // Using string ID format
    name: 'Gaming Laptop 15"',
    brand: 'PowerGame',
    sku: 'GAME-LT-001',
    janCode: '4901234567893',
    image: 'https://placehold.co/400x300/9b59b6/fff?text=Laptop', // Fixed URL
    category: 'Electronics',
    price: 129000,
    stock: 8,
    status: 'Low Stock'
  },
  {
    id: "5", // Using string ID format
    name: 'Organic Cotton T-Shirt',
    brand: 'EcoWear',
    sku: 'ECO-TS-M-BLK',
    janCode: '4901234567894',
    image: 'https://placehold.co/400x300/f1c40f/fff?text=T-Shirt', // Fixed URL
    category: 'Clothing',
    price: 3500,
    stock: 120,
    status: 'Active'
  },
  {
    id: "6", // Using string ID format
    name: 'Bluetooth Speaker',
    brand: 'SoundBox',
    sku: 'SOUND-BS-001',
    janCode: '4901234567895',
    image: null, // Example without image
    category: 'Electronics',
    price: 8500,
    stock: 0,
    status: 'Out of Stock'
  },
  {
    id: "7", // Using string ID format
    name: 'Stainless Steel Water Bottle',
    brand: 'EcoLife',
    sku: 'ECO-WB-001',
    janCode: '4901234567896',
    image: 'https://placehold.co/400x300/1abc9c/fff?text=Water+Bottle', // Fixed URL
    category: 'Kitchen',
    price: 2800,
    stock: 75,
    status: 'Active'
  },
  {
    id: "8", // Using string ID format
    name: 'Premium Yoga Mat',
    brand: 'ZenFit',
    sku: 'ZEN-YM-001',
    janCode: '4901234567897',
    image: 'https://placehold.co/400x300/34495e/fff?text=Yoga+Mat', // Fixed URL
    category: 'Sports',
    price: 4800,
    stock: 30,
    status: 'Active'
  },
  {
    id: "9", // Using string ID format
    name: 'Mechanical Keyboard',
    brand: 'TypeMaster',
    sku: 'TYPE-KB-001',
    janCode: '4901234567898',
    image: 'https://placehold.co/400x300/e67e22/fff?text=Keyboard', // Fixed URL
    category: 'Electronics',
    price: 14500,
    stock: 18,
    status: 'Active'
  },
  {
    id: "10", // Using string ID format
    name: 'Winter Jacket',
    brand: 'NorthStyle',
    sku: 'NORTH-WJ-M-BLU',
    janCode: '4901234567899',
    image: 'https://placehold.co/400x300/3498db/fff?text=Jacket', // Fixed URL
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

// Navigate to product detail page with router.push
const editProduct = (id) => {
  console.log(`Navigating to product: ${id}`);

  // Ensure ID is a string
  const stringId = String(id);
  console.log(`ID as string: ${stringId}, Type: ${typeof stringId}`);

  // Store products in localStorage before navigating
  localStorage.setItem('adminProducts', JSON.stringify(products));
  console.log('Products saved to localStorage');

  // Use simpler router.push syntax
  router.push(`/admin/product-detail/${stringId}`);
};

// Confirm delete function
const confirmDelete = (product) => {
  if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
    console.log("Deleting product:", product.id);
    // In a real app, you would call an API to delete the product
    // For now, we just log the action
  }
};

// Pagination functions
const goToPage = (page) => {
  currentPage.value = page;
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Clear filters
const clearFilters = () => {
  searchQuery.value = '';
  categoryFilter.value = '';
  stockFilter.value = '';
};

// Mount actions
onMounted(() => {
  console.log("Admin products page mounted");
  console.log("Product IDs:", products.map(p => ({
    id: p.id,
    type: typeof p.id
  })));

  // Store products in localStorage on page load
  localStorage.setItem('adminProducts', JSON.stringify(products));
});
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

/* Enhanced styles for image and ID columns */
.product-image-cell {
  width: 6rem;
  padding: 0.5rem;
}

.product-thumbnail {
  width: 4rem;
  height: 4rem;
  background-color: #f1f5f9;
  border-radius: 0.25rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease-in-out;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  position: relative;
}

/* Hover effects for images */
.image-hover {
  position: relative;
  cursor: pointer;
}

.enlarged-image {
  position: absolute;
  top: -10px;
  left: 100%;
  width: 200px;
  height: 200px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.enlarged-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.enlarged-placeholder {
  background-color: #f1f5f9;
}

.image-hover:hover .enlarged-image {
  opacity: 1;
  pointer-events: auto;
}

.product-id-cell {
  font-family: monospace;
  color: #64748b;
  font-size: 0.875rem;
}

.product-cell {
  min-width: 200px;
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