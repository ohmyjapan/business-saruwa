<template>
  <div>
    <!-- Page Header -->
    <section class="bg-primary-700 text-white py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-2xl md:text-3xl font-bold">Products</h1>
        <div class="flex items-center text-sm text-primary-200 mt-2">
          <NuxtLink to="/" class="hover:text-white">Home</NuxtLink>
          <span class="mx-2">/</span>
          <span>Products</span>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-8 md:py-10">
      <div class="container mx-auto px-4">
        <div class="lg:grid lg:grid-cols-4 lg:gap-8">
          <!-- Sidebar - Filters -->
          <div class="hidden lg:block lg:col-span-1">
            <div class="sticky top-6 space-y-6">
              <!-- Category Filter -->
              <div class="bg-white rounded-lg shadow-subtle overflow-hidden">
                <div class="px-4 py-3 bg-secondary-50 border-b border-secondary-200">
                  <h3 class="font-medium text-secondary-900">Categories</h3>
                </div>
                <div class="p-4 max-h-60 overflow-y-auto">
                  <ul class="space-y-2">
                    <li v-for="category in categories" :key="category">
                      <label class="flex items-center">
                        <input
                            type="checkbox"
                            :value="category"
                            v-model="selectedCategories"
                            class="form-checkbox"
                        />
                        <span class="ml-2 text-sm text-secondary-700">{{ category }}</span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Brand Filter -->
              <div class="bg-white rounded-lg shadow-subtle overflow-hidden">
                <div class="px-4 py-3 bg-secondary-50 border-b border-secondary-200">
                  <h3 class="font-medium text-secondary-900">Brands</h3>
                </div>
                <div class="p-4 max-h-60 overflow-y-auto">
                  <div class="mb-3">
                    <input
                        type="text"
                        v-model="brandSearchQuery"
                        placeholder="Search brands..."
                        class="form-input text-sm w-full py-1"
                    />
                  </div>
                  <ul class="space-y-2">
                    <li v-for="brand in filteredBrands" :key="brand">
                      <label class="flex items-center">
                        <input
                            type="checkbox"
                            :value="brand"
                            v-model="selectedBrands"
                            class="form-checkbox"
                        />
                        <span class="ml-2 text-sm text-secondary-700">{{ brand }}</span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Price Range Filter -->
              <div class="bg-white rounded-lg shadow-subtle overflow-hidden">
                <div class="px-4 py-3 bg-secondary-50 border-b border-secondary-200">
                  <h3 class="font-medium text-secondary-900">Price Range</h3>
                </div>
                <div class="p-4">
                  <div class="flex items-center space-x-3 mb-2">
                    <input
                        type="number"
                        v-model.number="minPrice"
                        min="0"
                        placeholder="Min"
                        class="form-input text-sm flex-1"
                        :class="{ 'border-danger-300': priceRangeError }"
                    />
                    <span class="text-secondary-500">-</span>
                    <input
                        type="number"
                        v-model.number="maxPrice"
                        min="0"
                        placeholder="Max"
                        class="form-input text-sm flex-1"
                        :class="{ 'border-danger-300': priceRangeError }"
                    />
                  </div>
                  <div v-if="priceRangeError" class="text-xs text-danger-600 mb-2">
                    {{ priceRangeError }}
                  </div>
                  <button
                      class="btn-primary w-full text-sm"
                      @click="applyPriceRange"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <!-- Availability Filter -->
              <div class="bg-white rounded-lg shadow-subtle overflow-hidden">
                <div class="px-4 py-3 bg-secondary-50 border-b border-secondary-200">
                  <h3 class="font-medium text-secondary-900">Availability</h3>
                </div>
                <div class="p-4">
                  <label class="flex items-center">
                    <input
                        type="checkbox"
                        v-model="inStockOnly"
                        class="form-checkbox"
                    />
                    <span class="ml-2 text-sm text-secondary-700">In Stock Only</span>
                  </label>
                </div>
              </div>

              <!-- Clear Filters Button -->
              <div class="mt-6">
                <button
                    class="w-full btn-outline text-sm py-2"
                    @click="clearFilters"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile Filters Button and Sort -->
          <div class="lg:hidden mb-6">
            <div class="flex items-center justify-between">
              <button
                  class="btn-outline text-sm py-2 flex items-center"
                  @click="showFiltersDrawer = true"
              >
                <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
                </svg>
                Filters
              </button>

              <div class="flex items-center">
                <label for="mobile-sort" class="text-sm text-secondary-600 mr-2">Sort:</label>
                <select
                    id="mobile-sort"
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
          </div>

          <!-- Product Grid -->
          <div class="lg:col-span-3">
            <!-- Search and Sort Controls -->
            <div class="bg-white rounded-lg shadow-subtle p-4 mb-6 flex flex-wrap gap-4">
              <div class="w-full md:flex-1">
                <div class="relative">
                  <input
                      type="text"
                      v-model="searchQuery"
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

              <div class="hidden md:flex items-center space-x-3">
                <!-- Applied filters indicators -->
                <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
                  <div
                      v-for="(category, index) in selectedCategories"
                      :key="`cat-${index}`"
                      class="badge badge-primary flex items-center"
                  >
                    {{ category }}
                    <button @click="removeCategory(category)" class="ml-1 text-primary-700">
                      <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <div
                      v-for="(brand, index) in selectedBrands"
                      :key="`brand-${index}`"
                      class="badge badge-primary flex items-center"
                  >
                    {{ brand }}
                    <button @click="removeBrand(brand)" class="ml-1 text-primary-700">
                      <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <div
                      v-if="appliedMinPrice !== 0 || appliedMaxPrice !== 0"
                      class="badge badge-primary flex items-center"
                  >
                    Price: {{ formatPrice(appliedMinPrice) }} - {{ formatPrice(appliedMaxPrice) }}
                    <button @click="resetPriceRange" class="ml-1 text-primary-700">
                      <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>

                  <div
                      v-if="inStockOnly"
                      class="badge badge-primary flex items-center"
                  >
                    In Stock Only
                    <button @click="inStockOnly = false" class="ml-1 text-primary-700">
                      <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div class="hidden md:block ml-auto">
                <div class="flex items-center space-x-2">
                  <label for="desktop-sort" class="text-sm text-secondary-700">Sort by:</label>
                  <select
                      id="desktop-sort"
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
            </div>

            <!-- Loading indicator -->
            <div v-if="loading" class="flex justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>

            <!-- Error message -->
            <div v-else-if="error" class="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg mb-6">
              {{ error }}
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
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
      </div>
    </section>

    <!-- Mobile Filters Drawer -->
    <div
        v-if="showFiltersDrawer"
        class="fixed inset-0 z-50 overflow-hidden"
        @click.self="showFiltersDrawer = false"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      <div class="absolute inset-y-0 right-0 max-w-full flex">
        <div class="relative w-screen max-w-md">
          <div class="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
            <!-- Drawer header -->
            <div class="px-4 py-6 bg-primary-700 text-white flex items-center justify-between">
              <h2 class="text-xl font-semibold">Filters</h2>
              <button
                  type="button"
                  class="text-white hover:text-primary-100"
                  @click="showFiltersDrawer = false"
              >
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Drawer content -->
            <div class="p-4 space-y-6">
              <!-- Category Filter -->
              <div class="bg-white rounded-lg shadow-subtle overflow-hidden">
                <div class="px-4 py-3 bg-secondary-50 border-b border-secondary-200">
                  <h3 class="font-medium text-secondary-900">Categories</h3>
                </div>
                <div class="p-4 max-h-60 overflow-y-auto">
                  <ul class="space-y-2">
                    <li v-for="category in categories" :key="category">
                      <label class="flex items-center">
                        <input
                            type="checkbox"
                            :value="category"
                            v-model="selectedCategories"
                            class="form-checkbox"
                        />
                        <span class="ml-2 text-sm text-secondary-700">{{ category }}</span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Brand Filter -->
              <div class="bg-white rounded-lg shadow-subtle overflow-hidden">
                <div class="px-4 py-3 bg-secondary-50 border-b border-secondary-200">
                  <h3 class="font-medium text-secondary-900">Brands</h3>
                </div>
                <div class="p-4 max-h-60 overflow-y-auto">
                  <div class="mb-3">
                    <input
                        type="text"
                        v-model="brandSearchQuery"
                        placeholder="Search brands..."
                        class="form-input text-sm w-full py-1"
                    />
                  </div>
                  <ul class="space-y-2">
                    <li v-for="brand in filteredBrands" :key="brand">
                      <label class="flex items-center">
                        <input
                            type="checkbox"
                            :value="brand"
                            v-model="selectedBrands"
                            class="form-checkbox"
                        />
                        <span class="ml-2 text-sm text-secondary-700">{{ brand }}</span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Price Range Filter -->
              <div class="bg-white rounded-lg shadow-subtle overflow-hidden">
                <div class="px-4 py-3 bg-secondary-50 border-b border-secondary-200">
                  <h3 class="font-medium text-secondary-900">Price Range</h3>
                </div>
                <div class="p-4">
                  <div class="flex items-center space-x-3 mb-2">
                    <input
                        type="number"
                        v-model.number="minPrice"
                        min="0"
                        placeholder="Min"
                        class="form-input text-sm flex-1"
                        :class="{ 'border-danger-300': priceRangeError }"
                    />
                    <span class="text-secondary-500">-</span>
                    <input
                        type="number"
                        v-model.number="maxPrice"
                        min="0"
                        placeholder="Max"
                        class="form-input text-sm flex-1"
                        :class="{ 'border-danger-300': priceRangeError }"
                    />
                  </div>
                  <div v-if="priceRangeError" class="text-xs text-danger-600 mb-2">
                    {{ priceRangeError }}
                  </div>
                  <button
                      class="btn-primary w-full text-sm"
                      @click="applyPriceRange"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <!-- Availability Filter -->
              <div class="bg-white rounded-lg shadow-subtle overflow-hidden">
                <div class="px-4 py-3 bg-secondary-50 border-b border-secondary-200">
                  <h3 class="font-medium text-secondary-900">Availability</h3>
                </div>
                <div class="p-4">
                  <label class="flex items-center">
                    <input
                        type="checkbox"
                        v-model="inStockOnly"
                        class="form-checkbox"
                    />
                    <span class="ml-2 text-sm text-secondary-700">In Stock Only</span>
                  </label>
                </div>
              </div>

              <!-- Apply Filters and Clear Filters -->
              <div class="space-y-2">
                <button
                    class="w-full btn-primary text-sm py-2"
                    @click="showFiltersDrawer = false"
                >
                  Apply Filters
                </button>
                <button
                    class="w-full btn-outline text-sm py-2"
                    @click="clearFilters"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '~/stores/products';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const { products, loading, error, categories, brands } = storeToRefs(productStore);

