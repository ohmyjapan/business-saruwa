<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="py-8 flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="py-8">
      <div class="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>
      <div class="mt-4 text-center">
        <button @click="goBack" class="text-primary-600 hover:text-primary-700">
          Back to Products
        </button>
      </div>
    </div>

    <!-- Product not found -->
    <div v-else-if="!product" class="py-8 text-center">
      <h1 class="text-2xl font-bold mb-4">Product Not Found</h1>
      <p class="text-secondary-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
      <button @click="goBack" class="btn-primary">
        Back to Products
      </button>
    </div>

    <!-- Debug info - REMOVE AFTER DEBUGGING -->
    <div class="bg-gray-100 p-4 rounded-md mb-4">
      <h3 class="font-bold mb-2">Debug Info:</h3>
      <p>Route ID: {{ $route.params.id }}</p>
      <p>Product found: {{ product ? 'Yes' : 'No' }}</p>
      <p>Loading: {{ loading }}</p>
      <p>Error: {{ error }}</p>
    </div>

    <!-- Edit form -->
    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-secondary-900">Edit Product</h1>
        <div class="flex space-x-3">
          <button
              @click="goBack"
              class="btn-outline flex items-center"
          >
            <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Back
          </button>
          <button
              @click="saveProduct"
              class="btn-primary flex items-center"
              :disabled="isSaving"
          >
            <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            Save Changes
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-card">
        <div class="p-6 border-b border-secondary-200">
          <h2 class="text-lg font-medium text-secondary-900">Product Information</h2>
          <p class="text-sm text-secondary-500 mt-1">Basic product details and information</p>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Product Name -->
            <div>
              <label for="name" class="form-label">Product Name <span class="text-danger-500">*</span></label>
              <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors.name }"
              />
              <p v-if="validationErrors.name" class="mt-1 text-sm text-danger-600">
                {{ validationErrors.name }}
              </p>
            </div>

            <!-- JAN Code -->
            <div>
              <label for="janCode" class="form-label">JAN Code <span class="text-danger-500">*</span></label>
              <input
                  id="janCode"
                  v-model="form.janCode"
                  type="text"
                  class="form-input"
                  :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors.janCode }"
              />
              <p v-if="validationErrors.janCode" class="mt-1 text-sm text-danger-600">
                {{ validationErrors.janCode }}
              </p>
            </div>

            <!-- SKU -->
            <div>
              <label for="sku" class="form-label">SKU <span class="text-danger-500">*</span></label>
              <input
                  id="sku"
                  v-model="form.sku"
                  type="text"
                  class="form-input"
                  :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors.sku }"
              />
              <p v-if="validationErrors.sku" class="mt-1 text-sm text-danger-600">
                {{ validationErrors.sku }}
              </p>
            </div>

            <!-- Brand -->
            <div>
              <label for="brand" class="form-label">Brand</label>
              <input
                  id="brand"
                  v-model="form.brand"
                  type="text"
                  class="form-input"
              />
            </div>

            <!-- Category -->
            <div>
              <label for="category" class="form-label">Category</label>
              <select
                  id="category"
                  v-model="form.category"
                  class="form-select"
              >
                <option value="">Select a category</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <!-- Stock -->
            <div>
              <label for="stock" class="form-label">Stock <span class="text-danger-500">*</span></label>
              <input
                  id="stock"
                  v-model.number="form.stock"
                  type="number"
                  min="0"
                  class="form-input"
                  :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors.stock }"
              />
              <p v-if="validationErrors.stock" class="mt-1 text-sm text-danger-600">
                {{ validationErrors.stock }}
              </p>
            </div>

            <!-- Min Order Quantity -->
            <div>
              <label for="minOrderQuantity" class="form-label">Min Order Quantity</label>
              <input
                  id="minOrderQuantity"
                  v-model.number="form.minOrderQuantity"
                  type="number"
                  min="1"
                  class="form-input"
              />
            </div>

            <!-- Base Price -->
            <div>
              <label for="basePrice" class="form-label">Base Price <span class="text-danger-500">*</span></label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-secondary-500">¥</span>
                </div>
                <input
                    id="basePrice"
                    v-model.number="form.pricing.basePrice"
                    type="number"
                    min="0"
                    step="1"
                    class="form-input pl-7"
                    :class="{ 'border-danger-300 focus:border-danger-500 focus:ring-danger-500': validationErrors['pricing.basePrice'] }"
                />
              </div>
              <p v-if="validationErrors['pricing.basePrice']" class="mt-1 text-sm text-danger-600">
                {{ validationErrors['pricing.basePrice'] }}
              </p>
            </div>

            <!-- Discount Percentage -->
            <div>
              <label for="discountPercentage" class="form-label">Discount Percentage</label>
              <div class="relative">
                <input
                    id="discountPercentage"
                    v-model.number="form.pricing.discountPercentage"
                    type="number"
                    min="0"
                    max="100"
                    class="form-input pr-7"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span class="text-secondary-500">%</span>
                </div>
              </div>
            </div>

            <!-- Status Toggles -->
            <div class="lg:col-span-2 grid grid-cols-3 gap-4">
              <div class="bg-white rounded-lg border border-secondary-200 p-4">
                <div class="flex items-center justify-between">
                  <label for="isActive" class="text-sm font-medium text-secondary-900">Active</label>
                  <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input
                        type="checkbox"
                        id="isActive"
                        v-model="form.isActive"
                        class="form-checkbox toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                        for="isActive"
                        class="toggle-label block overflow-hidden h-6 rounded-full bg-secondary-300 cursor-pointer"
                        :class="{ 'bg-primary-500': form.isActive }"
                    ></label>
                  </div>
                </div>
                <p class="mt-1 text-xs text-secondary-500">Product will be visible to customers</p>
              </div>

              <div class="bg-white rounded-lg border border-secondary-200 p-4">
                <div class="flex items-center justify-between">
                  <label for="isNew" class="text-sm font-medium text-secondary-900">New</label>
                  <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input
                        type="checkbox"
                        id="isNew"
                        v-model="form.isNew"
                        class="form-checkbox toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                        for="isNew"
                        class="toggle-label block overflow-hidden h-6 rounded-full bg-secondary-300 cursor-pointer"
                        :class="{ 'bg-primary-500': form.isNew }"
                    ></label>
                  </div>
                </div>
                <p class="mt-1 text-xs text-secondary-500">Show in new arrivals section</p>
              </div>

              <div class="bg-white rounded-lg border border-secondary-200 p-4">
                <div class="flex items-center justify-between">
                  <label for="isFeatured" class="text-sm font-medium text-secondary-900">Featured</label>
                  <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input
                        type="checkbox"
                        id="isFeatured"
                        v-model="form.isFeatured"
                        class="form-checkbox toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                        for="isFeatured"
                        class="toggle-label block overflow-hidden h-6 rounded-full bg-secondary-300 cursor-pointer"
                        :class="{ 'bg-primary-500': form.isFeatured }"
                    ></label>
                  </div>
                </div>
                <p class="mt-1 text-xs text-secondary-500">Show in featured products section</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Description Section -->
      <div class="bg-white rounded-lg shadow-card mt-6">
        <div class="p-6 border-b border-secondary-200">
          <h2 class="text-lg font-medium text-secondary-900">Description</h2>
          <p class="text-sm text-secondary-500 mt-1">Detailed product description</p>
        </div>
        <div class="p-6">
          <textarea
              v-model="form.description"
              rows="6"
              class="form-input w-full"
              placeholder="Enter product description..."
          ></textarea>
        </div>
      </div>

      <!-- Tags Section -->
      <div class="bg-white rounded-lg shadow-card mt-6">
        <div class="p-6 border-b border-secondary-200">
          <h2 class="text-lg font-medium text-secondary-900">Tags</h2>
          <p class="text-sm text-secondary-500 mt-1">Add tags to help customers find this product</p>
        </div>
        <div class="p-6">
          <div class="space-y-2">
            <div class="flex flex-wrap gap-2 mb-3">
              <div
                  v-for="(tag, index) in form.tags"
                  :key="index"
                  class="bg-secondary-100 text-secondary-800 px-2 py-1 rounded-md flex items-center text-sm"
              >
                <span>{{ tag }}</span>
                <button
                    type="button"
                    @click="removeTag(index)"
                    class="ml-1 text-secondary-500 hover:text-secondary-700"
                >
                  <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex">
              <input
                  v-model="newTag"
                  type="text"
                  class="form-input flex-1"
                  placeholder="Add a tag..."
                  @keydown.enter.prevent="addTag"
              />
              <button
                  type="button"
                  @click="addTag"
                  class="ml-2 btn-primary"
                  :disabled="!newTag.trim()"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Images Section -->
      <div class="bg-white rounded-lg shadow-card mt-6">
        <div class="p-6 border-b border-secondary-200">
          <h2 class="text-lg font-medium text-secondary-900">Product Images</h2>
          <p class="text-sm text-secondary-500 mt-1">Upload and manage product images</p>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div
                v-for="(image, index) in form.images"
                :key="image.id"
                class="relative border border-secondary-200 rounded-lg overflow-hidden aspect-w-1 aspect-h-1 group"
            >
              <img
                  :src="getImageUrl(image.src)"
                  :alt="image.alt"
                  class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    type="button"
                    @click="deleteImage(index)"
                    class="p-2 bg-danger-600 text-white rounded-full hover:bg-danger-700"
                >
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button
                    type="button"
                    @click="setDefaultImage(index)"
                    class="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 ml-2"
                    :disabled="image.isDefault"
                >
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              </div>
              <div
                  v-if="image.isDefault"
                  class="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-2 py-1"
              >
                Default
              </div>
            </div>

            <!-- Add new image button -->
            <div
                class="border-2 border-dashed border-secondary-300 rounded-lg flex items-center justify-center aspect-w-1 aspect-h-1 cursor-pointer hover:border-primary-500 transition-colors"
                @click="openFileInput"
            >
              <div class="text-center">
                <svg class="h-10 w-10 text-secondary-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="mt-1 text-sm text-secondary-500">Add Image</p>
              </div>
            </div>
          </div>
          <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
              class="hidden"
              @change="handleFileUpload"
          />
        </div>
      </div>

      <!-- Specifications Section -->
      <div class="bg-white rounded-lg shadow-card mt-6 mb-6">
        <div class="p-6 border-b border-secondary-200">
          <h2 class="text-lg font-medium text-secondary-900">Specifications</h2>
          <p class="text-sm text-secondary-500 mt-1">Add technical specifications</p>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div
                v-for="(spec, key, index) in form.specifications"
                :key="index"
                class="flex gap-4"
            >
              <input
                  v-model="specKeys[index]"
                  type="text"
                  class="form-input w-1/3"
                  placeholder="Specification name"
              />
              <input
                  v-model="form.specifications[key]"
                  type="text"
                  class="form-input flex-1"
                  placeholder="Specification value"
              />
              <button
                  type="button"
                  @click="removeSpecification(key)"
                  class="btn-outline text-danger-600 hover:bg-danger-50"
              >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <button
                type="button"
                @click="addSpecification"
                class="btn-outline flex items-center"
            >
              <svg class="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Add Specification
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// Import types from your types directory instead of from store files directly
import type { Product, ProductImage } from '~/types';
import { useProductStore } from '~/stores/products';
import { randomUUID } from 'crypto';

