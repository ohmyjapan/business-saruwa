<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-secondary-900">Products</h1>
      <div class="flex space-x-3">
        <button @click="navigateTo('/admin/products/create')" class="btn-primary flex items-center">
          <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
        <button @click="navigateTo('/admin/import')" class="btn-secondary flex items-center">
          <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Bulk Import
        </button>
      </div>
    </div>

    <!-- Product Filters -->
    <div class="bg-white rounded-card shadow-card p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <!-- Category Filter -->
        <div class="w-full sm:w-auto">
          <label for="categoryFilter" class="form-label">Category</label>
          <select
              id="categoryFilter"
              v-model="filters.category"
              class="form-select"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Brand Filter -->
        <div class="w-full sm:w-auto">
          <label for="brandFilter" class="form-label">Brand</label>
          <select
              id="brandFilter"
              v-model="filters.brand"
              class="form-select"
          >
            <option value="">All Brands</option>
            <option v-for="brand in brands" :key="brand" :value="brand">
              {{ brand }}
            </option>
          </select>
        </div>

        <!-- Stock Filter -->
        <div class="w-full sm:w-auto">
          <label for="stockFilter" class="form-label">Stock</label>
          <select
              id="stockFilter"
              v-model="filters.stock"
              class="form-select"
          >
            <option value="">All Products</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Out of Stock</option>
            <option value="low-stock">Low Stock (&lt;10)</option>
          </select>
        </div>

        <!-- Search -->
        <div class="w-full sm:flex-1">
          <label for="searchFilter" class="form-label">Search</label>
          <div class="relative">
            <input
                id="searchFilter"
                v-model="filters.search"
                type="text"
                placeholder="Search products..."
                class="form-input pl-10 w-full"
            >
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-secondary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Clear Filters Button -->
        <div class="flex items-end w-full sm:w-auto">
          <button
              @click="clearFilters"
              class="btn-outline px-4 py-2 w-full sm:w-auto"
              :disabled="!hasActiveFilters"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div v-if="!loading" class="bg-white rounded-card shadow-card overflow-hidden">
      <div class="table-container">
        <table class="table">
          <thead class="table-header">
          <tr>
            <th class="table-header-cell w-16"></th>
            <th class="table-header-cell">Product</th>
            <th class="table-header-cell">JAN Code</th>
            <th class="table-header-cell">SKU</th>
            <th class="table-header-cell">Price</th>
            <th class="table-header-cell">Stock</th>
            <th class="table-header-cell">Status</th>
            <th class="table-header-cell w-24">Actions</th>
          </tr>
          </thead>
          <tbody class="table-body">
          <tr v-for="product in filteredProducts" :key="product.id" class="table-row">
            <!-- Product Image -->
            <td class="table-cell">
              <div class="w-12 h-12 bg-secondary-100 rounded overflow-hidden">
                <img
                    v-if="product.images && product.images.length > 0"
                    :src="`/${product.images[0].srcset?.thumbnail || product.images[0].src}`"
                    :alt="product.name"
                    class="w-full h-full object-cover"
                >
                <div v-else class="w-full h-full flex items-center justify-center text-secondary-400">
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </td>

            <!-- Product Info -->
            <td class="table-cell">
              <div class="font-medium text-secondary-900">{{ product.name }}</div>
              <div class="text-xs text-secondary-500">{{ product.brand }}</div>
            </td>

            <!-- JAN Code -->
            <td class="table-cell">
              <div class="text-sm">{{ product.janCode }}</div>
            </td>

            <!-- SKU -->
            <td class="table-cell">
              <div class="text-sm">{{ product.sku }}</div>
            </td>

            <!-- Price -->
            <td class="table-cell">
              <div class="text-sm font-medium">
                {{ formatPrice(product.pricing.basePrice, product.pricing.currency) }}
              </div>
              <div v-if="product.pricing.discountPercentage" class="text-xs text-success-600">
                {{ product.pricing.discountPercentage }}% off
              </div>
            </td>

            <!-- Stock -->
            <td class="table-cell">
              <div :class="getStockClass(product.stock)">
                {{ product.stock }}
              </div>
            </td>

            <!-- Status -->
            <td class="table-cell">
                <span
                    class="badge"
                    :class="product.isActive ? 'badge-success' : 'badge-danger'"
                >
                  {{ product.isActive ? 'Active' : 'Inactive' }}
                </span>
              <span v-if="product.isNew" class="badge badge-primary ml-1">New</span>
              <span v-if="product.isFeatured" class="badge badge-warning ml-1">Featured</span>
            </td>

            <!-- Actions -->
            <td class="table-cell text-right">
              <div class="flex justify-end space-x-2">
                <button
                    @click="editProduct(product.id)"
                    class="p-1 text-secondary-600 hover:text-primary-600"
                    title="Edit Product"
                >
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                    @click="confirmDeleteProduct(product)"
                    class="p-1 text-secondary-600 hover:text-danger-600"
                    title="Delete Product"
                >
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="filteredProducts.length === 0">
            <td colspan="8" class="py-8 text-center text-secondary-600">
              <div class="flex flex-col items-center">
                <svg class="h-12 w-12 text-secondary-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="mb-1">No products found</p>
                <p class="text-sm">Try adjusting your filters or add a new product</p>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="bg-white rounded-card shadow-card p-8 flex justify-center">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p class="text-secondary-600">Loading products...</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && totalPages > 1" class="mt-6 flex justify-center">
      <div class="flex space-x-1">
        <button
            @click="page = 1"
            class="px-3 py-1 rounded-md bg-white border border-secondary-300 text-secondary-700 hover:bg-secondary-50"
            :disabled="page === 1"
            :class="{ 'opacity-50 cursor-not-allowed': page === 1 }"
        >
          First
        </button>
        <button
            @click="page--"
            class="px-3 py-1 rounded-md bg-white border border-secondary-300 text-secondary-700 hover:bg-secondary-50"
            :disabled="page === 1"
            :class="{ 'opacity-50 cursor-not-allowed': page === 1 }"
        >
          Prev
        </button>

        <div class="flex space-x-1">
          <button
              v-for="p in paginationRange"
              :key="p"
              @click="page = p"
              class="px-3 py-1 rounded-md border"
              :class="p === page
              ? 'bg-primary-600 text-white border-primary-600'
              : 'bg-white text-secondary-700 border-secondary-300 hover:bg-secondary-50'"
          >
            {{ p }}
          </button>
        </div>

        <button
            @click="page++"
            class="px-3 py-1 rounded-md bg-white border border-secondary-300 text-secondary-700 hover:bg-secondary-50"
            :disabled="page === totalPages"
            :class="{ 'opacity-50 cursor-not-allowed': page === totalPages }"
        >
          Next
        </button>
        <button
            @click="page = totalPages"
            class="px-3 py-1 rounded-md bg-white border border-secondary-300 text-secondary-700 hover:bg-secondary-50"
            :disabled="page === totalPages"
            :class="{ 'opacity-50 cursor-not-allowed': page === totalPages }"
        >
          Last
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black opacity-50" @click="showDeleteModal = false"></div>
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md z-10 p-6">
        <h3 class="text-lg font-medium text-secondary-900 mb-4">Confirm Delete</h3>
        <p class="text-secondary-600 mb-6">
          Are you sure you want to delete <span class="font-medium">{{ productToDelete?.name }}</span>?
          This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false" class="btn-outline">
            Cancel
          </button>
          <button @click="deleteProduct" class="btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useProductStore } from '~/stores/products';