// Initialize state from URL params
const initFiltersFromQuery = () => {
  const query = route.query;

  // Parse category
  if (query.category) {
    if (Array.isArray(query.category)) {
      selectedCategories.value = query.category;
    } else {
      selectedCategories.value = [query.category];
    }
  }

  // Parse brand
  if (query.brand) {
    if (Array.isArray(query.brand)) {
      selectedBrands.value = query.brand;
    } else {
      selectedBrands.value = [query.brand];
    }
  }

  // Parse search query
  if (typeof query.q === 'string') {
    searchQuery.value = query.q;
  }

  // Parse sort option
  if (typeof query.sort === 'string') {
    sortOption.value = query.sort;
  }

  // Parse price range
  if (typeof query.minPrice === 'string') {
    const min = parseInt(query.minPrice);
    if (!isNaN(min)) {
      appliedMinPrice.value = min;
      minPrice.value = min;
    }
  }

  if (typeof query.maxPrice === 'string') {
    const max = parseInt(query.maxPrice);
    if (!isNaN(max)) {
      appliedMaxPrice.value = max;
      maxPrice.value = max;
    }
  }

  // Parse in-stock filter
  if (query.inStock === 'true') {
    inStockOnly.value = true;
  }
};

// UI state
const showFiltersDrawer = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(15);
const priceRangeError = ref('');
const sortOption = ref('newest');
const searchQuery = ref('');
const brandSearchQuery = ref('');