// Tell Nuxt to use the admin layout
definePageMeta({
  layout: 'admin'
});

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const config = useRuntimeConfig();

// Refs
const fileInput = ref<HTMLInputElement | null>(null);
const newTag = ref('');
const specKeys = ref<string[]>([]);

// State
const loading = ref(true);
const error = ref<string | null>(null);
const isSaving = ref(false);
const validationErrors = reactive<Record<string, string>>({});

// Get product ID from route
const productId = computed(() => route.params.id as string);

// Explicitly check and log the route and params for debugging
watch(() => route.params, (newParams) => {
  console.log('Route params changed:', newParams);
}, { immediate: true });

// Computed property to get product from store
const product = computed(() => {
  console.log('Looking for product with ID:', productId.value);
  const foundProduct = productStore.getProductById(productId.value);
  console.log('Found product in store:', foundProduct);
  return foundProduct;
});

// Default empty form state
const emptyForm = {
  id: '',
  name: '',
  description: '',
  janCode: '',
  sku: '',
  brand: '',
  category: '',
  subcategory: '',
  tags: [] as string[],
  minOrderQuantity: 1,
  stock: 0,
  pricing: {
    basePrice: 0,
    currency: 'JPY',
    discountPercentage: 0
  },
  images: [] as ProductImage[],
  specifications: {} as Record<string, string>,
  isActive: true,
  isNew: false,
  isFeatured: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Form reactive state
const form = reactive({ ...emptyForm });

// Get available categories from the store
const categories = computed(() => productStore.categories);

// Helper function to get image URL
const getImageUrl = (imagePath: string): string => {
  // Check if the path is already a URL
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }

  // If it's a relative path, prepend the upload URL
  return `${config.public.uploadUrl}/${imagePath}`;
};

