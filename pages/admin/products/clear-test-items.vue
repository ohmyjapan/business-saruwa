<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-secondary-900">Clear Test Products</h1>
    </div>

    <div class="bg-white rounded-card shadow-card p-6">
      <div v-if="loading" class="flex flex-col items-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p class="text-secondary-600">{{ loadingMessage }}</p>
      </div>

      <div v-else>
        <div v-if="!started" class="space-y-6">
          <div class="bg-warning-50 border border-warning-200 rounded-md p-4 mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-warning-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-warning-800">Warning</h3>
                <div class="mt-2 text-sm text-warning-700">
                  <p>This operation will remove all test products matching your patterns from the database. This action cannot be undone.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label for="testPattern" class="form-label">Test Product Patterns</label>
              <input
                  id="testPattern"
                  v-model="testPattern"
                  type="text"
                  class="form-input"
                  placeholder="e.g., TEST_, Demo, Sample"
              />
              <p class="mt-1 text-sm text-secondary-500">Enter text patterns to identify test products (comma-separated)</p>
            </div>

            <div class="flex items-center">
              <input
                  id="confirmDelete"
                  v-model="confirmed"
                  type="checkbox"
                  class="form-checkbox"
              />
              <label for="confirmDelete" class="ml-2 block text-sm text-secondary-700">
                I understand this will permanently delete all test products matching these patterns
              </label>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button
                @click="navigateTo('/admin')"
                class="btn-outline"
            >
              Cancel
            </button>
            <button
                @click="startCleanup"
                class="btn-danger"
                :disabled="!confirmed || !testPattern"
            >
              Remove All Test Products
            </button>
          </div>
        </div>

        <div v-else-if="completed" class="space-y-6">
          <div class="bg-success-50 border border-success-200 rounded-md p-4 mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-success-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-success-800">Success</h3>
                <div class="mt-2 text-sm text-success-700">
                  <p>Successfully removed {{ deletedCount }} test products from the database.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-medium">Cleanup Summary</h3>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="bg-secondary-50 p-4 rounded-md">
                <dt class="text-sm font-medium text-secondary-500">Products Found</dt>
                <dd class="mt-1 text-lg font-semibold text-secondary-900">{{ totalItems }}</dd>
              </div>
              <div class="bg-secondary-50 p-4 rounded-md">
                <dt class="text-sm font-medium text-secondary-500">Products Removed</dt>
                <dd class="mt-1 text-lg font-semibold text-secondary-900">{{ deletedCount }}</dd>
              </div>
            </dl>
          </div>

          <div class="flex justify-end">
            <button
                @click="navigateTo('/admin/products')"
                class="btn-primary"
            >
              Return to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Layout
definePageMeta({
  layout: 'admin'
});

// State
const loading = ref(false);
const loadingMessage = ref('');
const started = ref(false);
const completed = ref(false);
const confirmed = ref(false);
const testPattern = ref('TEST_, Demo, Sample');
const totalItems = ref(0);
const deletedCount = ref(0);

// Compute pattern array from comma-separated input
const patterns = computed(() => {
  return testPattern.value
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);
});

// Method to start the cleanup process
const startCleanup = async () => {
  if (!confirmed.value || patterns.value.length === 0) return;

  started.value = true;
  loading.value = true;
  loadingMessage.value = 'Finding and removing test products...';

  try {
    // Make a direct API call to our serverless function to handle the cleanup
    const result = await $fetch('/api/admin/products/clean-test-items', {
      method: 'POST',
      body: {
        patterns: patterns.value
      }
    });

    // Update the UI with the results
    totalItems.value = result.totalFound || 0;
    deletedCount.value = result.deletedCount || 0;
    completed.value = true;
  } catch (error) {
    console.error('Error during cleanup:', error);
    alert('An error occurred while cleaning up test products. Please check the console for details.');
  } finally {
    loading.value = false;
  }
};
</script>