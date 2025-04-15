<template>
  <div>
    <!-- Page Header -->
    <section class="bg-primary-700 text-white py-8">
      <div class="container mx-auto px-4">
        <h1 class="text-2xl md:text-3xl font-bold">Checkout</h1>
        <div class="flex items-center text-sm text-primary-200 mt-2">
          <NuxtLink to="/" class="hover:text-white">Home</NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink to="/cart" class="hover:text-white">Cart</NuxtLink>
          <span class="mx-2">/</span>
          <span>Checkout</span>
        </div>
      </div>
    </section>

    <!-- Empty cart redirect -->
    <div v-if="isEmpty" class="py-12 text-center">
      <div class="container mx-auto px-4">
        <div class="bg-secondary-50 rounded-lg p-8 max-w-lg mx-auto">
          <svg class="h-12 w-12 text-secondary-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 class="text-xl font-medium text-secondary-900 mb-4">Your cart is empty</h2>
          <p class="text-secondary-600 mb-6">
            You need to add items to your cart before proceeding to checkout.
          </p>
          <NuxtLink to="/products" class="btn-primary">
            Browse Products
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Checkout content -->
    <div v-else class="py-8 md:py-12">
      <div class="container mx-auto px-4">
        <!-- Order progress steps -->
        <div class="mb-8 hidden md:block">
          <div class="flex items-center justify-between">
            <div class="flex-1 relative">
              <div class="h-1 bg-primary-500"></div>
              <div class="absolute top-0 -ml-2 -mt-2 left-0">
                <div class="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <svg class="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div class="absolute top-0 -ml-2 -mt-2 right-0">
                <div class="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-xs font-bold">2</span>
                </div>
              </div>
              <div class="flex justify-between mt-4">
                <span class="text-sm font-medium text-primary-600">Cart</span>
                <span class="text-sm font-medium text-primary-600">Checkout</span>
              </div>
            </div>
            <div class="flex-1 ml-4 relative">
              <div class="h-1 bg-secondary-200"></div>
              <div class="absolute top-0 -ml-2 -mt-2 right-0">
                <div class="w-5 h-5 bg-secondary-200 rounded-full flex items-center justify-center">
                  <span class="text-secondary-600 text-xs font-bold">3</span>
                </div>
              </div>
              <div class="flex justify-end mt-4">
                <span class="text-sm font-medium text-secondary-600">Confirmation</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:grid lg:grid-cols-12 lg:gap-12">
          <!-- Checkout form (left column) -->
          <div class="lg:col-span-8">
            <div class="bg-white rounded-lg shadow-card mb-6">
              <div class="p-6 border-b border-secondary-200">
                <h2 class="text-lg font-semibold">Company Information</h2>
                <p class="text-sm text-secondary-600 mt-1">
                  Please provide your business details
                </p>
              </div>

              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label for="companyName" class="form-label">Company Name <span class="text-danger-500">*</span></label>
                    <input
                        id="companyName"
                        v-model="customer.companyName"
                        type="text"
                        class="form-input"
                        :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors.companyName }"
                    />
                    <p v-if="validationErrors.companyName" class="mt-1 text-sm text-danger-600">
                      {{ validationErrors.companyName }}
                    </p>
                  </div>

                  <div>
                    <label for="contactName" class="form-label">Contact Name <span class="text-danger-500">*</span></label>
                    <input
                        id="contactName"
                        v-model="customer.contactName"
                        type="text"
                        class="form-input"
                        :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors.contactName }"
                    />
                    <p v-if="validationErrors.contactName" class="mt-1 text-sm text-danger-600">
                      {{ validationErrors.contactName }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label for="email" class="form-label">Email Address <span class="text-danger-500">*</span></label>
                    <input
                        id="email"
                        v-model="customer.email"
                        type="email"
                        class="form-input"
                        :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors.email }"
                    />
                    <p v-if="validationErrors.email" class="mt-1 text-sm text-danger-600">
                      {{ validationErrors.email }}
                    </p>
                  </div>

                  <div>
                    <label for="phone" class="form-label">Phone Number <span class="text-danger-500">*</span></label>
                    <input
                        id="phone"
                        v-model="customer.phone"
                        type="tel"
                        class="form-input"
                        :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors.phone }"
                    />
                    <p v-if="validationErrors.phone" class="mt-1 text-sm text-danger-600">
                      {{ validationErrors.phone }}
                    </p>
                  </div>
                </div>

                <div class="mb-6">
                  <label for="companyRegistration" class="form-label">Company Registration Number</label>
                  <input
                      id="companyRegistration"
                      v-model="customer.companyRegistration"
                      type="text"
                      class="form-input"
                  />
                  <p class="mt-1 text-xs text-secondary-500">
                    Optional: Business registration or tax ID
                  </p>
                </div>
              </div>
            </div>

            <!-- Shipping address -->
            <div class="bg-white rounded-lg shadow-card mb-6">
              <div class="p-6 border-b border-secondary-200">
                <h2 class="text-lg font-semibold">Shipping Address</h2>
                <p class="text-sm text-secondary-600 mt-1">
                  Where should we ship your order?
                </p>
              </div>

              <div class="p-6">
                <div class="mb-6">
                  <label for="address_line1" class="form-label">Address Line 1 <span class="text-danger-500">*</span></label>
                  <input
                      id="address_line1"
                      v-model="customer.address.line1"
                      type="text"
                      class="form-input"
                      :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors['address.line1'] }"
                      placeholder="Street address, P.O. box, company name"
                  />
                  <p v-if="validationErrors['address.line1']" class="mt-1 text-sm text-danger-600">
                    {{ validationErrors['address.line1'] }}
                  </p>
                </div>

                <div class="mb-6">
                  <label for="address_line2" class="form-label">Address Line 2</label>
                  <input
                      id="address_line2"
                      v-model="customer.address.line2"
                      type="text"
                      class="form-input"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label for="address_city" class="form-label">City <span class="text-danger-500">*</span></label>
                    <input
                        id="address_city"
                        v-model="customer.address.city"
                        type="text"
                        class="form-input"
                        :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors['address.city'] }"
                    />
                    <p v-if="validationErrors['address.city']" class="mt-1 text-sm text-danger-600">
                      {{ validationErrors['address.city'] }}
                    </p>
                  </div>

                  <div>
                    <label for="address_state" class="form-label">State / Prefecture <span class="text-danger-500">*</span></label>
                    <input
                        id="address_state"
                        v-model="customer.address.state"
                        type="text"
                        class="form-input"
                        :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors['address.state'] }"
                    />
                    <p v-if="validationErrors['address.state']" class="mt-1 text-sm text-danger-600">
                      {{ validationErrors['address.state'] }}
                    </p>
                  </div>

                  <div>
                    <label for="address_postalCode" class="form-label">Postal Code <span class="text-danger-500">*</span></label>
                    <input
                        id="address_postalCode"
                        v-model="customer.address.postalCode"
                        type="text"
                        class="form-input"
                        :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors['address.postalCode'] }"
                    />
                    <p v-if="validationErrors['address.postalCode']" class="mt-1 text-sm text-danger-600">
                      {{ validationErrors['address.postalCode'] }}
                    </p>
                  </div>
                </div>

                <div class="mb-6">
                  <label for="address_country" class="form-label">Country <span class="text-danger-500">*</span></label>
                  <select
                      id="address_country"
                      v-model="customer.address.country"
                      class="form-select"
                      :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors['address.country'] }"
                  >
                    <option value="">Select Country</option>
                    <option value="Japan">Japan</option>
                    <option value="United States">United States</option>
                    <option value="China">China</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Australia">Australia</option>
                    <option value="New Zealand">New Zealand</option>
                  </select>
                  <p v-if="validationErrors['address.country']" class="mt-1 text-sm text-danger-600">
                    {{ validationErrors['address.country'] }}
                  </p>
                </div>

                <!-- Billing address -->
                <div>
                  <div class="mb-4">
                    <label class="flex items-center">
                      <input
                          type="checkbox"
                          v-model="customer.billingAddress.sameAsShipping"
                          class="form-checkbox"
                      />
                      <span class="ml-2 text-secondary-700">Billing address is the same as shipping address</span>
                    </label>
                  </div>

                  <div v-if="!customer.billingAddress.sameAsShipping" class="border-t border-secondary-200 pt-6">
                    <h3 class="text-md font-semibold mb-4">Billing Address</h3>

                    <div class="mb-6">
                      <label for="billing_line1" class="form-label">Address Line 1 <span class="text-danger-500">*</span></label>
                      <input
                          id="billing_line1"
                          v-model="customer.billingAddress.line1"
                          type="text"
                          class="form-input"
                          :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors['billingAddress.line1'] }"
                          placeholder="Street address, P.O. box, company name"
                      />
                      <p v-if="validationErrors['billingAddress.line1']" class="mt-1 text-sm text-danger-600">
                        {{ validationErrors['billingAddress.line1'] }}
                      </p>
                    </div>

                    <div class="mb-6">
                      <label for="billing_line2" class="form-label">Address Line 2</label>
                      <input
                          id="billing_line2"
                          v-model="customer.billingAddress.line2"
                          type="text"
                          class="form-input"
                          placeholder="Apartment, suite, unit, building, floor, etc."
                      />
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label for="billing_city" class="form-label">City <span class="text-danger-500">*</span></label>
                        <input
                            id="billing_city"
                            v-model="customer.billingAddress.city"
                            type="text"
                            class="form-input"
                            :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors['billingAddress.city'] }"
                        />
                        <p v-if="validationErrors['billingAddress.city']" class="mt-1 text-sm text-danger-600">
                          {{ validationErrors['billingAddress.city'] }}
                        </p>
                      </div>

                      <div>
                        <label for="billing_state" class="form-label">State / Prefecture <span class="text-danger-500">*</span></label>
                        <input
                            id="billing_state"
                            v-model="customer.billingAddress.state"
                            type="text"
                            class="form-input"
                            :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors['billingAddress.state'] }"
                        />
                        <p v-if="validationErrors['billingAddress.state']" class="mt-1 text-sm text-danger-600">
                          {{ validationErrors['billingAddress.state'] }}
                        </p>
                      </div>

                      <div>
                        <label for="billing_postalCode" class="form-label">Postal Code <span class="text-danger-500">*</span></label>
                        <input
                            id="billing_postalCode"
                            v-model="customer.billingAddress.postalCode"
                            type="text"
                            class="form-input"
                            :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors['billingAddress.postalCode'] }"
                        />
                        <p v-if="validationErrors['billingAddress.postalCode']" class="mt-1 text-sm text-danger-600">
                          {{ validationErrors['billingAddress.postalCode'] }}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label for="billing_country" class="form-label">Country <span class="text-danger-500">*</span></label>
                      <select
                          id="billing_country"
                          v-model="customer.billingAddress.country"
                          class="form-select"
                          :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors['billingAddress.country'] }"
                      >
                        <option value="">Select Country</option>
                        <option value="Japan">Japan</option>
                        <option value="United States">United States</option>
                        <option value="China">China</option>
                        <option value="South Korea">South Korea</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="Philippines">Philippines</option>
                        <option value="Australia">Australia</option>
                        <option value="New Zealand">New Zealand</option>
                      </select>
                      <p v-if="validationErrors['billingAddress.country']" class="mt-1 text-sm text-danger-600">
                        {{ validationErrors['billingAddress.country'] }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order notes -->
            <div class="bg-white rounded-lg shadow-card mb-6 lg:mb-0">
              <div class="p-6 border-b border-secondary-200">
                <h2 class="text-lg font-semibold">Order Notes</h2>
                <p class="text-sm text-secondary-600 mt-1">
                  Any special instructions for your order
                </p>
              </div>

              <div class="p-6">
                <div class="mb-6">
                  <label for="notes" class="form-label">Additional Notes</label>
                  <textarea
                      id="notes"
                      v-model="customer.notes"
                      class="form-input"
                      rows="4"
                      placeholder="Special delivery instructions, business hours, or any other information you'd like to share"
                  ></textarea>
                </div>

                <!-- Payment Method Notice -->
                <div class="bg-secondary-50 p-4 rounded-lg text-sm">
                  <p class="font-medium text-secondary-900 mb-2">Payment Method Notice</p>
                  <p class="text-secondary-600">
                    This is a wholesale inquiry platform. For new customers, we will review your order and contact you to arrange payment. Established customers will receive an invoice according to their agreed payment terms.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Order summary (right column) -->
          <div class="lg:col-span-4">
            <div class="bg-white rounded-lg shadow-card sticky top-6">
              <div class="p-6 border-b border-secondary-200">
                <h2 class="text-lg font-semibold">Order Summary</h2>
              </div>

              <div class="p-6">
                <!-- Order details -->
                <div class="mb-6">
                  <div v-for="(item, index) in items" :key="index" class="flex py-3 border-b border-secondary-100 last:border-0">
                    <div class="flex-shrink-0 w-16 h-16 bg-secondary-100 rounded-md overflow-hidden mr-4">
                      <img
                          v-if="item.image"
                          :src="getImageUrl(item.image)"
                          :alt="item.name"
                          class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="flex-1">
                      <h3 class="text-sm font-medium text-secondary-900">{{ item.name }}</h3>
                      <p class="text-xs text-secondary-500 mb-1">
                        Qty: {{ item.quantity }}
                      </p>
                      <p class="text-sm font-medium">
                        {{ formatPrice(item.price * item.quantity) }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Price breakdown -->
                <div class="space-y-3 border-t border-b border-secondary-200 py-4">
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

                <!-- Submit Order Button -->
                <div class="mt-6">
                  <button
                      type="button"
                      :disabled="isSubmitting"
                      class="btn-primary w-full py-3"
                      @click="submitOrder"
                  >
                    <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isSubmitting ? 'Processing...' : 'Submit Wholesale Order' }}
                  </button>

                  <!-- Terms agreement -->
                  <div class="mt-4 text-xs text-secondary-600 text-center">
                    By placing this order, you agree to our
                    <a href="#" class="text-primary-600 hover:text-primary-700">Terms of Service</a>
                    and
                    <a href="#" class="text-primary-600 hover:text-primary-700">Privacy Policy</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '~/stores/cart';

