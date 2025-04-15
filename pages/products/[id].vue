<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="py-16 flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="container mx-auto px-4 py-12">
      <div class="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>
      <div class="mt-4 text-center">
        <NuxtLink to="/products" class="text-primary-600 hover:text-primary-700">
          Back to Products
        </NuxtLink>
      </div>
    </div>

    <!-- Product not found -->
    <div v-else-if="!product" class="container mx-auto px-4 py-12 text-center">
      <h1 class="text-2xl md:text-3xl font-bold mb-4">Product Not Found</h1>
      <p class="text-secondary-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
      <NuxtLink to="/products" class="btn-primary">
        Browse Products
      </NuxtLink>
    </div>

    <!-- Product details -->
    <div v-else>
      <!-- Breadcrumbs -->
      <div class="bg-secondary-50 border-b border-secondary-200 py-4">
        <div class="container mx-auto px-4">
          <div class="flex items-center text-sm">
            <NuxtLink to="/" class="text-secondary-600 hover:text-secondary-900">Home</NuxtLink>
            <span class="mx-2 text-secondary-400">/</span>
            <NuxtLink to="/products" class="text-secondary-600 hover:text-secondary-900">Products</NuxtLink>
            <span class="mx-2 text-secondary-400">/</span>
            <NuxtLink
                :to="`/products?category=${product.category}`"
                class="text-secondary-600 hover:text-secondary-900"
            >
              {{ product.category }}
            </NuxtLink>
            <span class="mx-2 text-secondary-400">/</span>
            <span class="text-secondary-900">{{ product.name }}</span>
          </div>
        </div>
      </div>

      <!-- Product content -->
      <div class="container mx-auto px-4 py-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-12">
          <!-- Left column: Images -->
          <div>
            <!-- Main image -->
            <div class="bg-white rounded-lg overflow-hidden border border-secondary-200 mb-4">
              <img
                  v-if="currentImage"
                  :src="getImageUrl(currentImage.src)"
                  :alt="currentImage.alt"
                  class="w-full h-auto object-cover aspect-w-1 aspect-h-1"
              />
              <div v-else class="w-full aspect-w-1 aspect-h-1 bg-secondary-100 flex items-center justify-center text-secondary-400">
                <svg class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <!-- Thumbnail images -->
            <div v-if="product.images.length > 1" class="grid grid-cols-5 gap-2">
              <button
                  v-for="(image, index) in product.images"
                  :key="index"
                  class="border rounded-md overflow-hidden"
                  :class="currentImageIndex === index ? 'border-primary-500' : 'border-secondary-200'"
                  @click="currentImageIndex = index"
              >
                <img
                    :src="getImageUrl(image.src)"
                    :alt="image.alt"
                    class="w-full h-auto object-cover aspect-w-1 aspect-h-1"
                />
              </button>
            </div>
          </div>

          <!-- Right column: Product info -->
          <div class="mt-8 lg:mt-0">
            <!-- Status badges -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-if="product.isNew" class="badge badge-primary">New</span>
              <span v-if="hasDiscount" class="badge badge-danger">{{ discountText }}</span>
              <span v-if="product.stock > 10" class="badge badge-success">In Stock</span>
              <span v-else-if="product.stock > 0" class="badge badge-warning">Low Stock</span>
              <span v-else class="badge badge-danger">Out of Stock</span>
            </div>

            <!-- Brand -->
            <div class="text-sm text-secondary-600 mb-1">
              <NuxtLink
                  :to="`/products?brand=${product.brand}`"
                  class="hover:text-primary-600"
              >
                {{ product.brand }}
              </NuxtLink>
            </div>

            <!-- Product name and SKU -->
            <h1 class="text-2xl md:text-3xl font-bold mb-2">{{ product.name }}</h1>
            <div class="flex flex-wrap gap-4 text-sm text-secondary-600 mb-4">
              <div>SKU: {{ product.sku }}</div>
              <div>JAN: {{ product.janCode }}</div>
            </div>

            <!-- Price -->
            <div class="flex items-baseline mb-6">
              <span class="text-2xl font-bold text-primary-700">{{ formatPrice(product.pricing.basePrice) }}</span>
              <span v-if="hasDiscount" class="ml-2 text-lg text-secondary-500 line-through">{{ formatPrice(originalPrice) }}</span>
            </div>

            <!-- Minimum order quantity -->
            <div class="mb-6">
              <div class="text-sm text-secondary-600 mb-1">Minimum Order Quantity</div>
              <div class="font-medium">{{ product.minOrderQuantity }} units</div>
            </div>

            <!-- Volume discounts -->
            <div v-if="product.pricing.volumeDiscounts" class="mb-6">
              <div class="text-sm text-secondary-600 mb-1">Volume Discounts</div>
              <div class="bg-primary-50 p-3 rounded-md">
                <table class="w-full text-sm">
                  <thead>
                  <tr class="border-b border-primary-200">
                    <th class="text-left pb-2 font-medium text-primary-800">Quantity</th>
                    <th class="text-right pb-2 font-medium text-primary-800">Discount</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(discount, index) in product.pricing.volumeDiscounts" :key="index" class="border-b border-primary-100 last:border-0">
                    <td class="py-2">{{ discount.minQuantity }}+ units</td>
                    <td class="py-2 text-right">{{ discount.discount }}% off</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Quantity selector -->
            <div class="mb-6">
              <label for="quantity" class="block text-sm font-medium text-secondary-700 mb-1">Quantity</label>
              <div class="flex">
                <div class="relative flex items-center max-w-[8rem]">
                  <button
                      type="button"
                      class="p-2 text-secondary-600 hover:bg-secondary-100 border border-r-0 border-secondary-300 rounded-l-md focus:outline-none"
                      :disabled="quantity <= product.minOrderQuantity"
                      @click="decrementQuantity"
                  >
                    <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <input
                      id="quantity"
                      type="number"
                      min="1"
                      v-model.number="quantity"
                      class="form-input border-x-0 rounded-none text-center w-16 py-2"
                      :min="product.minOrderQuantity"
                  />
                  <button
                      type="button"
                      class="p-2 text-secondary-600 hover:bg-secondary-100 border border-l-0 border-secondary-300 rounded-r-md focus:outline-none"
                      @click="incrementQuantity"
                  >
                    <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <p v-if="quantity < product.minOrderQuantity" class="mt-1 text-sm text-danger-600">
                Minimum order quantity is {{ product.minOrderQuantity }} units
              </p>
            </div>

            <!-- Add to Cart button -->
            <div class="space-y-3">
              <button
                  type="button"
                  class="btn-primary w-full py-3 text-base"
                  :disabled="product.stock === 0 || quantity < product.minOrderQuantity"
                  @click="addToCart"
              >
                <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Add to Cart
              </button>

              <!-- Request Quote button -->
              <button
                  type="button"
                  class="btn-outline w-full py-3 text-base"
              >
                Request Bulk Quote
              </button>
            </div>
          </div>
        </div>

        <!-- Product details tabs -->
        <div class="mt-12">
          <div class="border-b border-secondary-200">
            <nav class="flex -mb-px space-x-8">
              <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                  'py-4 px-1 text-sm font-medium border-b-2 whitespace-nowrap',
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-600 hover:text-secondary-800 hover:border-secondary-300'
                ]"
              >
                {{ tab.name }}
              </button>
            </nav>
          </div>

          <div class="py-6">
            <!-- Description tab -->
            <div v-if="activeTab === 'description'" class="prose max-w-none">
              <p>{{ product.description }}</p>
            </div>

            <!-- Specifications tab -->
            <div v-else-if="activeTab === 'specifications'">
              <div v-if="product.specifications" class="overflow-hidden border border-secondary-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-secondary-200">
                  <tbody class="divide-y divide-secondary-200">
                  <tr v-for="(value, key) in product.specifications" :key="key">
                    <td class="px-6 py-4 text-sm font-medium text-secondary-900 bg-secondary-50 w-1/3">
                      {{ formatSpecKey(key) }}
                    </td>
                    <td class="px-6 py-4 text-sm text-secondary-600">
                      {{ value }}
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-center py-8 text-secondary-500">
                No specifications available for this product.
              </div>
            </div>

            <!-- Shipping tab -->
            <div v-else-if="activeTab === 'shipping'" class="space-y-4">
              <div class="border-b border-secondary-200 pb-4">
                <h3 class="text-lg font-medium text-secondary-900 mb-2">Shipping Information</h3>
                <p class="text-secondary-600">
                  Orders are typically processed within 1-2 business days. Shipping times vary depending on location and shipping method chosen at checkout.
                </p>
              </div>

              <div class="border-b border-secondary-200 pb-4">
                <h3 class="text-lg font-medium text-secondary-900 mb-2">Delivery Options</h3>
                <ul class="space-y-2 text-secondary-600">
                  <li class="flex items-start">
                    <svg class="h-5 w-5 text-success-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <div>
                      <span class="font-medium">Standard Shipping:</span> 3-5 business days
                    </div>
                  </li>
                  <li class="flex items-start">
                    <svg class="h-5 w-5 text-success-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <div>
                      <span class="font-medium">Express Shipping:</span> 1-2 business days
                    </div>
                  </li>
                  <li class="flex items-start">
                    <svg class="h-5 w-5 text-success-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <div>
                      <span class="font-medium">Bulk Orders:</span> Contact us for custom shipping arrangements
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 class="text-lg font-medium text-secondary-900 mb-2">Returns & Exchanges</h3>
                <p class="text-secondary-600">
                  For wholesale orders, please contact our customer service team within 7 days of receiving your order if there are any issues. All returns require approval and may be subject to a restocking fee.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <div v-if="relatedProducts.length > 0" class="mt-12">
          <h2 class="text-2xl font-bold mb-6">Related Products</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <ProductCard
                v-for="relatedProduct in relatedProducts"
                :key="relatedProduct.id"
                :product="relatedProduct"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore, Product } from '~/stores/products';