// Filter state
const selectedCategories = ref<string[]>([]);
const selectedBrands = ref<string[]>([]);
const minPrice = ref(0);
const maxPrice = ref(0);
const appliedMinPrice = ref(0);
const appliedMaxPrice = ref(0);
const inStockOnly = ref(false);

// Reset page when filters change
watch([selectedCategories, selectedBrands, inStockOnly, searchQuery, sortOption], () => {
  currentPage.value = 1;
  updateQueryParams();
});

// Apply price range
const applyPriceRange = () => {
  priceRangeError.value = '';

  if (minPrice.value > maxPrice.value && maxPrice.value !== 0) {
    priceRangeError.value = 'Min price cannot be greater than max price';
    return;
  }

  appliedMinPrice.value = minPrice.value;
  appliedMaxPrice.value = maxPrice.value;
  currentPage.value = 1;

  updateQueryParams();

  if (showFiltersDrawer.value) {
    showFiltersDrawer.value = false;
  }
};

// Reset price range
const resetPriceRange = () => {
  minPrice.value = 0;
  maxPrice.value = 0;
  appliedMinPrice.value = 0;
  appliedMaxPrice.value = 0;

  updateQueryParams();
};

// Remove a category filter
const removeCategory = (category: string) => {
  selectedCategories.value = selectedCategories.value.filter(c => c !== category);
};