const router = useRouter();
const cartStore = useCartStore();
const config = useRuntimeConfig();

const { items, isEmpty, priceSummary } = storeToRefs(cartStore);
const customer = ref(cartStore.customer);
const isSubmitting = ref(false);
const validationErrors = reactive<Record<string, string>>({});

// Helper function to get image URL
const getImageUrl = (imagePath: string): string => {
  // Check if the path is already a URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If it's a relative path, prepend the upload URL
  return `${config.public.uploadUrl}/${imagePath}`;
};

// Helper function to format price
const formatPrice = (price: number): string => {
  return `¥${Math.round(price).toLocaleString()}`;
};

// Validate the form
const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(validationErrors).forEach(key => delete validationErrors[key]);

  let isValid = true;

  // Validate company info
  if (!customer.value.companyName) {
    validationErrors.companyName = 'Company name is required';
    isValid = false;
  }

  if (!customer.value.contactName) {
    validationErrors.contactName = 'Contact name is required';
    isValid = false;
  }

  if (!customer.value.email) {
    validationErrors.email = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.value.email)) {
    validationErrors.email = 'Please enter a valid email address';
    isValid = false;
  }

  if (!customer.value.phone) {
    validationErrors.phone = 'Phone number is required';
    isValid = false;
  }

  // Validate shipping address
  if (!customer.value.address.line1) {
    validationErrors['address.line1'] = 'Address is required';
    isValid = false;
  }

  if (!customer.value.address.city) {
    validationErrors['address.city'] = 'City is required';
    isValid = false;
  }

  if (!customer.value.address.state) {
    validationErrors['address.state'] = 'State/Prefecture is required';
    isValid = false;
  }

  if (!customer.value.address.postalCode) {
    validationErrors['address.postalCode'] = 'Postal code is required';
    isValid = false;
  }

  if (!customer.value.address.country) {
    validationErrors['address.country'] = 'Country is required';
    isValid = false;
  }

  // Validate billing address if different from shipping
  if (!customer.value.billingAddress.sameAsShipping) {
    if (!customer.value.billingAddress.line1) {
      validationErrors['billingAddress.line1'] = 'Billing address is required';
      isValid = false;
    }

    if (!customer.value.billingAddress.city) {
      validationErrors['billingAddress.city'] = 'City is required';
      isValid = false;
    }

    if (!customer.value.billingAddress.state) {
      validationErrors['billingAddress.state'] = 'State/Prefecture is required';
      isValid = false;
    }

    if (!customer.value.billingAddress.postalCode) {
      validationErrors['billingAddress.postalCode'] = 'Postal code is required';
      isValid = false;
    }

    if (!customer.value.billingAddress.country) {
      validationErrors['billingAddress.country'] = 'Country is required';
      isValid = false;
    }
  }

  return isValid;
};

// Submit the order
const submitOrder = async () => {
  if (!validateForm()) {
    // Scroll to the first error
    const firstErrorEl = document.querySelector('.border-danger-300');
    if (firstErrorEl) {
      firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  try {
    isSubmitting.value = true;

    // Update customer info in the cart store
    cartStore.updateCustomerInfo(customer.value);

    // Submit the order (this sends to Slack in the backend)
    const result = await cartStore.submitOrder();

    if (result.success) {
      // Redirect to confirmation page
      router.push(`/confirmation?orderId=${result.orderId}`);
    } else {
      alert(`Error: ${result.error || 'Failed to submit order'}`);
      isSubmitting.value = false;
    }
  } catch (error: any) {
    console.error('Error submitting order:', error);
    alert(`Error: ${error.message || 'An unexpected error occurred'}`);
    isSubmitting.value = false;
  }
};

// Load customer info from cart store
onMounted(() => {
  // Load cart data if not already loaded
  cartStore.loadCart();

  // Redirect to cart page if cart is empty
  if (isEmpty.value) {
    router.push('/cart');
  }
});
</script>