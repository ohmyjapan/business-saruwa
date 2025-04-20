<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 md:py-24">
      <div class="container mx-auto px-4">
        <div class="md:flex items-center">
          <div class="md:w-1/2 md:pr-12">
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Your Trusted Wholesale Partner
            </h1>
            <p class="text-lg md:text-xl mb-8 text-primary-100">
              Premium products at competitive prices for your business needs.
              Streamlined ordering, reliable shipping, and exceptional service.
            </p>
            <div class="flex flex-wrap gap-4">
              <NuxtLink to="/products" class="btn-primary text-sm md:text-base md:py-3 md:px-6">
                Browse Products
              </NuxtLink>
              <NuxtLink to="/register" class="btn-outline bg-transparent border-white text-white hover:bg-white hover:bg-opacity-10 text-sm md:text-base md:py-3 md:px-6">
                Register Now
              </NuxtLink>
            </div>
          </div>
          <div class="md:w-1/2 mt-8 md:mt-0">
            <div class="relative bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg p-6 shadow-xl">
              <!-- Placeholder div instead of an image -->
              <div class="rounded-lg w-full h-64 bg-gray-200 flex items-center justify-center">
                <span class="text-gray-600">Hero Image Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section (Simplified) -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">Featured Products</h2>

        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>

        <div v-else-if="error" class="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
          {{ error }}
        </div>

        <div v-else class="text-center">
          <p>Loading products...</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Simplified data
const loading = ref(true);
const error = ref(null);

// Simulate loading completion
setTimeout(() => {
  loading.value = false;
}, 1000);
</script>