// Handle adding a new tag
const addTag = () => {
  if (newTag.value.trim()) {
    if (!form.tags.includes(newTag.value.trim())) {
      form.tags.push(newTag.value.trim());
    }
    newTag.value = '';
  }
};

// Handle removing a tag
const removeTag = (index: number) => {
  form.tags.splice(index, 1);
};

// Handle opening file input
const openFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// Handle file upload
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    // In a real application, you would upload these files to a server
    // For now, we'll just create image objects with local URLs
    Array.from(input.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const isFirstImage = form.images.length === 0;
          form.images.push({
            id: randomUUID(),
            src: e.target.result as string,
            alt: file.name,
            isDefault: isFirstImage
          });
        }
      };
      reader.readAsDataURL(file);
    });

    // Clear the input so the same file can be selected again
    input.value = '';
  }
};

// Handle setting default image
const setDefaultImage = (index: number) => {
  form.images.forEach((image, i) => {
    image.isDefault = i === index;
  });
};

// Handle deleting an image
const deleteImage = (index: number) => {
  const wasDefault = form.images[index].isDefault;
  form.images.splice(index, 1);

  // If we deleted the default image and there are still images left, set a new default
  if (wasDefault && form.images.length > 0) {
    form.images[0].isDefault = true;
  }
};