import { useCartStore } from '~/stores/cart';

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();
const config = useRuntimeConfig();

// UI state
const loading = ref(true);
const error = ref<string | null>(null);
const quantity = ref(1);
const currentImageIndex = ref(0);
const activeTab = ref('description');

// Get product ID from route
const productId = computed(() => route.params.id as string);

// Get product data
const product = computed<Product | null>(() => {
  return productStore.getProductById(productId.value) || null;
});

// Get current image
const currentImage = computed(() => {
  if (!product.value || !product.value.images || product.value.images.length === 0) {
    return null;
  }

  return product.value.images[currentImageIndex.value];
});

// Calculate if product has a discount
const hasDiscount = computed(() => {
  if (!product.value) return false;
  return Boolean(product.value.pricing.discountPercentage);
});

// Calculate original price
const originalPrice = computed(() => {
  if (!product.value || !hasDiscount.value) return 0;

  // Calculate original price from current price and discount percentage
  const discountMultiplier = 1 - (product.value.pricing.discountPercentage! / 100);
  return product.value.pricing.basePrice / discountMultiplier;
});

// Format discount text
const discountText = computed(() => {
  if (!product.value || !hasDiscount.value) return '';
  return `${product.value.pricing.discountPercentage}% OFF`;
});

// Get related products (same category, excluding current product)
const relatedProducts = computed(() => {
  if (!product.value) return [];

  return productStore.products
      .filter(p =>
          p.category === product.value!.category &&
          p.id !== product.value!.id &&
          p.isActive
      )
      .slice(0, 4);
});

