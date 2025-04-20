<template>
  <div class="product-detail-page">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading product information...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 class="error-title">Something went wrong</h2>
      <p class="error-message">{{ error }}</p>
      <button @click="goBack" class="btn-secondary margin-top-4">
        Back to Products
      </button>
    </div>

    <!-- Product not found -->
    <div v-else-if="!currentProduct" class="not-found-container">
      <div class="not-found-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="not-found-title">Product Not Found</h2>
      <p class="not-found-message">The product you're looking for doesn't exist or has been removed.</p>
      <button @click="goBack" class="btn-primary margin-top-4">
        Back to Products
      </button>
    </div>

    <!-- Edit form -->
    <div v-if="currentProduct" class="edit-form-container">
      <!-- Header with actions -->
      <div class="form-header">
        <div class="header-content">
          <h1 class="form-title">{{ currentProduct.name }}</h1>
          <p class="text-secondary-500">Product ID: #{{ currentProduct.id.toString().padStart(6, '0') }}</p>
        </div>
        <div class="header-actions">
          <button
              @click="goBack"
              class="btn-outline"
          >
            <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Back
          </button>
          <button
              @click="saveProduct"
              class="btn-primary margin-left-3"
              :disabled="isSaving"
          >
            <svg v-if="isSaving" class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            Save Changes
          </button>
        </div>
      </div>

      <!-- Main form content in a grid layout -->
      <div class="form-content">
        <!-- Left column: Product info -->
        <div class="form-left-column">
          <!-- Basic Information Card -->
          <div class="form-card">
            <div class="card-header">
              <h2 class="card-title">Basic Information</h2>
            </div>
            <div class="card-content">
              <div class="form-group">
                <label for="name" class="form-label">Product Name <span class="required-mark">*</span></label>
                <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    class="form-input"
                    :class="{ 'error-input': validationErrors.name }"
                />
                <p v-if="validationErrors.name" class="error-message">
                  {{ validationErrors.name }}
                </p>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="janCode" class="form-label">JAN Code <span class="required-mark">*</span></label>
                  <input
                      id="janCode"
                      v-model="form.janCode"
                      type="text"
                      class="form-input"
                      :class="{ 'error-input': validationErrors.janCode }"
                  />
                  <p v-if="validationErrors.janCode" class="error-message">
                    {{ validationErrors.janCode }}
                  </p>
                </div>

                <div class="form-group">
                  <label for="sku" class="form-label">SKU <span class="required-mark">*</span></label>
                  <input
                      id="sku"
                      v-model="form.sku"
                      type="text"
                      class="form-input"
                      :class="{ 'error-input': validationErrors.sku }"
                  />
                  <p v-if="validationErrors.sku" class="error-message">
                    {{ validationErrors.sku }}
                  </p>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="brand" class="form-label">Brand</label>
                  <input
                      id="brand"
                      v-model="form.brand"
                      type="text"
                      class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label for="category" class="form-label">Category</label>
                  <select
                      id="category"
                      v-model="form.category"
                      class="form-select"
                  >
                    <option value="">Select a category</option>
                    <option v-for="category in availableCategories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Pricing & Inventory Card -->
          <div class="form-card">
            <div class="card-header">
              <h2 class="card-title">Pricing & Inventory</h2>
            </div>
            <div class="card-content">
              <div class="form-row">
                <div class="form-group">
                  <label for="basePrice" class="form-label">Base Price <span class="required-mark">*</span></label>
                  <div class="input-with-icon">
                    <div class="input-icon">¥</div>
                    <input
                        id="basePrice"
                        v-model.number="form.pricing.basePrice"
                        type="number"
                        min="0"
                        step="1"
                        class="form-input with-left-icon"
                        :class="{ 'error-input': validationErrors['pricing.basePrice'] }"
                    />
                  </div>
                  <p v-if="validationErrors['pricing.basePrice']" class="error-message">
                    {{ validationErrors['pricing.basePrice'] }}
                  </p>
                </div>

                <div class="form-group">
                  <label for="increaseRate" class="form-label">Markup Rate (%)</label>
                  <div class="input-with-icon">
                    <input
                        id="increaseRate"
                        v-model.number="form.pricing.increaseRate"
                        type="number"
                        min="0"
                        max="1000"
                        class="form-input with-right-icon"
                    />
                    <div class="input-icon-right">%</div>
                  </div>
                </div>
              </div>

              <!-- Add calculated retail price display -->
              <div class="price-preview">
                <div class="calculated-price">
                  <div class="price-label">Retail Price:</div>
                  <div class="price-value">¥{{ formatPrice(calculatedRetailPrice) }}</div>
                </div>

                <div class="form-group">
                  <label for="discountPercentage" class="form-label">Discount (%)</label>
                  <div class="input-with-icon">
                    <input
                        id="discountPercentage"
                        v-model.number="form.pricing.discountPercentage"
                        type="number"
                        min="0"
                        max="100"
                        class="form-input with-right-icon"
                    />
                    <div class="input-icon-right">%</div>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="stock" class="form-label">Stock <span class="required-mark">*</span></label>
                  <input
                      id="stock"
                      v-model.number="form.stock"
                      type="number"
                      min="0"
                      class="form-input"
                      :class="{ 'error-input': validationErrors.stock }"
                  />
                  <p v-if="validationErrors.stock" class="error-message">
                    {{ validationErrors.stock }}
                  </p>
                </div>

                <div class="form-group">
                  <label for="minOrderQuantity" class="form-label">Min Order Quantity</label>
                  <input
                      id="minOrderQuantity"
                      v-model.number="form.minOrderQuantity"
                      type="number"
                      min="1"
                      class="form-input"
                  />
                </div>
              </div>

              <!-- Status Toggles -->
              <div class="toggles-container">
                <div class="toggle-item">
                  <label for="isActive" class="toggle-label">Active</label>
                  <div class="toggle-description">Product will be visible to customers</div>
                  <div class="toggle-switch">
                    <input
                        type="checkbox"
                        id="isActive"
                        v-model="form.isActive"
                        class="toggle-input"
                    />
                    <label for="isActive" class="toggle-slider"></label>
                  </div>
                </div>

                <div class="toggle-item">
                  <label for="isNew" class="toggle-label">New</label>
                  <div class="toggle-description">Show in new arrivals section</div>
                  <div class="toggle-switch">
                    <input
                        type="checkbox"
                        id="isNew"
                        v-model="form.isNew"
                        class="toggle-input"
                    />
                    <label for="isNew" class="toggle-slider"></label>
                  </div>
                </div>

                <div class="toggle-item">
                  <label for="isFeatured" class="toggle-label">Featured</label>
                  <div class="toggle-description">Show in featured products section</div>
                  <div class="toggle-switch">
                    <input
                        type="checkbox"
                        id="isFeatured"
                        v-model="form.isFeatured"
                        class="toggle-input"
                    />
                    <label for="isFeatured" class="toggle-slider"></label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Description Card -->
          <div class="form-card">
            <div class="card-header">
              <h2 class="card-title">Description</h2>
              <div class="description-tabs">
                <button
                    @click="descriptionMode = 'text'"
                    :class="['tab-btn', descriptionMode === 'text' ? 'active-tab' : '']"
                >
                  Text
                </button>
                <button
                    @click="descriptionMode = 'html'"
                    :class="['tab-btn', descriptionMode === 'html' ? 'active-tab' : '']"
                >
                  HTML
                </button>
                <button
                    @click="descriptionMode = 'preview'"
                    :class="['tab-btn', descriptionMode === 'preview' ? 'active-tab' : '']"
                >
                  Preview
                </button>
              </div>
            </div>
            <div class="card-content">
              <div class="form-group">
                <textarea
                    v-if="descriptionMode === 'text' || descriptionMode === 'html'"
                    v-model="form.description"
                    rows="6"
                    class="form-textarea"
                    placeholder="Enter product description..."
                ></textarea>
                <div
                    v-if="descriptionMode === 'preview'"
                    class="description-preview"
                    v-html="form.description"
                ></div>
                <div class="description-helper" v-if="descriptionMode === 'html'">
                  <p>You can use HTML tags to format your description:</p>
                  <div class="html-examples">
                    <button @click="insertHtmlTag('b')" class="html-btn">Bold</button>
                    <button @click="insertHtmlTag('i')" class="html-btn">Italic</button>
                    <button @click="insertHtmlTag('u')" class="html-btn">Underline</button>
                    <button @click="insertHtmlTag('h2')" class="html-btn">Heading</button>
                    <button @click="insertHtmlTag('ul')" class="html-btn">List</button>
                    <button @click="insertHtmlTag('a')" class="html-btn">Link</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tags Card -->
          <div class="form-card">
            <div class="card-header">
              <h2 class="card-title">Tags</h2>
              <p class="card-subtitle">Add tags to help customers find this product</p>
            </div>
            <div class="card-content">
              <div class="tags-container">
                <div class="tags-list">
                  <div
                      v-for="(tag, index) in form.tags"
                      :key="index"
                      class="tag-item"
                  >
                    <span>{{ tag }}</span>
                    <button
                        type="button"
                        @click="removeTag(index)"
                        class="tag-remove"
                    >
                      <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div class="tags-input">
                  <input
                      v-model="newTag"
                      type="text"
                      class="form-input"
                      placeholder="Add a tag..."
                      @keydown.enter.prevent="addTag"
                  />
                  <button
                      type="button"
                      @click="addTag"
                      class="btn-primary"
                      :disabled="!newTag.trim()"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column: Images -->
        <div class="form-right-column">
          <div class="form-card">
            <div class="card-header">
              <h2 class="card-title">Product Images</h2>
              <p class="card-subtitle">Upload and manage product images</p>
            </div>
            <div class="card-content">
              <div class="images-grid">
                <div
                    v-for="(image, index) in form.images"
                    :key="image.id"
                    class="image-item"
                    :class="{ 'is-default': image.isDefault }"
                >
                  <div class="image-preview">
                    <img
                        :src="getImageUrl(image.src)"
                        :alt="image.alt"
                        class="image-preview-img"
                    />
                    <div v-if="image.isDefault" class="default-badge">Default</div>
                  </div>
                  <div class="image-actions">
                    <button
                        type="button"
                        @click="setDefaultImage(index)"
                        class="image-action-btn set-default-btn"
                        :disabled="image.isDefault"
                        title="Set as default image"
                    >
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                    <button
                        type="button"
                        @click="deleteImage(index)"
                        class="image-action-btn delete-btn"
                        title="Delete image"
                    >
                      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Add new image button -->
                <div
                    class="add-image-button"
                    @click="openFileInput"
                >
                  <div class="add-image-icon">
                    <svg class="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div class="add-image-text">Add Image</div>
                </div>
              </div>
              <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  class="file-input-hidden"
                  @change="handleFileUpload"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Tell Nuxt to use the admin layout