// Handle adding a specification
const addSpecification = () => {
  const newKey = `spec_${Object.keys(form.specifications).length + 1}`;
  form.specifications[newKey] = '';
  specKeys.value.push(newKey);
};

// Handle removing a specification
const removeSpecification = (key: string) => {
  const index = specKeys.value.findIndex(k => k === key || form.specifications[k] === form.specifications[key]);
  if (index !== -1) {
    specKeys.value.splice(index, 1);
  }
  delete form.specifications[key];
};

// Validate form
const validateForm = (): boolean => {
  validationErrors.name = '';
  validationErrors.janCode = '';
  validationErrors.sku = '';
  validationErrors.stock = '';
  validationErrors['pricing.basePrice'] = '';

  let isValid = true;

  if (!form.name) {
    validationErrors.name = 'Product name is required';
    isValid = false;
  }

  if (!form.janCode) {
    validationErrors.janCode = 'JAN Code is required';
    isValid = false;
  }

  if (!form.sku) {
    validationErrors.sku = 'SKU is required';
    isValid = false;
  }

  if (form.stock < 0) {
    validationErrors.stock = 'Stock cannot be negative';
    isValid = false;
  }

  if (form.pricing.basePrice <= 0) {
    validationErrors['pricing.basePrice'] = 'Price must be greater than 0';
    isValid = false;
  }

  return isValid;
};