// Tabs configuration
const tabs = [
  { id: 'description', name: 'Description' },
  { id: 'specifications', name: 'Specifications' },
  { id: 'shipping', name: 'Shipping & Returns' }
];

// Helper function to format price
const formatPrice = (price: number): string => {
  // Assuming JPY currency - adjust as needed
  return `¥${Math.round(price).toLocaleString()}`;
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

// Format specification key
const formatSpecKey = (key: string): string => {
  return key
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/^\w/, c => c.toUpperCase()); // Capitalize first letter
};

// Increment quantity
const incrementQuantity = () => {
  quantity.value++;
};

// Decrement quantity
const decrementQuantity = () => {
  if (quantity.value > product.value!.minOrderQuantity) {
    quantity.value--;
  } else {
    quantity.value = product.value!.minOrderQuantity;
  }
};

// Add to cart
const addToCart = () => {
  if (!product.value) return;

  if (quantity.value < product.value.minOrderQuantity) {
    quantity.value = product.value.minOrderQuantity;
    return;
  }

  cartStore.addToCart(product.value, quantity.value);

  // Show success notification (in a real app, this would be a toast notification)
  alert(`Added ${quantity.value} ${product.value.name} to cart`);
};

// Watch for changes to productId and reset state
watch(productId, () => {
  loading.value = true;
  error.value = null;
  currentImageIndex.value = 0;
  activeTab.value = 'description';
  quantity.value = 1;
});

// Watch for changes to product and set initial quantity
watch(product, (newProduct) => {
  if (newProduct) {
    quantity.value = newProduct.minOrderQuantity;
  }
});

// Fetch product data on component mount
onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;

    // First check if we already have the product in the store
    if (!product.value) {
      // If not, fetch all products (if not already loaded)
      if (productStore.products.length === 0) {
        await productStore.fetchProducts();
      }

      // If still not found, try to fetch the specific product
      if (!product.value) {
        await productStore.fetchProductById(productId.value);
      }
    }

    // If product is found, set initial quantity
    if (product.value) {
      quantity.value = product.value.minOrderQuantity;
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load product';
  } finally {
    loading.value = false;
  }
});
</script>