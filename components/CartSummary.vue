<template>
  <div class="bg-white rounded-lg shadow-card">
    <div class="p-6">
      <h2 class="text-lg font-medium text-secondary-900 mb-4">Order Summary</h2>

      <!-- Items count -->
      <div class="text-sm text-secondary-700 mb-4">
        {{ cartCount }} item{{ cartCount !== 1 ? 's' : '' }} in cart
      </div>

      <!-- Price breakdown -->
      <div class="space-y-3 border-t border-b border-secondary-200 py-4 mb-4">
        <div class="flex justify-between">
          <span class="text-secondary-600">Subtotal</span>
          <span class="text-secondary-900 font-medium">{{ formatPrice(priceSummary.subtotal) }}</span>
        </div>

        <div v-if="priceSummary.discount > 0" class="flex justify-between">
          <span class="text-secondary-600">Discount</span>
          <span class="text-danger-600 font-medium">-{{ formatPrice(priceSummary.discount) }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-secondary-600">Tax</span>
          <span class="text-secondary-900 font-medium">{{ formatPrice(priceSummary.tax) }}</span>
        </div>

        <div class="flex justify-between pt-2 border-t border-secondary-200">
          <span class="text-secondary-900 font-semibold">Total</span>
          <span class="text-primary-600 font-bold text-lg">{{ formatPrice(priceSummary.total) }}</span>
        </div>
      </div>

      <!-- Coupon code form -->
      <div v-if="showCouponForm" class="mb-4">
        <div class="flex">
          <input
              type="text"
              v-model="couponCode"
              placeholder="Enter coupon code"
              class="form-input flex-1 rounded-r-none"
              :class="{'border-danger-300 focus:border-danger-500 focus:ring-danger-500': couponError}"
          />
          <button
              type="button"
              class="btn-primary rounded-l-none"
              :disabled="!couponCode || couponLoading"
              @click="applyCoupon"
          >
            <span v-if="couponLoading">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Applying...
            </span>
            <span v-else>Apply</span>
          </button>
        </div>
        <p v-if="couponError" class="mt-1 text-sm text-danger-600">{{ couponError }}</p>
      </div>

      <!-- Applied coupon display -->
      <div v-if="appliedCoupon" class="bg-success-50 text-success-800 px-3 py-2 rounded-md mb-4 flex justify-between items-center">
        <div>
          <div class="text-sm font-medium">{{ appliedCoupon.code }}</div>
          <div class="text-xs">{{ appliedCoupon.discountPercentage }}% discount applied</div>
        </div>
        <button
            type="button"
            class="text-sm text-success-700 hover:text-success-800"
            @click="removeCoupon"
        >
          Remove
        </button>
      </div>

      <!-- Toggle coupon form -->
      <div v-if="!showCouponForm && !appliedCoupon" class="mb-4">
        <button
            type="button"
            class="text-sm text-primary-600 hover:text-primary-700 focus:outline-none"
            @click="showCouponForm = true"
        >
          Apply discount code
        </button>
      </div>

      <!-- Continue to checkout button -->
      <div>
        <button
            type="button"
            class="btn-primary w-full py-2.5"
            :disabled="isEmpty"
            @click="$emit('checkout')"
        >
          Continue to Checkout
        </button>
      </div>

      <!-- Accepted payment methods (for visual purposes) -->
      <div class="mt-4 flex justify-center space-x-3">
        <div v-for="method in paymentMethods" :key="method.name" class="text-secondary-400">
          <component :is="method.icon" class="h-6 w-auto" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCartStore } from '~/stores/cart';

const emit = defineEmits(['checkout']);

const cartStore = useCartStore();
const { priceSummary, appliedCoupon, isEmpty, cartCount } = storeToRefs(cartStore);

const showCouponForm = ref(false);
const couponCode = ref('');
const couponLoading = ref(false);
const couponError = ref('');

// Helper function to format price
const formatPrice = (price: number): string => {
  // Assuming JPY currency - adjust as needed
  return `¥${Math.round(price).toLocaleString()}`;
};

// Apply coupon code
const applyCoupon = async () => {
  if (!couponCode.value) return;

  couponLoading.value = true;
  couponError.value = '';

  try {
    // In a real app, this would be an API call
    // For demo purposes, we're using the simulated method in the cart store
    const success = cartStore.applyCoupon(couponCode.value);

    if (success) {
      showCouponForm.value = false;
      couponCode.value = '';
    } else {
      couponError.value = 'Invalid coupon code';
    }
  } catch (error) {
    console.error('Error applying coupon:', error);
    couponError.value = 'Error applying coupon';
  } finally {
    couponLoading.value = false;
  }
};