definePageMeta({
  layout: 'admin'
});

// Browser-compatible UUID generator
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const route = useRoute();
const productId = computed(() => route.params.id);
const router = useRouter();
const config = useRuntimeConfig();

// Refs
const fileInput = ref(null);
const newTag = ref('');
const specKeys = ref([]);
const descriptionMode = ref('text'); // New ref for description mode toggling

// State
const loading = ref(true);
const error = ref(null);
const isSaving = ref(false);
const validationErrors = reactive({});
const localProducts = ref([]);

// Form data
const form = reactive({
  id: '',
  name: '',
  description: '',
  janCode: '',
  sku: '',
  brand: '',
  category: '',
  subcategory: '',
  tags: [],
  minOrderQuantity: 1,
  stock: 0,
  pricing: {
    basePrice: 0,
    currency: 'JPY',
    discountPercentage: 0,
    increaseRate: 30 // Default markup rate of 30%
  },
  images: [],
  specifications: {},
  isActive: true,
  isNew: false,
  isFeatured: false
});

// Calculated retail price
const calculatedRetailPrice = computed(() => {
  const basePrice = form.pricing.basePrice;
  const increaseRate = form.pricing.increaseRate || 0;

  return basePrice * (1 + increaseRate / 100);
});

// Format price with commas but no decimal points
const formatPrice = (price) => {
  return Math.round(price).toLocaleString();
};

