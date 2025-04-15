<template>
  <div>
    <!-- Filters bar -->
    <div class="mb-6 p-4 bg-white rounded-lg shadow-subtle">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Category filter -->
        <div class="w-full md:w-auto">
          <label class="form-label">Category</label>
          <select
              v-model="selectedCategories"
              class="form-select"
              multiple
          >
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Brand filter -->
        <div class="w-full md:w-auto">
          <label class="form-label">Brand</label>
          <select
              v-model="selectedBrands"
              class="form-select"
              multiple
          >
            <option v-for="brand in brands" :key="brand" :value="brand">
              {{ brand }}
            </option>
          </select>
        </div>

        <!-- Price range filter -->
        <div class="w-full md:w-auto">
          <label class="form-label">Price Range</label>
          <div class="flex items-center gap-2">
            <input
                v-model.number="minPrice"
                type="number"
                class="form-input w-24"
                min="0"
                placeholder="Min"
            />
            <span>to</span>
            <input
                v-model.number="maxPrice"
                type="number"
                class="form-input w-24"
                min="0"
                placeholder="Max"
            />
          </div>
        </div>

        <!-- In-stock filter -->
        <div class="w-full md:w-auto">
          <label class="form-label">&nbsp;</label>
          <div class="flex items-center gap-2">
            <input
                v-model="inStockOnly"
                type="checkbox"
                id="in-stock-filter"
                class="form-checkbox"
            />
            <label for="in-stock-filter" class="text-sm text-secondary-700">In Stock Only</label>
          </div>
        </div>

        <!-- Search input -->
        <div class="w-full md:flex-1">
          <label class="form-label">Search</label>
          <div class="relative">
            <input
                v-model="searchQuery"
                type="text"
                class="form-input w-full pl-10"
                placeholder="Search products..."
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-secondary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Clear filters button -->
        <div class="w-full md:w-auto flex items-end">
          <button
              @click="clearFilters"
              class="btn-outline py-1.5 text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center my-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>

    <!-- Error message -->
    <div v-else-if="error" class="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg mb-6">
      <div class="flex">
        <svg class="h-5 w-5 text-danger-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div>{{ error }}</div>
      </div>
    </div>

    <!-- No products found -->
    <div v-else-if="filteredProducts.length === 0" class="bg-secondary-50 rounded-lg p-8 text-center">
      <svg class="h-12 w-12 text-secondary-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-xl font-semibold text-secondary-700 mb-2">No products found</h3>
      <p class="text-secondary-500">Try adjusting your filters or search criteria</p>
    </div>

    <!-- Products grid -->
    <div v-else>
      <!-- Results count and sort options -->
      <div class="mb-4 flex justify-between items-center">
        <p class="text-sm text-secondary-500">
          Showing {{ paginatedProducts.length }} of {{ filteredProducts.length }} products
        </p>

        <div class="flex items-center gap-2">
          <label for="sort-by" class="text-sm text-secondary-700">Sort by:</label>
          <select
              id="sort-by"
              v-model="sortOption"
              class="form-select text-sm py-1"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      <!-- Grid layout -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        <ProductCard
            v-for="product in paginatedProducts"
            :key="product.id"
            :product="product"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex items-center gap-1">
          <!-- Previous page button -->
          <button
              @click="currentPage > 1 && (currentPage--)"
              :disabled="currentPage === 1"
              class="btn-outline py-1 px-2 text-sm disabled:opacity-50"
              aria-label="Previous page"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Page buttons -->
          <button
              v-for="page in displayedPages"
              :key="page"
              @click="currentPage = page"
              :class="[
              'btn text-sm min-w-[2.5rem]',
              currentPage === page
                ? 'btn-primary'
                : 'btn-outline'
            ]"
          >
            {{ page }}
          </button>

          <!-- Next page button -->
          <button
              @click="currentPage < totalPages && (currentPage++)"
              :disabled="currentPage === totalPages"
              class="btn-outline py-1 px-2 text-sm disabled:opacity-50"
              aria-label="Next page"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useProductStore, Product } from '~/stores/products';

const props = defineProps({
  initialCategory: {
    type: String,
    default: ''
  },
  initialSearchQuery: {
    type: String,
    default: ''
  },
  itemsPerPage: {
    type: Number,
    default: 20
  }
});

const productStore = useProductStore();
const { products, loading, error, categories, brands } = storeToRefs(productStore);

// Reactive filter state
const selectedCategories = ref<string[]>(props.initialCategory ? [props.initialCategory] : []);
const selectedBrands = ref<string[]>([]);
const searchQuery = ref(props.initialSearchQuery);
const minPrice = ref(0);
const maxPrice = ref(0);
const inStockOnly = ref(false);
const currentPage = ref(1);
const sortOption = ref('newest');

// Update store filters when local filters change
watch([selectedCategories, selectedBrands, minPrice, maxPrice, inStockOnly, searchQuery], () => {
  // Reset to first page when filters change
  currentPage.value = 1;

  // Update store filters
  productStore.setFilters({
    categories: selectedCategories.value,
    brands: selectedBrands.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    inStock: inStockOnly.value,
    query: searchQuery.value
  });
});

// Set initial price range once products are loaded
watch(() => productStore.priceRange, (newRange) => {
  if (minPrice.value === 0 && maxPrice.value === 0) {
    minPrice.value = newRange.min;
    maxPrice.value = newRange.max;
  }
}, { immediate: true });

// Get filtered and sorted products
const sortedProducts = computed(() => {
  const filtered = [...productStore.filteredProducts];

  // Sort products based on selected option
  switch (sortOption.value) {
    case 'newest':
      return filtered.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'price-low':
      return filtered.sort((a, b) =>
          a.pricing.basePrice - b.pricing.basePrice
      );
    case 'price-high':
      return filtered.sort((a, b) =>
          b.pricing.basePrice - a.pricing.basePrice
      );
    case 'name-asc':
      return filtered.sort((a, b) =>
          a.name.localeCompare(b.name)
      );
    case 'name-desc':
      return filtered.sort((a, b) =>
          b.name.localeCompare(a.name)
      );
    default:
      return filtered;
  }
});

// Get the filtered products
const filteredProducts = computed(() => {
  return sortedProducts.value;
});

// Get paginated products
const paginatedProducts = computed(() => {
  const startIdx = (currentPage.value - 1) * props.itemsPerPage;
  const endIdx = startIdx + props.itemsPerPage;
  return filteredProducts.value.slice(startIdx, endIdx);
});

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / props.itemsPerPage);
});

// Calculate pages to display in pagination
const displayedPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);

  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Clear all filters
const clearFilters = () => {
  selectedCategories.value = [];
  selectedBrands.value = [];
  minPrice.value = productStore.priceRange.min;
  maxPrice.value = productStore.priceRange.max;
  inStockOnly.value = false;
  searchQuery.value = '';
  currentPage.value = 1;
  sortOption.value = 'newest';

  // Clear store filters
  productStore.clearFilters();
};

// Fetch products on component mount
onMounted(async () => {
  if (products.value.length === 0) {
    await productStore.fetchProducts();
  }
});
</script>