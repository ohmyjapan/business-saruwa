<!-- pages/admin/import.vue -->
<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-secondary-900 mb-2">Bulk Import</h1>
      <p class="text-secondary-600">Upload product data and images in bulk</p>
    </div>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <div class="border-b border-secondary-200">
        <nav class="flex -mb-px">
          <button
              @click="activeTab = 'products'"
              class="py-4 px-6 font-medium text-sm border-b-2 focus:outline-none transition-colors duration-200"
              :class="activeTab === 'products' ? 'border-primary-500 text-primary-600' : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'"
          >
            Product Import
          </button>
          <button
              @click="activeTab = 'images'"
              class="py-4 px-6 font-medium text-sm border-b-2 focus:outline-none transition-colors duration-200"
              :class="activeTab === 'images' ? 'border-primary-500 text-primary-600' : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'"
          >
            Image Upload
          </button>
        </nav>
      </div>
    </div>

    <!-- Tab Content -->
    <div>
      <!-- Products Tab -->
      <div v-if="activeTab === 'products'">
        <ProductExcelUpload />
      </div>

      <!-- Images Tab -->
      <div v-if="activeTab === 'images'">
        <ProductImageUpload />
      </div>
    </div>

    <!-- Instructions and Tips -->
    <div class="mt-10 bg-white shadow-card rounded-lg overflow-hidden">
      <div class="px-6 py-4 bg-secondary-50 border-b border-secondary-200">
        <h2 class="text-lg font-medium text-secondary-900">Import Instructions</h2>
      </div>

      <div class="p-6">
        <div class="prose max-w-none">
          <div v-if="activeTab === 'products'">
            <h3>Excel Import Format</h3>
            <p class="text-sm text-secondary-700 mb-2">
              The Excel file should have the following columns:
            </p>
            <ul class="list-disc pl-5 text-sm text-secondary-700">
              <li><strong>name</strong> - Product name (required)</li>
              <li><strong>description</strong> - Product description</li>
              <li><strong>janCode</strong> - JAN/EAN code (required)</li>
              <li><strong>sku</strong> - SKU/Product code (required)</li>
              <li><strong>brand</strong> - Brand name</li>
              <li><strong>category</strong> - Product category</li>
              <li><strong>subcategory</strong> - Product subcategory</li>
              <li><strong>tags</strong> - Comma-separated tags</li>
              <li><strong>minOrderQuantity</strong> - Minimum order quantity</li>
              <li><strong>stock</strong> - Available stock</li>
              <li><strong>basePrice</strong> - Base price (required)</li>
              <li><strong>currency</strong> - Currency (default: JPY)</li>
              <li><strong>discountPercentage</strong> - Discount percentage</li>
              <li><strong>volumeDiscounts</strong> - Format: "10:5,20:10,50:15" (quantity:discount%)</li>
            </ul>

            <h3 class="mt-4 text-lg font-medium">Tips for Successful Imports</h3>
            <ul class="list-disc pl-5 text-sm text-secondary-700">
              <li>Download and use the template for a consistent format</li>
              <li>Make sure JAN codes are unique across all products</li>
              <li>For large catalogs, break your import into multiple files of 100-200 products each</li>
              <li>After importing products, switch to the Image Upload tab to add product images</li>
            </ul>

            <div class="mt-4">
              <a href="/templates/products_template.xlsx" download class="btn-primary inline-flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download Excel Template
              </a>
            </div>
          </div>

          <div v-if="activeTab === 'images'">
            <h3 class="text-lg font-medium">Image Upload Requirements</h3>
            <p class="text-sm text-secondary-700 mb-2">Images should be:</p>
            <ul class="list-disc pl-5 text-sm text-secondary-700">
              <li>JPEG, PNG, WebP, or GIF format</li>
              <li>Maximum 5MB per image</li>
              <li>Minimum 800x800px resolution recommended</li>
              <li>The JAN code must match an existing product</li>
            </ul>

            <h3 class="mt-4 text-lg font-medium">Tips for Image Uploads</h3>
            <ul class="list-disc pl-5 text-sm text-secondary-700">
              <li>Name your image files with the product JAN code for automatic matching (e.g., <code>4901234567890.jpg</code>)</li>
              <li>You can upload multiple images for each product</li>
              <li>The first image uploaded for each product will be set as the default/main image</li>
              <li>Images will be automatically resized to create thumbnails and optimized versions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ProductExcelUpload from '~/components/admin/ProductExcelUpload.vue';
import ProductImageUpload from '~/components/admin/ProductImageUpload.vue';

// Use admin layout
definePageMeta({
  layout: 'admin'
});

// Tab state
const activeTab = ref('products');
</script>

<style scoped>
.prose h3 {
  @apply text-lg font-medium text-secondary-800 mt-4 mb-2;
}

.prose ul {
  @apply list-disc pl-5 mb-4;
}

.prose ul li {
  @apply mb-1;
}
</style>