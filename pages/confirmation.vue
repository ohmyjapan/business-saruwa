<template>
  <div>
    <!-- Page Header -->
    <section class="bg-primary-700 text-white py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-2xl md:text-3xl font-bold">Order Confirmation</h1>
        <div class="flex items-center text-sm text-primary-200 mt-2">
          <NuxtLink to="/" class="hover:text-white">Home</NuxtLink>
          <span class="mx-2">/</span>
          <span>Confirmation</span>
        </div>
      </div>
    </section>

    <!-- Confirmation Content -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <div class="bg-white rounded-lg shadow-card mb-8 overflow-hidden">
            <!-- Success Header -->
            <div class="bg-success-50 p-6 text-center">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-success-100 rounded-full text-success-600 mb-4">
                <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-success-800 mb-2">
                Thank You for Your Order!
              </h2>
              <p class="text-success-600">
                Your wholesale order has been successfully received.
              </p>
            </div>

            <!-- Order Details -->
            <div class="p-6">
              <div class="flex items-center justify-between mb-4 pb-4 border-b border-secondary-200">
                <div>
                  <h3 class="font-medium text-secondary-900">Order ID</h3>
                  <p class="text-secondary-600">{{ orderId }}</p>
                </div>
                <div class="text-right">
                  <h3 class="font-medium text-secondary-900">Order Date</h3>
                  <p class="text-secondary-600">{{ formattedDate }}</p>
                </div>
              </div>

              <p class="text-secondary-600 mb-8">
                We've sent a confirmation email to <span class="font-medium text-secondary-900">{{ orderEmail }}</span> with the details of your order.
              </p>

              <h3 class="text-lg font-medium text-secondary-900 mb-4">What Happens Next?</h3>

              <ul class="space-y-6 mb-8">
                <li class="flex">
                  <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 mr-3">
                    <span class="text-sm font-semibold">1</span>
                  </div>
                  <div>
                    <h4 class="font-medium text-secondary-900">Order Review</h4>
                    <p class="text-secondary-600">
                      Our team will review your wholesale order request within 1-2 business days.
                    </p>
                  </div>
                </li>

                <li class="flex">
                  <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 mr-3">
                    <span class="text-sm font-semibold">2</span>
                  </div>
                  <div>
                    <h4 class="font-medium text-secondary-900">Order Confirmation</h4>
                    <p class="text-secondary-600">
                      We'll contact you to confirm the order details and discuss payment options.
                    </p>
                  </div>
                </li>

                <li class="flex">
                  <div class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 mr-3">
                    <span class="text-sm font-semibold">3</span>
                  </div>
                  <div>
                    <h4 class="font-medium text-secondary-900">Shipping</h4>
                    <p class="text-secondary-600">
                      Once payment is processed, your order will be prepared and shipped to your location.
                    </p>
                  </div>
                </li>
              </ul>

              <div class="bg-secondary-50 p-6 rounded-lg mb-8">
                <h3 class="text-lg font-medium text-secondary-900 mb-2">
                  Need Assistance?
                </h3>
                <p class="text-secondary-600 mb-4">
                  If you have any questions or concerns about your order, please don't hesitate to contact us.
                </p>
                <div class="flex flex-wrap gap-6">
                  <div>
                    <div class="text-sm font-medium text-secondary-900 mb-1">Email</div>
                    <a href="mailto:support@example.com" class="text-primary-600 hover:text-primary-700">
                      support@example.com
                    </a>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-secondary-900 mb-1">Phone</div>
                    <a href="tel:+81123456789" class="text-primary-600 hover:text-primary-700">
                      +81 123-456-789
                    </a>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-secondary-900 mb-1">Business Hours</div>
                    <div class="text-secondary-600">Mon-Fri, 9:00 AM - 6:00 PM JST</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-4 justify-center">
            <NuxtLink to="/" class="btn-primary py-2.5 px-6">
              Return to Home
            </NuxtLink>
            <NuxtLink to="/products" class="btn-outline py-2.5 px-6">
              Continue Shopping
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '~/stores/cart';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

// Get order ID from query parameters
const orderId = ref(route.query.orderId || 'Unknown');

// Placeholder for order email (in a real app, this would come from the backend)
const orderEmail = ref('');

// Format current date
const formattedDate = computed(() => {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

onMounted(() => {
  // Redirect if no order ID is present
  if (!route.query.orderId) {
    router.push('/');
    return;
  }

  // Set email from cart store's customer data
  orderEmail.value = cartStore.customer.email || 'example@company.com';
});
</script>