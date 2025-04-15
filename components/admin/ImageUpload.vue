<template>
  <div class="bg-white rounded-lg shadow-card p-6">
    <h2 class="text-xl font-semibold mb-6">Upload Product Images</h2>

    <!-- JAN Code Input -->
    <div class="mb-6">
      <label for="janCode" class="form-label">JAN Code</label>
      <div class="flex">
        <input
            id="janCode"
            v-model="janCode"
            type="text"
            class="form-input flex-1"
            placeholder="Enter product JAN code"
        />
        <button
            type="button"
            class="btn-primary ml-2"
            :disabled="!janCode"
            @click="findProduct"
        >
          {{ isSearching ? 'Searching...' : 'Find Product' }}
        </button>
      </div>
      <p v-if="searchError" class="mt-1 text-sm text-danger-600">{{ searchError }}</p>
    </div>

    <!-- Product Details Card -->
    <div v-if="selectedProduct" class="mb-6 p-4 border border-secondary-200 rounded-lg">
      <div class="flex items-start">
        <!-- Product image (if available) -->
        <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-secondary-200 bg-secondary-50 mr-4">
          <img
              v-if="selectedProduct.images && selectedProduct.images.length > 0"
              :src="getImageUrl(selectedProduct.images[0].src)"
              :alt="selectedProduct.name"
              class="h-full w-full object-cover object-center"
          />
          <div v-else class="h-full w-full flex items-center justify-center text-secondary-400">
            <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div class="flex-1">
          <h3 class="text-base font-medium text-secondary-900">{{ selectedProduct.name }}</h3>
          <p class="text-sm text-secondary-500">
            JAN Code: {{ selectedProduct.janCode }}
          </p>
          <p class="text-sm text-secondary-500">
            SKU: {{ selectedProduct.sku }}
          </p>
          <p class="text-sm text-secondary-500">
            Images: {{ selectedProduct.images ? selectedProduct.images.length : 0 }}
          </p>
        </div>
      </div>
    </div>

    <!-- Image Upload Area (only visible if a product is selected) -->
    <div v-if="selectedProduct">
      <div
          class="border-2 border-dashed border-secondary-300 rounded-lg p-6 mb-6 text-center"
          :class="{ 'border-primary-500 bg-primary-50': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="onImagesDrop"
      >
        <div>
          <svg class="mx-auto h-12 w-12 text-secondary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="mt-2 text-sm text-secondary-600">
            Drag and drop images here, or
            <button
                type="button"
                class="text-primary-600 hover:text-primary-500 font-medium focus:outline-none"
                @click="$refs.imageInput.click()"
            >
              browse
            </button>
            to select files
          </p>
          <p class="mt-1 text-xs text-secondary-500">
            JPG, PNG, or WebP images only (max 5MB each)
          </p>
          <input
              ref="imageInput"
              type="file"
              class="hidden"
              accept="image/jpeg,image/png,image/webp"
              multiple
              @change="onImagesChange"
          />
        </div>
      </div>

      <!-- Selected Images Preview -->
      <div v-if="selectedImages.length > 0" class="mb-6">
        <h3 class="text-sm font-medium text-secondary-900 mb-3">Selected Images ({{ selectedImages.length }})</h3>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div
              v-for="(image, index) in selectedImages"
              :key="index"
              class="relative group aspect-w-1 aspect-h-1 bg-secondary-100 rounded-md overflow-hidden"
          >
            <img
                :src="image.preview"
                :alt="`Preview ${index + 1}`"
                class="object-cover w-full h-full"
            />

            <!-- Overlay with remove button -->
            <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                  type="button"
                  class="text-white hover:text-danger-200 p-1"
                  @click="removeImage(index)"
              >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Upload Button -->
      <div class="flex justify-end">
        <button
            type="button"
            class="btn-primary"
            :disabled="selectedImages.length === 0 || isUploading"
            @click="uploadImages"
        >
          <svg v-if="!isUploading" class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isUploading ? 'Uploading...' : 'Upload Images' }}
        </button>
      </div>
    </div>

    <!-- Upload Status -->
    <div v-if="uploadStatus" :class="[
      'mt-6 p-4 rounded-md',
      uploadStatus.success
        ? 'bg-success-50 text-success-700 border border-success-200'
        : 'bg-danger-50 text-danger-700 border border-danger-200'
    ]">
      <div class="flex">
        <svg
            v-if="uploadStatus.success"
            class="h-5 w-5 text-success-400 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <svg
            v-else
            class="h-5 w-5 text-danger-400 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="text-sm font-medium">{{ uploadStatus.message }}</p>
          <div v-if="uploadStatus.details" class="mt-2">
            <p class="text-sm font-medium">Details:</p>
            <ul class="mt-1 text-xs space-y-1 list-disc list-inside">
              <li v-for="(detail, index) in uploadStatus.details" :key="index">
                {{ detail }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useProductStore, Product } from '~/stores/products';

