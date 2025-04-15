<template>
  <div class="product-card group">
    <!-- Product image -->
    <div class="product-card-image relative overflow-hidden">
      <NuxtLink :to="`/products/${product.id}`">
        <img
            v-if="product.images && product.images.length > 0"
            :src="getImageUrl(product.images[0].src)"
            :alt="product.images[0].alt"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div v-else class="flex items-center justify-center w-full h-full bg-secondary-100 aspect-w-1 aspect-h-1">
          <svg class="w-12 h-12 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </NuxtLink>

      <!-- Badge overlays -->
      <div class="absolute top-2 left-2 flex flex-col gap-1">
        <span v-if="product.isNew" class="badge-primary">New</span>
        <span v-if="hasDiscount" class="badge-danger">{{ discountText }}</span>
      </div>

      <!-- Quick actions overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div class="flex gap-2">
          <button
              class="btn-primary py-1.5 px-3 text-sm"
              @click="addToCart()"
          >
            Add to Cart
          </button>
          <NuxtLink
              :to="`/products/${product.id}`"
              class="btn-secondary py-1.5 px-3 text-sm"
          >
            View Details
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Product info -->
    <div class="product-card-content">
      <div class="product-card-subtitle">{{ product.brand }}</div>
      <h3 class="product-card-title">
        <NuxtLink :to="`/products/${product.id}`">
          {{ product.name }}
        </NuxtLink>
      </h3>

      <!-- Price display -->
      <div class="mt-2 flex items-end justify-between">
        <div>
          <div class="product-card-price flex items-center gap-1">
            {{ formatPrice(product.pricing.basePrice, product.pricing.currency) }}
            <span v-if="hasDiscount" class="text-sm line-through text-secondary-400">
              {{ formatPrice(originalPrice, product.pricing.currency) }}
            </span>
          </div>
          <div class="text-xs text-secondary-500">
            MOQ: {{ product.minOrderQuantity }}
          </div>
        </div>

        <!-- Stock indicator -->
        <div class="text-xs">
          <span v-if="product.stock > 10" class="text-success-600">In Stock</span>
          <span v-else-if="product.stock > 0" class="text-warning-600">Low Stock</span>
          <span v-else class="text-danger-600">Out of Stock</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Product } from '~/stores/products';
import { useCartStore } from '~/stores/cart';

const props = defineProps<{
  product: Product;
}>();

const cartStore = useCartStore();
const config = useRuntimeConfig();

// Calculate if product has a discount
const hasDiscount = computed(() => {
  return Boolean(props.product.pricing.discountPercentage);
});

// Calculate original price
const originalPrice = computed(() => {
  if (!hasDiscount.value) return props.product.pricing.basePrice;

  // Calculate original price from current price and discount percentage
  const discountMultiplier = 1 - (props.product.pricing.discountPercentage! / 100);
  return props.product.pricing.basePrice / discountMultiplier;
});

// Format discount text
const discountText = computed(() => {
  return `${props.product.pricing.discountPercentage}% OFF`;
});

// Helper function to format price
const formatPrice = (price: number, currency: string = 'JPY'): string => {
  // Format based on currency
  if (currency === 'JPY') {
    return `¥${Math.round(price).toLocaleString()}`;
  } else if (currency === 'USD') {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    return `${price.toLocaleString()} ${currency}`;
  }
};

// Helper function to get image URL
const getImageUrl = (imagePath: string): string => {
  // Check if the path is already a URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If it's a relative path, prepend the upload URL
  return `${config.public.uploadUrl}/${imagePath}`;
};

// Add product to cart
const addToCart = () => {
  cartStore.addToCart(props.product, props.product.minOrderQuantity);
  // You could add a toast notification here
};
</script>