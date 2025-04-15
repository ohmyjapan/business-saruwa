<template>
  <div>
    <!-- Page Header -->
    <section class="bg-primary-700 text-white py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-2xl md:text-3xl font-bold">Your Cart</h1>
        <div class="flex items-center text-sm text-primary-200 mt-2">
          <NuxtLink to="/" class="hover:text-white">Home</NuxtLink>
          <span class="mx-2">/</span>
          <span>Cart</span>
        </div>
      </div>
    </section>

    <!-- Cart Content -->
    <section class="py-8 md:py-12">
      <div class="container mx-auto px-4">
        <!-- Empty cart state -->
        <div v-if="isEmpty" class="py-12 text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-secondary-100 rounded-full mb-6">
            <svg class="h-10 w-10 text-secondary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-medium text-secondary-900 mb-4">Your cart is empty</h2>
          <p class="text-secondary-600 mb-8">
            Browse our catalog and discover our best deals!
          </p>
          <NuxtLink to="/products" class="btn-primary py-2.5 px-8">
            Start Shopping
          </NuxtLink>
        </div>

        <!-- Cart with items -->
        <div v-else class="lg:grid lg:grid-cols-12 lg:gap-12">
          <!-- Cart items (left column) -->
          <div class="lg:col-span-8">
            <div class="bg-white rounded-lg shadow-card mb-6 lg:mb-0">
              <div class="p-6 border-b border-secondary-200">
                <h2 class="text-lg font-semibold">Cart ({{ cartCount }} items)</h2>
              </div>

              <div class="divide-y divide-secondary-200">
                <CartItem
                    v-for="item in items"
                    :key="item.id"
                    :item="item"
                />
              </div>

              <div class="p-6 border-t border-secondary-200 flex justify-between items-center">
                <button
                    type="button"
                    class="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                    @click="clearCart"
                >
                  <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  Clear Cart
                </button>

                <NuxtLink
                    to="/products"
                    class="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                >
                  <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                  Continue Shopping
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Order summary (right column) -->
          <div class="lg:col-span-4 mt-6 lg:mt-0">
            <CartSummary @checkout="goToCheckout" />
          </div>
        </div>
      </div>
    </section>

    <!-- Recommended Products -->
    <section class="py-8 md:py-12 bg-secondary-50">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl font-bold mb-6">You Might Also Like</h2>

        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>

        <div v-else-if="recommendedProducts.length === 0" class="text-center py-12">
          <p class="text-secondary-500">No recommendations available at the moment.</p>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          <ProductCard
              v-for="product in recommendedProducts.slice(0, 5)"
              :key="product.id"
              :product="product"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '~/stores/cart';
import { useProductStore } from '~/stores/products';

const router = useRouter();
const cartStore = useCartStore();
const productStore = useProductStore();

const { items, isEmpty, cartCount } = storeToRefs(cartStore);
const { loading } = storeToRefs(productStore);

// Get recommended products (featured products, excluding any that are in the cart)
const recommendedProducts = computed(() => {
  // Get IDs of products in the cart
  const cartProductIds = items.value.map(item => item.productId);

  // Filter featured products not in the cart
  return productStore.products
      .filter(p => p.isFeatured && !cartProductIds.includes(p.id) && p.isActive)
      .slice(0, 10);
});

// Clear cart with confirmation
const clearCart = () => {
  if (confirm('Are you sure you want to clear your cart?')) {
    cartStore.clearCart();
  }
};

// Navigate to checkout page
const goToCheckout = () => {
  router.push('/checkout');
};

// Load cart from local storage and fetch products on mount
onMounted(() => {
  // Load cart
  cartStore.loadCart();

  // Fetch products if not already loaded (for recommendations)
  if (productStore.products.length === 0) {
    productStore.fetchProducts();
  }
});
</script>