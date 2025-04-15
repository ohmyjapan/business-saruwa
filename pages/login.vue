<template>
  <div class="min-h-screen bg-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-secondary-900">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-secondary-600">
        Or
        <NuxtLink to="/register" class="font-medium text-primary-600 hover:text-primary-500">
          create a new wholesale account
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-secondary-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                  id="email"
                  v-model="email"
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
            <label for="password" class="block text-sm font-medium text-secondary-700">
              Password
            </label>
            <div class="mt-1">
              <input
                  id="password"
                  v-model="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="form-input w-full"
                  :class="{ 'border-danger-300 focus:ring-danger-500 focus:border-danger-500': errors.password }"
              />
              <p v-if="errors.password" class="mt-2 text-sm text-danger-600">
                {{ errors.password }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                  id="remember-me"
                  v-model="rememberMe"
                  type="checkbox"
                  class="form-checkbox"
              />
              <label for="remember-me" class="ml-2 block text-sm text-secondary-900">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </a>
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
              {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-secondary-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-secondary-500">
                Or continue with
              </span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-3">
            <button
                type="button"
                class="w-full inline-flex justify-center py-2 px-4 border border-secondary-300 rounded-md shadow-sm bg-white text-sm font-medium text-secondary-700 hover:bg-secondary-50"
            >
              <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2v-2zm0-2h2V7h-2v7z"/>
              </svg>
              Single Sign-On
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form state
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref('');
const errors = reactive({
  email: '',
  password: ''
});

// Form submission
const handleSubmit = async () => {
  // Reset errors
  errorMessage.value = '';
  errors.email = '';
  errors.password = '';

  // Validate form
  let isValid = true;

  if (!email.value) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    errors.email = 'Email is invalid';
    isValid = false;
  }

  if (!password.value) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (password.value.length < 6) {
    errors.password = 'Password must be at least 6 characters';
    isValid = false;
  }

  if (!isValid) return;

  // Submit form
  isSubmitting.value = true;

  try {
    // Simulate API call (In a real app, you would call your auth API here)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo purposes, let's pretend we got a successful login
    if (email.value === 'admin@example.com' && password.value === 'password123') {
      // Redirect to admin dashboard
      router.push('/admin');
    } else if (email.value === 'user@example.com' && password.value === 'password123') {
      // Redirect to user dashboard
      router.push('/');
    } else {
      // Show error
      errorMessage.value = 'Invalid email or password';
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = 'Something went wrong. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>