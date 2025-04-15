<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-subtle">
      <!-- Top Bar -->
      <div class="bg-primary-800 text-white">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between py-2 text-sm">
            <div class="flex items-center space-x-4">
              <a href="mailto:info@example.com" class="flex items-center hover:text-primary-200">
                <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                info@example.com
              </a>
              <a href="tel:+81123456789" class="flex items-center hover:text-primary-200">
                <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +81 123-456-789
              </a>
            </div>
            <div class="hidden md:flex items-center space-x-4">
              <NuxtLink to="/about" class="hover:text-primary-200">About Us</NuxtLink>
              <NuxtLink to="/contact" class="hover:text-primary-200">Contact</NuxtLink>
              <NuxtLink to="/faq" class="hover:text-primary-200">FAQ</NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Navigation -->
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between py-4">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center">
            <span class="text-2xl font-bold text-primary-700">Wholesale<span class="text-primary-500">Hub</span></span>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <NuxtLink to="/" class="nav-link">Home</NuxtLink>
            <NuxtLink to="/products" class="nav-link">Products</NuxtLink>
            <NuxtLink to="/categories" class="nav-link">Categories</NuxtLink>
            <NuxtLink to="/brands" class="nav-link">Brands</NuxtLink>
          </nav>

          <!-- User Actions -->
          <div class="flex items-center space-x-4">
            <button
                type="button"
                class="md:hidden text-secondary-700 hover:text-primary-600"
                @click="mobileMenuOpen = true"
            >
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <NuxtLink
                to="/account"
                class="hidden sm:flex items-center text-secondary-700 hover:text-primary-600"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              <span class="ml-1 text-sm font-medium">Account</span>
            </NuxtLink>

            <NuxtLink
                to="/cart"
                class="relative flex items-center text-secondary-700 hover:text-primary-600"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              <span class="ml-1 text-sm font-medium hidden sm:inline">Cart</span>
              <span
                  v-if="cartCount > 0"
                  class="absolute -top-2 -right-2 sm:right-auto sm:-top-2 sm:ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary-600 rounded-full"
              >
                {{ cartCount }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-secondary-900 text-white pt-12 pb-6">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          <!-- Company Info -->
          <div>
            <h3 class="text-lg font-bold mb-4">Wholesale<span class="text-primary-500">Hub</span></h3>
            <p class="text-secondary-300 mb-4">
              Your trusted partner for wholesale products.
              We offer competitive prices and quality products for businesses of all sizes.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-secondary-300 hover:text-white">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-secondary-300 hover:text-white">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" class="text-secondary-300 hover:text-white">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="text-secondary-300 hover:text-white">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/products" class="text-secondary-300 hover:text-white">Products</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/categories" class="text-secondary-300 hover:text-white">Categories</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/brands" class="text-secondary-300 hover:text-white">Brands</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/about" class="text-secondary-300 hover:text-white">About Us</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact" class="text-secondary-300 hover:text-white">Contact</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/faq" class="text-secondary-300 hover:text-white">FAQ</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Policies -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Policies</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/privacy-policy" class="text-secondary-300 hover:text-white">Privacy Policy</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/terms-of-service" class="text-secondary-300 hover:text-white">Terms of Service</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/shipping-policy" class="text-secondary-300 hover:text-white">Shipping Policy</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/return-policy" class="text-secondary-300 hover:text-white">Return Policy</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact Us</h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <svg class="h-5 w-5 text-secondary-400 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                <span class="text-secondary-300">
                  123 Business Street<br>
                  Tokyo, Japan 100-0001
                </span>
              </li>
              <li class="flex items-center">
                <svg class="h-5 w-5 text-secondary-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href="mailto:info@example.com" class="text-secondary-300 hover:text-white">info@example.com</a>
              </li>
              <li class="flex items-center">
                <svg class="h-5 w-5 text-secondary-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a3 3 0 00-3 3v2H7a1 1 0 000 2h1v1a1 1 0 01-1 1 1 1 0 100 2h6a1 1 0 100-2H9.83c.11-.313.17-.65.17-1v-1h1a1 1 0 100-2h-1V7a1 1 0 112 0 1 1 0 102 0 3 3 0 00-3-3z" clip-rule="evenodd" />
                </svg>
                <span class="text-secondary-300">Mon-Fri, 9:00 AM - 6:00 PM JST</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Copyright -->
        <div class="pt-8 mt-8 border-t border-secondary-800 text-center">
          <p class="text-secondary-400 text-sm">
            &copy; {{ new Date().getFullYear() }} WholesaleHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>

    <!-- Mobile Menu -->
    <div
        v-if="mobileMenuOpen"
        class="fixed inset-0 z-50 overflow-hidden"
        @click.self="mobileMenuOpen = false"
    >
      <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      <div class="absolute inset-y-0 left-0 max-w-full flex">
        <div class="relative w-screen max-w-sm">
          <div class="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
            <!-- Mobile menu header -->
            <div class="p-4 border-b border-secondary-200 flex items-center justify-between">
              <h2 class="text-lg font-medium text-secondary-900">Menu</h2>
              <button
                  type="button"
                  class="text-secondary-600 hover:text-secondary-900"
                  @click="mobileMenuOpen = false"
              >
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Mobile menu content -->
            <div class="pt-2 pb-6">
              <div class="px-4 py-6">
                <div class="space-y-1">
                  <NuxtLink
                      to="/"
                      class="block px-3 py-2 rounded-md text-base font-medium text-secondary-900 hover:bg-secondary-50"
                      @click="mobileMenuOpen = false"
                  >
                    Home
                  </NuxtLink>
                  <NuxtLink
                      to="/products"
                      class="block px-3 py-2 rounded-md text-base font-medium text-secondary-900 hover:bg-secondary-50"
                      @click="mobileMenuOpen = false"
                  >
                    Products
                  </NuxtLink>
                  <NuxtLink
                      to="/categories"
                      class="block px-3 py-2 rounded-md text-base font-medium text-secondary-900 hover:bg-secondary-50"
                      @click="mobileMenuOpen = false"
                  >
                    Categories
                  </NuxtLink>
                  <NuxtLink
                      to="/brands"
                      class="block px-3 py-2 rounded-md text-base font-medium text-secondary-900 hover:bg-secondary-50"
                      @click="mobileMenuOpen = false"
                  >
                    Brands
                  </NuxtLink>
                </div>
              </div>

              <div class="border-t border-secondary-200 px-4 py-6">
                <div class="space-y-1">
                  <NuxtLink
                      to="/about"
                      class="block px-3 py-2 rounded-md text-base font-medium text-secondary-900 hover:bg-secondary-50"
                      @click="mobileMenuOpen = false"
                  >
                    About Us
                  </NuxtLink>
                  <NuxtLink
                      to="/contact"
                      class="block px-3 py-2 rounded-md text-base font-medium text-secondary-900 hover:bg-secondary-50"
                      @click="mobileMenuOpen = false"
                  >
                    Contact
                  </NuxtLink>
                  <NuxtLink
                      to="/faq"
                      class="block px-3 py-2 rounded-md text-base font-medium text-secondary-900 hover:bg-secondary-50"
                      @click="mobileMenuOpen = false"
                  >
                    FAQ
                  </NuxtLink>
                </div>
              </div>

              <div class="border-t border-secondary-200 px-4 py-6">
                <div class="space-y-1">
                  <NuxtLink
                      to="/account"
                      class="block px-3 py-2 rounded-md text-base font-medium text-secondary-900 hover:bg-secondary-50"
                      @click="mobileMenuOpen = false"
                  >
                    My Account
                  </NuxtLink>
                  <NuxtLink
                      to="/login"
                      class="block px-3 py-2 rounded-md text-base font-medium text-secondary-900 hover:bg-secondary-50"
                      @click="mobileMenuOpen = false"
                  >
                    Log In
                  </NuxtLink>
                  <NuxtLink
                      to="/register"
                      class="block px-3 py-2 rounded-md text-base font-medium text-secondary-900 hover:bg-secondary-50"
                      @click="mobileMenuOpen = false"
                  >
                    Register
                  </NuxtLink>
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
import { ref, onMounted } from 'vue';
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();
const { cartCount } = storeToRefs(cartStore);

const mobileMenuOpen = ref(false);

// CSS for active navigation links
const navLinkClass = 'relative text-secondary-600 hover:text-primary-600 py-2 transition-colors duration-200';
const activeNavLinkClass = 'text-primary-600 font-medium';

// Load cart data on component mount
onMounted(() => {
  cartStore.loadCart();
});
</script>

<style scoped>
.nav-link {
  @apply relative text-secondary-600 hover:text-primary-600 py-2 transition-colors duration-200;
}

.nav-link.router-link-active {
  @apply text-primary-600 font-medium;
}

.nav-link.router-link-active::after {
  content: '';
  @apply absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full;
}
</style>
0 20 20" fill="currentColor">
<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
</svg>
<span class="text-secondary-300">+81 123-456-789</span>
</li>
<li class="flex items-center">
<svg class="h-5 w-5 text-secondary-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0