// Remove applied coupon
const removeCoupon = () => {
  cartStore.removeCoupon();
};

// Payment method icons (for visual purposes only)
const paymentMethods = [
  {
    name: 'Visa',
    icon: defineComponent({
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor' }, [
          h('path', { d: 'M10 13h7.7c.3-.4.3-.6.4-.9l2.4-7.3c.1-.2 0-.4-.1-.5-.1-.2-.4-.3-.6-.3H6.6l-.3-1.1c-.1-.5-.5-.9-1-.9H2c-.5 0-1 .4-1 1v.5c0 .6.5 1 1 1h2.6l2.3 10.9c.2.6.7 1.1 1.4 1.1h10.6c.5 0 1-.4 1-1V15c0-.6-.5-1-1-1H10c-.5 0-1 .4-1 1v.5c0 .6.5 1 1 1z' })
        ]);
      }
    })
  },
  {
    name: 'Mastercard',
    icon: defineComponent({
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor' }, [
          h('path', { d: 'M12 17.5c1.4 0 2.5-1.1 2.5-2.5s-1.1-2.5-2.5-2.5-2.5 1.1-2.5 2.5 1.1 2.5 2.5 2.5zm-7.5-2.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5z' }),
          h('path', { d: 'M20 4H4C2.3 4 1 5.3 1 7v10c0 1.7 1.3 3 3 3h16c1.7 0 3-1.3 3-3V7c0-1.7-1.3-3-3-3zm1 13c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h16c.6 0 1 .4 1 1v10z' })
        ]);
      }
    })
  },
  {
    name: 'PayPal',
    icon: defineComponent({
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor' }, [
          h('path', { d: 'M19.9 7.2c.1-.7 0-1.2-.3-1.7s-.8-.8-1.4-1.1c-.7-.2-1.5-.4-2.4-.4h-5.6c-.2 0-.3.1-.4.2 0 .1-.1.2-.1.3l-1.5 9.7v.1c0 .1.1.2.3.2h2.3l.2-1 .5-3.2c0-.2.2-.3.4-.3h1.6c1.6 0 2.9-.3 3.8-1 .8-.6 1.4-1.5 1.6-2.8zm-2.6 1.3c-.3.4-.9.7-1.7.7h-1.3c-.2 0-.3.1-.4.3l-.5 3c0 .1 0 .1.1.2s.1.1.2.1h1.5c.5 0 .9 0 1.3-.1.3-.1.6-.2.8-.4.2-.2.3-.4.3-.6l.1-.4c.1-.4 0-.7-.1-1-.2-.5-.6-.8-1.3-.8z' }),
          h('path', { d: 'M9.7 10.2c0-.2-.2-.3-.4-.3H6.5c-.2 0-.3.1-.4.3l-2.2 14c0 .1 0 .1.1.2 0 .1.1.1.2.1h2.8c.2 0 .3-.1.4-.3l.6-3.8c0-.2.2-.3.4-.3h1.9c1.8 0 3.2-.4 4.1-1.1.9-.7 1.5-1.8 1.8-3.2.3-1.3.2-2.4-.3-3.2-.5-.8-1.5-1.1-2.8-1.1h-2.2c-.2 0-.3.1-.4.3l-.5 3v-.1c-.1-.2-.1-.3-.3-.3H7.5c-.2 0-.3.1-.4.3L6.5 19c0 .1 0 .1.1.2 0 .1.1.1.2.1h2.8c.2 0 .3-.1.4-.3l.6-3.8c0-.2.2-.3.4-.3h1.9c1.8 0 3.2-.4 4.1-1.1.9-.7 1.5-1.8 1.8-3.2.3-1.3.2-2.4-.3-3.2-.5-.8-1.5-1.1-2.8-1.1h-2.2c-.2 0-.3.1-.4.3l-.5 3.1z' })
        ]);
      }
    })
  },
  {
    name: 'Bank Transfer',
    icon: defineComponent({
      render() {
        return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor' }, [
          h('path', { d: 'M4 10v7h3v-7H4zm6 0v7h3v-7h-3zm-8 9h19v3H2v-3zm16-9v7h3v-7h-3zm-8-8L2 6v2h19V6l-9-4z' })
        ]);
      }
    })
  }
];
</script>