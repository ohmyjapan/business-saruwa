<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ 'sidebar-hidden': !sidebarOpen }">
      <div class="sidebar-header">
        <NuxtLink to="/admin" class="logo">
          <span class="logo-text">WH<span class="logo-accent">Admin</span></span>
        </NuxtLink>
        <button class="mobile-close-btn" @click="toggleSidebar">
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <h3 class="nav-title">Dashboard</h3>
          <NuxtLink to="/admin" class="nav-link" :class="{ 'active': route.path === '/admin' }">
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Overview</span>
          </NuxtLink>
        </div>

        <div class="nav-section">
          <h3 class="nav-title">Products</h3>
          <NuxtLink to="/admin/products" class="nav-link" :class="{ 'active': route.path === '/admin/products' }">
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Products</span>
          </NuxtLink>

          <NuxtLink to="/admin/categories" class="nav-link" :class="{ 'active': route.path === '/admin/categories' }">
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>Categories</span>
          </NuxtLink>

          <NuxtLink to="/admin/import" class="nav-link" :class="{ 'active': route.path === '/admin/import' }">
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Import Products</span>
          </NuxtLink>
        </div>

        <div class="nav-section">
          <h3 class="nav-title">Orders</h3>
          <NuxtLink to="/admin/orders" class="nav-link" :class="{ 'active': route.path === '/admin/orders' }">
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span>Orders</span>
          </NuxtLink>
        </div>

        <div class="nav-section">
          <h3 class="nav-title">Settings</h3>
          <NuxtLink to="/admin/settings" class="nav-link" :class="{ 'active': route.path === '/admin/settings' }">
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
        class="mobile-backdrop"
        @click="toggleSidebar"
    ></div>

    <!-- Content Area -->
    <div class="admin-content">
      <!-- Header -->
      <header class="admin-header">
        <div class="header-left">
          <button
              class="mobile-menu-btn"
              @click="toggleSidebar"
          >
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>

        <div class="header-right">
          <!-- Notifications -->
          <button class="header-icon">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          <!-- Admin Profile -->
          <div class="profile-dropdown" ref="dropdownRef">
            <button @click="toggleDropdown" class="profile-button">
              <div class="avatar">A</div>
              <span class="profile-name">Admin</span>
              <svg class="dropdown-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                   :class="{ 'dropdown-open': dropdownOpen }">
                <path fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd" />
              </svg>
            </button>

            <div v-if="dropdownOpen" class="dropdown-menu">
              <a href="#" class="dropdown-item">Profile</a>
              <a href="#" class="dropdown-item">Settings</a>
              <a href="#" class="dropdown-item">Help</a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">Sign out</a>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="admin-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const sidebarOpen = ref(true);
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

// Compute page title based on current route
const pageTitle = computed(() => {
  switch (route.path) {
    case '/admin': return 'Dashboard';
    case '/admin/products': return 'Products';
    case '/admin/categories': return 'Categories';
    case '/admin/import': return 'Import Products';
    case '/admin/orders': return 'Orders';
    case '/admin/settings': return 'Settings';
    default: return 'Admin Panel';
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

// Handle responsive sidebar
onMounted(() => {
  if (typeof window !== 'undefined') {
    sidebarOpen.value = window.innerWidth >= 768;

    // Add event listeners
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);
  }
});

// Handle window resize
const handleResize = () => {
  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    sidebarOpen.value = true;
  }
};

// Clean up event listeners
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('resize', handleResize);
  }
});
</script>

<style scoped>
/* Basic reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Layout */
.admin-layout {
  min-height: 100vh;
  display: flex;
}

/* Sidebar */
.admin-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 256px;
  background-color: #1e293b;
  color: white;
  z-index: 30;
  transition: transform 0.3s ease;
}

.sidebar-hidden {
  transform: translateX(-100%);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.logo {
  text-decoration: none;
}

.logo-text {
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
}

.logo-accent {
  color: #38bdf8;
}

.mobile-close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: none;
}

/* Navigation */
.sidebar-nav {
  padding: 1rem;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.nav-title {
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 0.5rem;
  padding: 0 0.75rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 150ms ease-in-out;
}

.nav-link:hover {
  background-color: #334155;
  color: white;
}

.nav-link.active {
  background-color: #0f172a;
  color: white;
}

/* Content */
.admin-content {
  margin-left: 256px; /* Same as sidebar width */
  flex: 1;
  display: flex;
  flex-direction: column;
  width: calc(100% - 256px);
}

/* Header */
.admin-header {
  height: 4rem;
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 20;
}

.header-left {
  display: flex;
  align-items: center;
}

.mobile-menu-btn {
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 1rem;
  color: #475569;
  display: none;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  background: none;
  border: none;
  cursor: pointer;
  color: #475569;
}

.profile-dropdown {
  position: relative;
}

.profile-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #475569;
}

.avatar {
  width: 2rem;
  height: 2rem;
  background-color: #0ea5e9;
  color: white;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 0.5rem;
}

.profile-name {
  margin-right: 0.5rem;
  display: none;
}

.dropdown-arrow {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.15s ease;
}

.dropdown-open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  width: 12rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
  overflow: hidden;
  z-index: 10;
}

.dropdown-item {
  display: block;
  padding: 0.5rem 1rem;
  color: #1e293b;
  text-decoration: none;
  font-size: 0.875rem;
}

.dropdown-item:hover {
  background-color: #f1f5f9;
}

.dropdown-divider {
  border-top: 1px solid #e2e8f0;
}

/* Main content - Fix for extra bottom space */
.admin-main {
  flex: 1;
  padding: 1rem;
  background-color: #f1f5f9;
  min-height: auto; /* Remove forced height */
}

/* Mobile backdrop */
.mobile-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 20;
  display: none;
}

/* Responsive styles */
@media (max-width: 767px) {
  .mobile-close-btn {
    display: block;
  }

  .mobile-menu-btn {
    display: block;
  }

  .mobile-backdrop {
    display: block;
  }

  .admin-content {
    margin-left: 0;
    width: 100%;
  }

  .admin-sidebar {
    z-index: 40;
  }

  .profile-name {
    display: none;
  }
}

@media (min-width: 768px) {
  .profile-name {
    display: block;
  }
}

/* Only set min-height for larger screens if needed */
@media (min-height: 900px) {
  .admin-main {
    min-height: calc(100vh - 4rem); /* Only for very tall screens */
  }
}
</style>