// Save product changes
const saveProduct = async () => {
  if (!validateForm()) {
    // Scroll to the first error
    const firstErrorEl = document.querySelector('.border-danger-300');
    if (firstErrorEl) {
      firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  try {
    isSaving.value = true;

    // Update specifications from spec keys
    const updatedSpecs: Record<string, string> = {};
    specKeys.value.forEach((key, index) => {
      const oldKey = Object.keys(form.specifications)[index];
      if (key && oldKey) {
        updatedSpecs[key] = form.specifications[oldKey];
      }
    });
    form.specifications = updatedSpecs;

    // Update the updatedAt timestamp
    form.updatedAt = new Date().toISOString();

    // In a real application, you would call your API here
    // For example:
    // await useFetch(`/api/admin/products/${form.id}`, {
    //   method: 'PUT',
    //   body: form
    // });

    // For now, we'll just wait 1 second to simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // TODO: Update product in store/database
    console.log('Product saved:', form);

    // Show success message
    alert('Product updated successfully!');

    // Navigate back to products list
    router.push('/admin/products');
  } catch (err: any) {
    console.error('Error saving product:', err);
    error.value = err.message || 'Failed to save product';
  } finally {
    isSaving.value = false;
  }
};

// Navigate back
const goBack = () => {
  router.push('/admin/products');
};

// Load product data
const loadProduct = async () => {
  try {
    loading.value = true;
    error.value = null;

    console.log('Loading product with ID:', productId.value);

    // First ensure we have products loaded
    if (productStore.products.length === 0) {
      console.log('Products array is empty, fetching all products...');
      await productStore.fetchProducts();
      console.log('Products loaded:', productStore.products.length);
    }

    // Get product from store by ID
    let currentProduct = productStore.getProductById(productId.value);

    if (currentProduct) {
      console.log('Found product in store:', currentProduct.name);
      // Copy product data to form
      Object.assign(form, JSON.parse(JSON.stringify(currentProduct)));

      // Initialize spec keys
      if (currentProduct.specifications) {
        specKeys.value = Object.keys(currentProduct.specifications);
      }
    } else {
      console.log('Product not found in store, fetching from API...');
      try {
        // Try to fetch the product
        currentProduct = await productStore.fetchProductById(productId.value);

        if (currentProduct) {
          console.log('Fetched product from API:', currentProduct.name);
          // Copy product data to form
          Object.assign(form, JSON.parse(JSON.stringify(currentProduct)));

          // Initialize spec keys
          if (currentProduct.specifications) {
            specKeys.value = Object.keys(currentProduct.specifications);
          }
        } else {
          console.log('Product not found in API');
          error.value = 'Product not found';
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        error.value = 'Failed to fetch product';
      }
    }
  } catch (err: any) {
    console.error('Error loading product:', err);
    error.value = err.message || 'Failed to load product';
  } finally {
    loading.value = false;
  }
};

// Watch for product ID changes
watch(productId, () => {
  console.log('Product ID changed to:', productId.value);
  loadProduct();
}, { immediate: true });

// Initialize component
onMounted(() => {
  console.log('Admin product edit page mounted');
  loadProduct();
});
</script>

<style scoped>
/* Toggle switch styles */
.toggle-checkbox:checked {
  right: 0;
  transform: translateX(100%);
  border-color: white;
}
.toggle-checkbox:checked + .toggle-label {
  @apply bg-primary-500;
}
</style>