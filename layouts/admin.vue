<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ '-translate-x-full': !sidebarOpen }">
      <!-- Logo -->
      <div class="flex items-center justify-between p-4 border-b border-secondary-700">
        <NuxtLink to="/admin" class="flex items-center">
          <span class="text-lg font-bold text-white">WH<span class="text-primary-400">Admin</span></span>
        </NuxtLink>
        <button
            class="text-secondary-400 hover:text-white md:hidden"
            @click="toggleSidebar"
        >
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="p-4">
        <div class="space-y-1">
          <h3 class="text-xs uppercase tracking-wider text-secondary-500 font-semibold px-3 py-2">
            Dashboard
          </h3>

          <NuxtLink
              to="/admin"
              class="admin-nav-link"
              :class="{ 'admin-nav-link-active': route.path === '/admin' }"
          >
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Overview</span>
          </NuxtLink>

          <h3 class="text-xs uppercase tracking-wider text-secondary-500 font-semibold px-3 py-2 mt-6">
            Products
          </h3>

          <NuxtLink
              to="/admin/products"
              class="admin-nav-link"
              :class="{ 'admin-nav-link-active': route.path === '/admin/products' }"
          >
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Products</span>
          </NuxtLink>

          <NuxtLink
              to="/admin/categories"
              class="admin-nav-link"
              :class="{ 'admin-nav-link-active': route.path === '/admin/categories' }"
          >
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>Categories</span>
          </NuxtLink>

          <NuxtLink
              to="/admin/import"
              class="admin-nav-link"
              :class="{ 'admin-nav-link-active': route.path === '/admin/import' }"
          >
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Import Products</span>
          </NuxtLink>

          <h3 class="text-xs uppercase tracking-wider text-secondary-500 font-semibold px-3 py-2 mt-6">
            Orders
          </h3>

          <NuxtLink
              to="/admin/orders"
              class="admin-nav-link"
              :class="{ 'admin-nav-link-active': route.path === '/admin/orders' }"
          >
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span>Orders</span>
          </NuxtLink>

          <h3 class="text-xs uppercase tracking-wider text-secondary-500 font-semibold px-3 py-2 mt-6">
            Settings
          </h3>

          <NuxtLink
              to="/admin/settings"
              class="admin-nav-link"
              :class="{ 'admin-nav-link-active': route.path === '/admin/settings' }"
          >
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </NuxtLink>
        </div>
      </nav>
    </aside>

    <!-- Mobile sidebar backdrop -->
    <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
        @click="toggleSidebar"
    ></div>

    <!-- Main Content -->
    <div class="admin-content">
      <!-- Header -->
      <header class="admin-header h-16 px-4 flex items-center justify-between">
        <div class="flex items-center">
          <button
              class="text-secondary-600 hover:text-secondary-900 md:hidden"
              @click="toggleSidebar"
          >
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 class="ml-4 text-xl font-semibold text-secondary-900">{{ pageTitle }}</h1>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Notifications -->
          <div class="relative">
            <button class="text-secondary-600 hover:text-secondary-900">
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>

          <!-- Admin Dropdown -->
          <div class="relative" ref="dropdownRef">
            <button
                class="flex items-center space-x-2 text-secondary-600 hover:text-secondary-900"
                @click="toggleDropdown"
            >
              <div class="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                <span class="font-medium">A</span>
              </div>
              <span class="hidden md:inline-block">Admin</span>
              <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  :class="{ 'transform rotate-180': dropdownOpen }"
              >
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
                v-if="dropdownOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10"
            >
              <a href="#" class="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100">
                Profile
              </a>
              <a href="#" class="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100">
                Settings
              </a>
              <a href="#" class="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100">
                Help
              </a>
              <div class="border-t border-secondary-200"></div>
              <a href="#" class="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100">
                Sign out
              </a>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const sidebarOpen = ref(window.innerWidth >= 768); // Open by default on desktop
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

// Dynamically set page title based on route
const pageTitle = computed(() => {
  switch (route.path) {
    case '/admin':
      return 'Dashboard';
    case '/admin/products':
      return 'Products';
    case '/admin/categories':
      return 'Categories';
    case '/admin/import':
      return 'Import Products';
    case '/admin/orders':
      return 'Orders';
    case '/admin/settings':
      return 'Settings';
    default:
      return 'Admin Panel';
  }
});

// Toggle sidebar visibility
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

// Toggle dropdown menu
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
};

// Handle window resize for responsive sidebar
const handleResize = () => {
  if (window.innerWidth >= 768) {
    sidebarOpen.value = true;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
/* Admin Layout Styles */
.admin-layout {
  @apply min-h-screen bg-secondary-100;
}

.admin-sidebar {
  @apply fixed top-0 left-0 bottom-0 w-64 bg-secondary-800 text-white z-30 transition-transform duration-300 ease-in-out;
}

.admin-content {
  @apply ml-0 md:ml-64 min-h-screen flex flex-col;
}

.admin-header {
  @apply sticky top-0 bg-white border-b border-secondary-200 z-20;
}

.admin-nav-link {
  @apply flex items-center px-3 py-2 text-sm font-medium text-secondary-300 rounded-md hover:bg-secondary-700 hover:text-white transition duration-150 ease-in-out;
}

.admin-nav-link-active {
  @apply bg-secondary-900 text-white;
}
</style>