const productStore = useProductStore();
const config = useRuntimeConfig();

// Form state
const janCode = ref('');
const isDragging = ref(false);
const isSearching = ref(false);
const isUploading = ref(false);
const searchError = ref('');
const selectedProduct = ref<Product | null>(null);
const imageInput = ref<HTMLInputElement | null>(null);

interface SelectedImage {
  file: File;
  preview: string;
}

const selectedImages = ref<SelectedImage[]>([]);

const uploadStatus = ref<{
  success: boolean;
  message: string;
  details?: string[];
} | null>(null);

// Watch for changes to JAN code and clear any selected product
watch(janCode, () => {
  if (selectedProduct.value && selectedProduct.value.janCode !== janCode.value) {
    selectedProduct.value = null;
    selectedImages.value = [];
    uploadStatus.value = null;
  }
});

// Helper function to get image URL
const getImageUrl = (imagePath: string): string => {
  // Check if the path is already a URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If it's a relative path, prepend the upload URL
  return `${config.public.uploadUrl}/${imagePath}`;
};

// Find a product by JAN code
const findProduct = async () => {
  if (!janCode.value) return;

  try {
    isSearching.value = true;
    searchError.value = '';
    uploadStatus.value = null;

    // First, fetch all products if not already loaded
    if (productStore.products.length === 0) {
      await productStore.fetchProducts();
    }

    // Find the product by JAN code
    const product = productStore.products.find(p => p.janCode === janCode.value);

    if (product) {
      selectedProduct.value = product;
      // Clear any previously selected images
      selectedImages.value = [];
    } else {
      searchError.value = 'No product found with this JAN code';
      selectedProduct.value = null;
    }
  } catch (error: any) {
    console.error('Error searching for product:', error);
    searchError.value = error.message || 'Error searching for product';
  } finally {
    isSearching.value = false;
  }
};

// Handle image file change from the input
const onImagesChange = (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    processImageFiles(Array.from(input.files));
  }
};

// Handle image files drop
const onImagesDrop = (event: DragEvent) => {
  isDragging.value = false;

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const files = Array.from(event.dataTransfer.files).filter(file =>
        file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp'
    );

    if (files.length === 0) {
      alert('Please select valid image files (JPG, PNG, or WebP)');
      return;
    }

    processImageFiles(files);
  }
};

// Process image files and create previews
const processImageFiles = (files: File[]) => {
  for (const file of files) {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(`File "${file.name}" exceeds the 5MB size limit.`);
      continue;
    }

    // Create a preview URL
    const preview = URL.createObjectURL(file);

    // Add to selected images
    selectedImages.value.push({ file, preview });
  }
};

// Remove a selected image
const removeImage = (index: number) => {
  // Release the object URL to avoid memory leaks
  URL.revokeObjectURL(selectedImages.value[index].preview);

  // Remove the image from the array
  selectedImages.value.splice(index, 1);
};

// Upload images
const uploadImages = async () => {
  if (!selectedProduct.value || selectedImages.value.length === 0) return;

  try {
    isUploading.value = true;
    uploadStatus.value = null;

    // Extract the files from the selected images
    const files = selectedImages.value.map(img => img.file);

    // Use the productStore to handle the upload
    const result = await productStore.uploadProductImages(selectedProduct.value.janCode, files);

    if (result) {
      // Display success message
      uploadStatus.value = {
        success: true,
        message: `Successfully uploaded ${result.uploadedImages.length} images for product ${selectedProduct.value.name}.`,
        details: [
          `Total images for this product: ${result.totalImages}`,
          `JAN Code: ${result.janCode}`
        ]
      };

      // Clear the selected images after successful upload
      selectedImages.value.forEach(img => URL.revokeObjectURL(img.preview));
      selectedImages.value = [];

      // Refresh the product data to show updated images
      await findProduct();
    } else {
      // Handle upload failure
      uploadStatus.value = {
        success: false,
        message: 'Failed to upload images. Please try again.',
        details: ['The server could not process your request.']
      };
    }
  } catch (error: any) {
    console.error('Error uploading images:', error);

    // Display error message
    uploadStatus.value = {
      success: false,
      message: 'Error uploading images',
      details: [error.message || 'Unknown error occurred']
    };
  } finally {
    isUploading.value = false;
  }
};
</script>