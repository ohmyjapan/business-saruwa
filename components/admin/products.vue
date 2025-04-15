<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-secondary-900">Products</h1>
      <button class="btn-primary">
        <span class="flex items-center">
          <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Product
        </span>
      </button>
    </div>

    <!-- Product filters and search -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <!-- Search -->
        <div class="w-full md:w-64">
          <div class="relative">
            <input
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

        <!-- Filters -->
        <div class="flex flex-wrap items-center gap-4">
          <!-- Category filter -->
          <div class="min-w-32">
            <select class="form-select">
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="home">Home & Kitchen</option>
              <option value="fashion">Fashion</option>
              <option value="beauty">Health & Beauty</option>
            </select>
          </div>

          <!-- Stock filter -->
          <div class="min-w-32">
            <select class="form-select">
              <option value="">All Stock Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          <!-- Clear filters -->
          <button class="btn-outline py-1.5 text-sm">
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Products table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-secondary-200">
          <thead class="bg-secondary-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Product
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              SKU / JAN Code
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Stock
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-secondary-200">
          <!-- Loading state -->
          <tr>
            <td colspan="7" class="px-6 py-10 text-center text-secondary-500">
              <div class="flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              </div>
              <p class="mt-2">Loading products...</p>
            </td>
          </tr>

          <!-- Product rows would go here -->
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-3 border-t border-secondary-200">
        <div class="text-sm text-secondary-700">
          Showing <span class="font-medium">1</span> to
          <span class="font-medium">10</span> of
          <span class="font-medium">20</span> results
        </div>

        <div class="flex space-x-1">
          <button
              disabled
              class="btn-outline py-1 px-2 text-sm disabled:opacity-50"
              aria-label="Previous page"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>

          <button class="btn-primary text-sm min-w-[2.5rem]">
            1
          </button>

          <button class="btn-outline text-sm min-w-[2.5rem]">
            2
          </button>

          <button
              class="btn-outline py-1 px-2 text-sm"
              aria-label="Next page"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Use admin layout
definePageMeta({
  layout: 'admin'
});
</script>