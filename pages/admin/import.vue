<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-secondary-900 mb-2">Import Data</h1>
      <p class="text-secondary-600">Upload product data and images in bulk</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Product Upload Section -->
      <ProductUpload />

      <!-- Image Upload Section -->
      <ImageUpload />
    </div>

    <!-- Instructions and Tips -->
    <div class="mt-10 bg-white shadow-card rounded-lg overflow-hidden">
      <div class="px-6 py-4 bg-secondary-50 border-b border-secondary-200">
        <h2 class="text-lg font-medium text-secondary-900">Import Instructions</h2>
      </div>

      <div class="p-6">
        <div class="prose max-w-none">
          <h3>Excel Import Format</h3>
          <p>The Excel file should have the following columns:</p>
          <ul>
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

          <h3>Image Upload</h3>
          <p>Images should be:</p>
          <ul>
            <li>JPEG, PNG, or WebP format</li>
            <li>Maximum 5MB per image</li>
            <li>Minimum 800x800px resolution recommended</li>
            <li>The JAN code must match an existing product</li>
          </ul>

          <h3>Tips for Successful Imports</h3>
          <ul>
            <li>Download and use the template for a consistent format</li>
            <li>Make sure JAN codes are unique and consistent between products and images</li>
            <li>Import products first, then upload the corresponding images</li>
            <li>For large catalogs, break your import into multiple files of 100-200 products each</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Use admin layout
definePageMeta({
  layout: 'admin'
});

// Import components from the admin components folder
import ProductUpload from '~/components/admin/ProductUpload.vue';
import ImageUpload from '~/components/admin/ImageUpload.vue';
</script>