// Available categories
const availableCategories = [
  'Electronics',
  'Kitchen',
  'Clothing',
  'Sports',
  'Home Goods',
  'Office Supplies'
];

// Insert HTML tag helper
const insertHtmlTag = (tag) => {
  let content = '';
  let template = '';

  switch(tag) {
    case 'b':
      template = `<b>bold text</b>`;
      break;
    case 'i':
      template = `<i>italic text</i>`;
      break;
    case 'u':
      template = `<u>underlined text</u>`;
      break;
    case 'h2':
      template = `<h2>Heading</h2>`;
      break;
    case 'ul':
      template = `<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>`;
      break;
    case 'a':
      template = `<a href="https://example.com">Link text</a>`;
      break;
    default:
      template = `<${tag}></${tag}>`;
  }

  form.description += template;
};

// Get products from localStorage (shared with products list page)
const loadProductsFromStorage = () => {
  try {
    const storedProducts = localStorage.getItem('adminProducts');
    if (storedProducts) {
      return JSON.parse(storedProducts);
    }
  } catch (err) {
    console.error("Error loading products from storage:", err);
  }
  return [];
};

// Find the current product
const currentProduct = computed(() => {
  const product = localProducts.value.find(p => p.id === productId.value);
  return product || null;
});

// Helper function to get image URL
const getImageUrl = (imagePath) => {
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
const removeTag = (index) => {
  form.tags.splice(index, 1);
};

// Handle opening file input
const openFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// Handle file upload
const handleFileUpload = (event) => {
  const input = event.target;
  if (input.files && input.files.length > 0) {
    // In a real application, you would upload these files to a server
    // For now, we'll just create image objects with local URLs
    Array.from(input.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          const isFirstImage = form.images.length === 0;
          form.images.push({
            id: generateUUID(),
            src: e.target.result,
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
const setDefaultImage = (index) => {
  form.images.forEach((image, i) => {
    image.isDefault = i === index;
  });
};

// Handle deleting an image
const deleteImage = (index) => {
  const wasDefault = form.images[index].isDefault;
  form.images.splice(index, 1);

  // If we deleted the default image and there are still images left, set a new default
  if (wasDefault && form.images.length > 0) {
    form.images[0].isDefault = true;
  }
};

// Validate form
const validateForm = () => {
  // Reset validation errors
  Object.keys(validationErrors).forEach(key => delete validationErrors[key]);

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
    const firstErrorEl = document.querySelector('.error-input');
    if (firstErrorEl) {
      firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  try {
    isSaving.value = true;

    // Update the product in localStorage
    const index = localProducts.value.findIndex(p => p.id === form.id);
    if (index !== -1) {
      localProducts.value[index] = { ...form };
      localStorage.setItem('adminProducts', JSON.stringify(localProducts.value));
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Show success message
    alert("Product updated successfully!");
    goBack();
  } catch (err) {
    console.error("Error saving product:", err);
    error.value = `Failed to save product: ${err.message}`;
  } finally {
    isSaving.value = false;
  }
};

// Navigate back to products list
const goBack = () => {
  router.push('/admin/products');
};

// Initialize
onMounted(async () => {
  try {
    loading.value = true;

    // Load products from localStorage
    localProducts.value = loadProductsFromStorage();

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (currentProduct.value) {
      // Initialize form with product data
      Object.assign(form, currentProduct.value);

      // Handle backward compatibility - add increaseRate if not present
      if (form.pricing && form.pricing.increaseRate === undefined) {
        form.pricing.increaseRate = 30; // Default value
      }

      // Initialize spec keys if needed
      if (currentProduct.value.specifications) {
        specKeys.value = Object.keys(currentProduct.value.specifications);
      }
    } else {
      error.value = "Product not found. Make sure you've selected a valid product from the list.";
    }
  } catch (err) {
    console.error("Error loading product:", err);
    error.value = `Failed to load product: ${err.message}`;
  } finally {
    loading.value = false;
  }
});

// Watch for product ID changes
watch(productId, () => {
  loading.value = true;
  // Load the product when the ID changes
  if (currentProduct.value) {
    Object.assign(form, currentProduct.value);
    loading.value = false;
  } else {
    error.value = "Product not found";
    loading.value = false;
  }
});
</script>

<style scoped>
/* Product Detail Page */
.product-detail-page {
  @apply pb-8;
}

/* Loading state */
.loading-container {
  @apply py-12 flex flex-col items-center justify-center;
}

.loading-spinner {
  @apply w-16 h-16 border-4 border-secondary-200 border-t-primary-500 rounded-full animate-spin;
}

.loading-text {
  @apply mt-4 text-secondary-600 font-medium;
}

/* Error state */
.error-container, .not-found-container {
  @apply py-12 flex flex-col items-center justify-center text-center;
}

.error-icon, .not-found-icon {
  @apply w-16 h-16 text-danger-500 mb-4;
}

.not-found-icon {
  @apply text-secondary-400;
}

.error-title, .not-found-title {
  @apply text-2xl font-bold text-secondary-900 mb-2;
}

.error-message, .not-found-message {
  @apply text-secondary-600 max-w-md mx-auto;
}

/* Edit form container */
.edit-form-container {
  @apply w-full;
}

/* Form header */
.form-header {
  @apply flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow;
}

.header-content {
  @apply flex-1;
}

.form-title {
  @apply text-2xl font-bold text-secondary-900;
}

.header-actions {
  @apply flex items-center;
}

/* Form content layout */
.form-content {
  @apply grid grid-cols-1 lg:grid-cols-3 gap-6;
}

.form-left-column {
  @apply lg:col-span-2 space-y-6;
}

.form-right-column {
  @apply space-y-6;
}

/* Form cards */
.form-card {
  @apply bg-white rounded-lg shadow overflow-hidden;
}

.card-header {
  @apply p-4 border-b border-secondary-200;
}

.card-title {
  @apply text-lg font-medium text-secondary-900;
}

.card-subtitle {
  @apply text-sm text-secondary-500 mt-1;
}

.card-content {
  @apply p-4;
}

/* Form elements */
.form-group {
  @apply mb-4;
}

.form-row {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4 mb-4;
}

.form-label {
  @apply block text-sm font-medium text-secondary-700 mb-1;
}

.required-mark {
  @apply text-danger-500;
}

.form-input, .form-select, .form-textarea {
  @apply block w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm;
}

.form-textarea {
  @apply min-h-[150px] resize-y;
}

.error-input {
  @apply border-danger-300 focus:ring-danger-500 focus:border-danger-500;
}

.error-message {
  @apply mt-1 text-sm text-danger-600;
}

/* Input with icon */
.input-with-icon {
  @apply relative;
}

.input-icon {
  @apply absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500;
}

.input-icon-right {
  @apply absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-secondary-500;
}

.with-left-icon {
  @apply pl-7;
}

.with-right-icon {
  @apply pr-7;
}

/* Toggle switches */
.toggles-container {
  @apply grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4;
}

.toggle-item {
  @apply bg-secondary-50 rounded-lg p-4 relative;
}

.toggle-label {
  @apply text-sm font-medium text-secondary-900 block mb-1;
}

.toggle-description {
  @apply text-xs text-secondary-500 mb-4;
}

.toggle-switch {
  @apply absolute bottom-4 right-4;
}

.toggle-input {
  @apply hidden;
}

.toggle-slider {
  @apply block h-6 w-11 rounded-full bg-secondary-300 cursor-pointer relative transition-colors duration-300 ease-in-out;
}

.toggle-slider:after {
  content: '';
  @apply absolute left-0.5 bottom-0.5 bg-white w-5 h-5 rounded-full transition-all duration-300 ease-in-out;
}

.toggle-input:checked + .toggle-slider {
  @apply bg-primary-500;
}

.toggle-input:checked + .toggle-slider:after {
  @apply transform translate-x-5;
}

/* Tags */
.tags-container {
  @apply space-y-4;
}

.tags-list {
  @apply flex flex-wrap gap-2;
}

.tag-item {
  @apply bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full flex items-center text-sm;
}

.tag-remove {
  @apply ml-2 text-secondary-500 hover:text-secondary-700 focus:outline-none;
}

.tags-input {
  @apply flex;
}

.tags-input .form-input {
  @apply flex-1 rounded-r-none;
}

.tags-input .btn-primary {
  @apply rounded-l-none;
}

/* Images */
.images-grid {
  @apply grid grid-cols-2 sm:grid-cols-3 gap-4;
}

.image-item {
  @apply bg-white border border-secondary-200 rounded-lg overflow-hidden relative flex flex-col;
}

.image-preview {
  @apply aspect-w-1 aspect-h-1 bg-secondary-50 relative;
}

.image-preview-img {
  @apply w-full h-full object-cover;
}

.default-badge {
  @apply absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-2 py-1;
}

.image-actions {
  @apply flex justify-between p-2 bg-white border-t border-secondary-100;
}

.image-action-btn {
  @apply p-1.5 rounded-full focus:outline-none;
}

.set-default-btn {
  @apply text-primary-700 hover:bg-primary-50 focus:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed;
}

.delete-btn {
  @apply text-danger-700 hover:bg-danger-50 focus:bg-danger-50;
}

.add-image-button {
  @apply border-2 border-dashed border-secondary-300 rounded-lg flex flex-col items-center justify-center aspect-w-1 aspect-h-1 cursor-pointer hover:border-primary-500 transition-colors;
}

.add-image-icon {
  @apply text-secondary-400 mb-2;
}

.add-image-text {
  @apply text-sm text-secondary-500;
}

.file-input-hidden {
  display: none;
}

/* Buttons */
.btn-primary {
  @apply inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}

.btn-secondary {
  @apply inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}

.btn-outline {
  @apply inline-flex items-center justify-center px-4 py-2 border border-secondary-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}

/* Price preview */
.price-preview {
  @apply mt-4 p-4 bg-secondary-50 rounded-lg;
}

.calculated-price {
  @apply flex justify-between items-center mb-4 p-2 bg-white rounded-md border border-secondary-200;
}

.price-label {
  @apply text-sm font-medium text-secondary-700;
}

.price-value {
  @apply text-lg font-bold text-primary-600;
}

/* Description editor */
.description-tabs {
  @apply flex space-x-2;
}

.tab-btn {
  @apply px-3 py-1 text-sm rounded-t-md border-b-2 border-transparent hover:bg-secondary-50;
}

.active-tab {
  @apply border-primary-500 text-primary-600 font-medium bg-secondary-50;
}

.description-preview {
  @apply min-h-[150px] p-4 border border-secondary-300 rounded-md bg-white overflow-auto;
}

.description-helper {
  @apply mt-3 p-3 bg-secondary-50 rounded-md text-sm text-secondary-600;
}

.html-examples {
  @apply flex flex-wrap gap-2 mt-2;
}

.html-btn {
  @apply px-2 py-1 text-xs bg-white border border-secondary-300 rounded hover:bg-secondary-100;
}

/* Utility classes - redefine without circular dependencies */
.margin-top-4 {
  margin-top: 1rem;
}

.margin-left-3 {
  margin-left: 0.75rem;
}
</style>