// Layout
definePageMeta({
  layout: 'admin'
});

const productStore = useProductStore();
const { products, loading, categories, brands } = storeToRefs(productStore);

// Pagination
const page = ref(1);
const perPage = ref(10);
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / perPage.value));

// Calculate visible page range
const paginationRange = computed(() => {
  const start = Math.max(1, page.value - 2);
  const end = Math.min(totalPages.value, page.value + 2);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// Filters
const filters = ref({
  category: '',
  brand: '',
  stock: '',
  search: ''
});

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return filters.value.category ||
      filters.value.brand ||
      filters.value.stock ||
      filters.value.search;
});

// Clear all filters
const clearFilters = () => {
  filters.value = {
    category: '',
    brand: '',
    stock: '',
    search: ''
  };
};

// Filter products based on current filters
const filteredProducts = computed(() => {
  let result = [...products.value];

  // Apply category filter
  if (filters.value.category) {
    result = result.filter(product => product.category === filters.value.category);
  }

  // Apply brand filter
  if (filters.value.brand) {
    result = result.filter(product => product.brand === filters.value.brand);
  }

  // Apply stock filter
  if (filters.value.stock) {
    switch (filters.value.stock) {
      case 'in-stock':
        result = result.filter(product => product.stock > 0);
        break;
      case 'out-of-stock':
        result = result.filter(product => product.stock === 0);
        break;
      case 'low-stock':
        result = result.filter(product => product.stock > 0 && product.stock < 10);
        break;
    }
  }

  // Apply search filter
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase();
    result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm) ||
        product.janCode.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
    );
  }

  return result;
});

// Get paginated products for current page
const paginatedProducts = computed(() => {
  const start = (page.value - 1) * perPage.value;
  const end = start + perPage.value;

  return filteredProducts.value.slice(start, end);
});

// Reset page when filters change
watch(filters, () => {
  page.value = 1;
});

// Utilities
const formatPrice = (price: number, currency: string = 'JPY') => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(price);
};

const getStockClass = (stock: number) => {
  if (stock === 0) return 'text-danger-600 font-medium';
  if (stock < 10) return 'text-warning-600 font-medium';
  return 'text-success-600 font-medium';
};

// Navigation
const editProduct = (id: string) => {
  navigateTo(`/admin/products/${id}/edit`);
};

// Delete product
const showDeleteModal = ref(false);
const productToDelete = ref(null);

const confirmDeleteProduct = (product) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const deleteProduct = async (id) => {
  try {
    console.log('Deleting product:', id);

    // Make API call to delete product
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.statusText}`);
    }

    // Remove product from local state
    const index = products.value.findIndex(p => p.id === id);
    if (index !== -1) {
      products.value.splice(index, 1);
    }

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Load products on component mount
onMounted(async () => {
  if (products.value.length === 0) {
    await productStore.fetchProducts();
  }
});
</script>