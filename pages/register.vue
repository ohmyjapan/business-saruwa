<template>
  <div class="min-h-screen bg-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-secondary-900">
        Create your wholesale account
      </h2>
      <p class="mt-2 text-center text-sm text-secondary-600">
        Or
        <NuxtLink to="/login" class="font-medium text-primary-600 hover:text-primary-500">
          sign in to your existing account
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Company Information -->
          <div>
            <h3 class="text-sm font-medium text-secondary-700 mb-4">Company Information</h3>

            <div class="space-y-4">
              <div>
                <label for="companyName" class="block text-sm font-medium text-secondary-700">
                  Company Name <span class="text-danger-500">*</span>
                </label>
                <div class="mt-1">
                  <input
                      id="companyName"
                      v-model="form.companyName"
                      type="text"
                      required
                      class="form-input w-full"
                      :class="{ 'border-danger-300 focus:ring-danger-500 focus:border-danger-500': errors.companyName }"
                  />
                  <p v-if="errors.companyName" class="mt-2 text-sm text-danger-600">
                    {{ errors.companyName }}
                  </p>
                </div>
              </div>

              <div>
                <label for="businessType" class="block text-sm font-medium text-secondary-700">
                  Business Type <span class="text-danger-500">*</span>
                </label>
                <div class="mt-1">
                  <select
                      id="businessType"
                      v-model="form.businessType"
                      required
                      class="form-select w-full"
                      :class="{ 'border-danger-300 focus:ring-danger-500 focus:border-danger-500': errors.businessType }"
                  >
                    <option value="">Select business type</option>
                    <option value="retailer">Retailer</option>
                    <option value="distributor">Distributor</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="service_provider">Service Provider</option>
                    <option value="other">Other</option>
                  </select>
                  <p v-if="errors.businessType" class="mt-2 text-sm text-danger-600">
                    {{ errors.businessType }}
                  </p>
                </div>
              </div>

              <div>
                <label for="taxId" class="block text-sm font-medium text-secondary-700">
                  Tax ID / Business Registration Number
                </label>
                <div class="mt-1">
                  <input
                      id="taxId"
                      v-model="form.taxId"
                      type="text"
                      class="form-input w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div>
            <h3 class="text-sm font-medium text-secondary-700 mb-4">Contact Information</h3>

            <div class="space-y-4">
              <div>
                <label for="contactName" class="block text-sm font-medium text-secondary-700">
                  Contact Name <span class="text-danger-500">*</span>
                </label>
                <div class="mt-1">
                  <input
                      id="contactName"
                      v-model="form.contactName"
                      type="text"
                      required
                      class="form-input w-full"
                      :class="{ 'border-danger-300 focus:ring-danger-500 focus:border-danger-500': errors.contactName }"
                  />
                  <p v-if="errors.contactName" class="mt-2 text-sm text-danger-600">
                    {{ errors.contactName }}
                  </p>
                </div>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-secondary-700">
                  Email Address <span class="text-danger-500">*</span>
                </label>
                <div class="mt-1">
                  <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      autocomplete="email"
                      required
                      class="form-input w-full"
                      :class="{ 'border-danger-300 focus:ring-danger-500 focus:border-danger-500': errors.email }"
                  />
                  <p v-if="errors.email" class="mt-2 text-sm text-danger-600">
                    {{ errors.email }}
                  </p>
                </div>
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-secondary-700">
                  Phone Number <span class="text-danger-500">*</span>
                </label>
                <div class="mt-1">
                  <input
                      id="phone"
                      v-model="form.phone"
                      type="tel"
                      required
                      class="form-input w-full"
                      :class="{ 'border-danger-300 focus:ring-danger-500 focus:border-danger-500': errors.phone }"
                  />
                  <p v-if="errors.phone" class="mt-2 text-sm text-danger-600">
                    {{ errors.phone }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Information -->
          <div>
            <h3 class="text-sm font-medium text-secondary-700 mb-4">Account Information</h3>

            <div class="space-y-4">
              <div>
                <label for="password" class="block text-sm font-medium text-secondary-700">
                  Password <span class="text-danger-500">*</span>
                </label>
                <div class="mt-1">
                  <input
                      id="password"
                      v-model="form.password"
                      type="password"
                      autocomplete="new-password"
                      required
                      class="form-input w-full"
                      :class="{ 'border-danger-300 focus:ring-danger-500 focus:border-danger-500': errors.password }"
                  />
                  <p v-if="errors.password" class="mt-2 text-sm text-danger-600">
                    {{ errors.password }}
                  </p>
                </div>
              </div>

              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-secondary-700">
                  Confirm Password <span class="text-danger-500">*</span>
                </label>
                <div class="mt-1">
                  <input
                      id="confirmPassword"
                      v-model="form.confirmPassword"
                      type="password"
                      autocomplete="new-password"
                      required
                      class="form-input w-full"
                      :class="{ 'border-danger-300 focus:ring-danger-500 focus:border-danger-500': errors.confirmPassword }"
                  />
                  <p v-if="errors.confirmPassword" class="mt-2 text-sm text-danger-600">
                    {{ errors.confirmPassword }}
                  </p>
                </div>
              </div>

              <div>
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                        id="terms"
                        v-model="form.agreeTerms"
                        type="checkbox"
                        required
                        class="form-checkbox"
                        :class="{ 'border-danger-300 focus:ring-danger-500 focus:border-danger-500': errors.agreeTerms }"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="terms" class="font-medium text-secondary-700">
                      I agree to the
                      <a href="#" class="text-primary-600 hover:text-primary-500">Terms of Service</a>
                      and
                      <a href="#" class="text-primary-600 hover:text-primary-500">Privacy Policy</a>
                    </label>
                    <p v-if="errors.agreeTerms" class="mt-2 text-sm text-danger-600">
                      {{ errors.agreeTerms }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-md">
            {{ errorMessage }}
          </div>

          <div>
            <button
                type="submit"
                class="btn-primary w-full py-2.5"
                :disabled="isSubmitting"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form state
const form = reactive({
  companyName: '',
  businessType: '',
  taxId: '',
  contactName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const errors = reactive({
  companyName: '',
  businessType: '',
  contactName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: ''
});

// Form submission
const handleSubmit = async () => {
  // Reset errors
  errorMessage.value = '';
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });

  // Validate form
  let isValid = true;

  if (!form.companyName) {
    errors.companyName = 'Company name is required';
    isValid = false;
  }

  if (!form.businessType) {
    errors.businessType = 'Business type is required';
    isValid = false;
  }

  if (!form.contactName) {
    errors.contactName = 'Contact name is required';
    isValid = false;
  }

  if (!form.email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Email is invalid';
    isValid = false;
  }

  if (!form.phone) {
    errors.phone = 'Phone is required';
    isValid = false;
  }

  if (!form.password) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
    isValid = false;
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
    isValid = false;
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }

  if (!form.agreeTerms) {
    errors.agreeTerms = 'You must agree to the terms and conditions';
    isValid = false;
  }

  if (!isValid) return;

  // Submit form
  isSubmitting.value = true;

  try {
    // Simulate API call (In a real app, you would call your auth API here)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo purposes, let's pretend we got a successful registration
    alert('Account created successfully! You will receive an email once your account is approved.');

    // Redirect to login page
    router.push('/login');
  } catch (error) {
    console.error('Registration error:', error);
    errorMessage.value = 'Something went wrong. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>