// Remove a brand filter
const removeBrand = (brand: string) => {
  selectedBrands.value = selectedBrands.value.filter(b => b !== brand);
};

// Clear all filters
const clearFilters = () => {
  selectedCategories.value = [];
  selectedBrands.value = [];
  searchQuery.value = '';
  minPrice.value = 0;
  maxPrice.value = 0;
  appliedMinPrice.value = 0;
  appliedMaxPrice.value = 0;
  inStockOnly.value = false;
  currentPage.value = 1;
  brandSearchQuery.value = '';

  updateQueryParams();

  if (showFiltersDrawer.value) {
    showFiltersDrawer.value = false;
  }
};

// Update query parameters in URL
const updateQueryParams = () => {
  const query: Record<string, string | string[]> = {};

  if (selectedCategories.value.length > 0) {
    query.category = selectedCategories.value.length === 1
        ? selectedCategories.value[0]
        : selectedCategories.value;
  }

  if (selectedBrands.value.length > 0) {
    query.brand = selectedBrands.value.length === 1
        ? selectedBrands.value[0]
        : selectedBrands.value;
  }

  if (searchQuery.value) {
    query.q = searchQuery.value;
  }

  if (sortOption.value !== 'newest') {
    query.sort = sortOption.value;
  }

  if (appliedMinPrice.value > 0) {
    query.minPrice = appliedMinPrice.value.toString();
  }

  if (appliedMaxPrice.value > 0) {
    query.maxPrice = appliedMaxPrice.value.toString();
  }

  if (inStockOnly.value) {
    query.inStock = 'true';
  }

  // Update URL without reload
  router.replace({ query });
};

// Filter brands based on search query
const filteredBrands = computed(() => {
  if (!brandSearchQuery.value) return brands.value;

  const query = brandSearchQuery.value.toLowerCase();
  return brands.value.filter(brand =>
      brand.toLowerCase().includes(query)
  );
});

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return selectedCategories.value.length > 0 ||
      selectedBrands.value.length > 0 ||
      appliedMinPrice.value > 0 ||
      appliedMaxPrice.value > 0 ||
      inStockOnly.value;
});

// Format price
const formatPrice = (price: number): string => {
  return `¥${price.toLocaleString()}`;
};

// Apply filters to products
const filteredProducts = computed(() => {
  let filtered = [...products.value];

  // Apply category filter
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter(p => selectedCategories.value.includes(p.category));
  }

  // Apply brand filter
  if (selectedBrands.value.length > 0) {
    filtered = filtered.filter(p => selectedBrands.value.includes(p.brand));
  }

  // Apply price range filter
  if (appliedMinPrice.value > 0) {
    filtered = filtered.filter(p => p.pricing.basePrice >= appliedMinPrice.value);
  }

  if (appliedMaxPrice.value > 0) {
    filtered = filtered.filter(p => p.pricing.basePrice <= appliedMaxPrice.value);
  }

  // Apply in-stock filter
  if (inStockOnly.value) {
    filtered = filtered.filter(p => p.stock > 0);
  }

  // Apply search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.janCode.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Apply sorting
  switch (sortOption.value) {
    case 'price-low':
      filtered.sort((a, b) => a.pricing.basePrice - b.pricing.basePrice);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.pricing.basePrice - a.pricing.basePrice);
      break;
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default: // newest
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  return filtered;
});

// Paginate products
const paginatedProducts = computed(() => {
  const startIdx = (currentPage.value - 1) * itemsPerPage.value;
  const endIdx = startIdx + itemsPerPage.value;
  return filteredProducts.value.slice(startIdx, endIdx);
});

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage.value) || 1;
});

// Calculate pages to display in pagination
const displayedPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);

  // Adjust start page if we're near the end
  startPage = Math.max(1, endPage - maxPagesToShow + 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Fetch products on component mount
onMounted(async () => {
  if (products.value.length === 0) {
    await productStore.fetchProducts();
  }

  // Set initial price range from products if not already set from query params
  if (appliedMinPrice.value === 0 && appliedMaxPrice.value === 0) {
    const priceRange = productStore.priceRange;
    minPrice.value = priceRange.min;
    maxPrice.value = priceRange.max;
  }

  // Initialize filters from URL query parameters
  initFiltersFromQuery();
});
</script>