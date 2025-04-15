<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';
import { useProductStore } from '~/stores/products';

// Initialize stores
const cartStore = useCartStore();
const productStore = useProductStore();

onMounted(() => {
  // Load cart from local storage
  cartStore.loadCart();

  // Pre-fetch products for faster rendering
  productStore.fetchProducts();
});
</script>

<style>
/* Global styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  @apply bg-gray-50 text-gray-900 antialiased;
}

/* Fix for Webkit autofill styling */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 5000s ease-in-out 0s;
}

/* Transition effects */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>