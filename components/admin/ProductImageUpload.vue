<!-- components/admin/ProductImageUpload.vue -->
<template>
  <div class="image-uploader">
    <div class="card p-6">
      <h2 class="text-xl font-semibold mb-4">Upload Product Images</h2>
      <p class="text-sm text-secondary-600 mb-6">
        Upload images for your products. Files will be matched to products by JAN code in the filename.
      </p>

      <div class="mb-6">
        <h3 class="text-lg font-medium mb-3">Naming Convention</h3>
        <div class="bg-secondary-50 p-4 rounded-lg">
          <p class="text-sm text-secondary-700 mb-2">
            For automatic matching, name your image files using one of these formats:
          </p>
          <ul class="list-disc pl-5 text-sm text-secondary-700">
            <li><code>[JAN_CODE].jpg</code> - e.g. <code>4901234567890.jpg</code></li>
            <li><code>[JAN_CODE]_main.jpg</code> - e.g. <code>4901234567890_main.jpg</code></li>
            <li><code>[JAN_CODE]-1.jpg</code> - e.g. <code>4901234567890-1.jpg</code></li>
            <li>Any filename containing the JAN code</li>
          </ul>
          <p class="text-sm text-secondary-700 mt-2">
            Supported formats: JPG, PNG, WebP, GIF
          </p>
        </div>
      </div>

      <div class="upload-zone mb-6">
        <div
            class="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition"
            :class="{ 'border-primary-500 bg-primary-50': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
            @click="triggerFileInput"
        >
          <div v-if="selectedFiles.length === 0">
            <svg class="mx-auto h-12 w-12 text-secondary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="mt-4 text-sm text-secondary-600">
              <span class="font-medium text-primary-600 hover:text-primary-500">
                Click to browse
              </span> or drag and drop images here
            </p>
            <p class="mt-1 text-xs text-secondary-500">
              You can select multiple images at once
            </p>
          </div>

          <div v-else class="selected-files">
            <div class="flex items-center justify-center mb-4">
              <svg class="h-8 w-8 text-success-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-lg font-medium text-secondary-700">{{ selectedFiles.length }} files selected</span>
            </div>
            <p class="text-sm text-secondary-600">
              Total size: {{ formatFileSize(totalFileSize) }}
            </p>
            <button
                @click.stop="clearSelectedFiles"
                class="mt-2 text-sm text-danger-600 hover:text-danger-800"
            >
              Remove All
            </button>
          </div>
        </div>

        <input
            type="file"
            ref="fileInput"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            class="hidden"
            @change="handleFileSelect"
        />
      </div>

      <div class="selected-files-preview" v-if="selectedFiles.length > 0">
        <h3 class="text-lg font-medium mb-3">Selected Files</h3>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="image-preview-item"
          >
            <div class="image-preview-container">
              <img
                  :src="filePreviewUrls[index]"
                  :alt="file.name"
                  class="image-preview"
              />
              <button
                  @click="removeFile(index)"
                  class="remove-image-btn"
                  title="Remove image"
              >
                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <div class="image-details">
              <p class="image-filename" :title="file.name">{{ truncateFilename(file.name, 18) }}</p>
              <p class="image-filesize">{{ formatFileSize(file.size) }}</p>
              <p
                  v-if="fileJanCodes[index]"
                  class="image-jancode"
                  :class="{ 'text-success-600': matchingProducts[fileJanCodes[index]], 'text-danger-600': !matchingProducts[fileJanCodes[index]] }"
              >
                JAN: {{ fileJanCodes[index] }}
                <span v-if="matchingProducts[fileJanCodes[index]]" class="match-indicator">✓</span>
                <span v-else class="match-indicator">✗</span>
              </p>
              <p v-else class="image-jancode text-warning-600">
                No JAN code found
              </p>
            </div>
          </div>
        </div>

        <div class="match-summary mt-6">
          <div class="bg-secondary-50 p-4 rounded-lg">
            <h4 class="font-medium text-secondary-800 mb-2">Match Summary</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="match-stat">
                <div class="match-stat-value text-success-600">{{ matchedCount }}</div>
                <div class="match-stat-label">Images with matching products</div>
              </div>
              <div class="match-stat">
                <div class="match-stat-value text-danger-600">{{ unmatchedCount }}</div>
                <div class="match-stat-label">Images without matching products</div>
              </div>
              <div class="match-stat">
                <div class="match-stat-value text-warning-600">{{ noJanCodeCount }}</div>
                <div class="match-stat-label">Images without JAN code</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="button-group">
        <button
            @click="uploadImages"
            class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading || selectedFiles.length === 0 || matchedCount === 0"
        >
          <template v-if="loading">
            <span class="inline-block animate-spin mr-2">⌛</span>
            Uploading Images...
          </template>
          <template v-else>
            Upload Images
          </template>
        </button>

        <button
            @click="clearSelectedFiles"
            class="btn-secondary ml-3"
            :disabled="loading || selectedFiles.length === 0"
        >
          Cancel
        </button>
      </div>

      <div v-if="uploadResult" class="mt-6">
        <div v-if="uploadResult.success" class="bg-success-50 border border-success-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-success-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-success-800">
                Successfully uploaded {{ uploadResult.uploadedCount }} images!
              </p>
              <div v-if="uploadResult.skippedCount > 0" class="mt-2">
                <p class="text-sm text-success-700">
                  {{ uploadResult.skippedCount }} images were skipped because no matching product was found.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="bg-danger-50 border border-danger-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-danger-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-danger-800">
                Failed to upload images
              </p>
              <p class="text-sm text-danger-700">
                {{ uploadResult.error }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useProductStore } from '~/stores/products';

const productStore = useProductStore();

// Refs
const fileInput = ref(null);
const selectedFiles = ref([]);
const filePreviewUrls = ref([]);
const fileJanCodes = ref([]);
const matchingProducts = reactive({});
const isDragging = ref(false);
const loading = ref(false);
const uploadResult = ref(null);
const products = ref([]);

// Computed properties
const totalFileSize = computed(() => {
  return selectedFiles.value.reduce((total, file) => total + file.size, 0);
});

const matchedCount = computed(() => {
  return fileJanCodes.value.filter(janCode => janCode && matchingProducts[janCode]).length;
});

const unmatchedCount = computed(() => {
  return fileJanCodes.value.filter(janCode => janCode && !matchingProducts[janCode]).length;
});

const noJanCodeCount = computed(() => {
  return fileJanCodes.value.filter(janCode => !janCode).length;
});

// Methods
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    addFiles(files);
  }
};

const handleFileDrop = (event) => {
  isDragging.value = false;
  const files = Array.from(event.dataTransfer.files).filter(file =>
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/webp' ||
      file.type === 'image/gif'
  );

  if (files.length > 0) {
    addFiles(files);
  } else {
    alert('Please drop valid image files (JPEG, PNG, WebP, GIF)');
  }
};

const addFiles = (files) => {
  // Add the files to our arrays
  files.forEach(file => {
    selectedFiles.value.push(file);

    // Create URL for preview
    const previewUrl = URL.createObjectURL(file);
    filePreviewUrls.value.push(previewUrl);

    // Extract JAN code from filename
    const janCode = extractJanCodeFromFilename(file.name);
    fileJanCodes.value.push(janCode);

    // Check if we have a matching product
    if (janCode) {
      const product = products.value.find(p => p.janCode === janCode);
      matchingProducts[janCode] = !!product;
    }
  });
};

const removeFile = (index) => {
  // Clean up preview URL to prevent memory leaks
  URL.revokeObjectURL(filePreviewUrls.value[index]);

  // Remove from arrays
  selectedFiles.value.splice(index, 1);
  filePreviewUrls.value.splice(index, 1);

  const janCode = fileJanCodes.value[index];
  fileJanCodes.value.splice(index, 1);

  // Update match count if this was the last file with this JAN code
  if (janCode && !fileJanCodes.value.includes(janCode)) {
    delete matchingProducts[janCode];
  }
};

const clearSelectedFiles = () => {
  // Clean up preview URLs
  filePreviewUrls.value.forEach(url => URL.revokeObjectURL(url));

  // Reset arrays
  selectedFiles.value = [];
  filePreviewUrls.value = [];
  fileJanCodes.value = [];

  // Reset matchingProducts
  Object.keys(matchingProducts).forEach(key => {
    delete matchingProducts[key];
  });

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = '';
  }

  // Reset upload result
  uploadResult.value = null;
};

const extractJanCodeFromFilename = (filename) => {
  // Regular expression to find JAN codes (usually 13 digits, but can be 8-14 digits)
  // - Standalone JAN code: 4901234567890.jpg
  // - JAN code with suffix: 4901234567890_main.jpg or 4901234567890-1.jpg
  // - JAN code anywhere in filename: product_4901234567890_front.jpg

  // Japanese JAN codes are typically 13 digits (or 8 digits for company internal codes)
  const janCodeRegex = /(?:^|[^0-9])([0-9]{8,14})(?:[^0-9]|$)/;
  const match = filename.match(janCodeRegex);

  return match ? match[1] : null;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const truncateFilename = (filename, maxLength) => {
  if (filename.length <= maxLength) return filename;

  // Find extension
  const lastDotIndex = filename.lastIndexOf('.');
  const ext = lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '';

  // Calculate how much of the filename to keep
  const nameWithoutExt = filename.substring(0, lastDotIndex);
  const truncatedName = nameWithoutExt.substring(0, maxLength - 3 - ext.length) + '...';

  return truncatedName + ext;
};

const uploadImages = async () => {
  if (selectedFiles.value.length === 0 || matchedCount.value === 0) return;

  loading.value = true;
  uploadResult.value = null;

  try {
    // Group files by JAN code for more efficient upload
    const filesByJanCode = {};

    selectedFiles.value.forEach((file, index) => {
      const janCode = fileJanCodes.value[index];
      if (janCode && matchingProducts[janCode]) {
        if (!filesByJanCode[janCode]) {
          filesByJanCode[janCode] = [];
        }
        filesByJanCode[janCode].push(file);
      }
    });

    // Upload files for each JAN code
    let uploadedCount = 0;
    let skippedCount = 0;

    for (const janCode in filesByJanCode) {
      const files = filesByJanCode[janCode];

      // Create FormData
      const formData = new FormData();
      formData.append('janCode', janCode);

      files.forEach((file, index) => {
        formData.append(`images`, file);
      });

      // Upload images for this JAN code using the store method
      const result = await productStore.uploadProductImages(formData);

      if (result.success) {
        uploadedCount += result.uploadedCount || files.length;
      } else {
        throw new Error(`Failed to upload images for JAN code ${janCode}: ${result.error}`);
      }
    }

    // Count skipped files (those without a matching product or JAN code)
    skippedCount = selectedFiles.value.length - uploadedCount;

    uploadResult.value = {
      success: true,
      uploadedCount,
      skippedCount
    };

    // Refresh products to get updated images
    await productStore.fetchProducts();

    // Clear selected files after successful upload
    if (uploadedCount > 0) {
      clearSelectedFiles();
    }
  } catch (error) {
    console.error('Error uploading images:', error);
    uploadResult.value = {
      success: false,
      error: error.message || 'Error uploading images'
    };
  } finally {
    loading.value = false;
  }
};

// Lifecycle hooks
onMounted(async () => {
  try {
    // Fetch products for matching
    await productStore.fetchProducts();
    products.value = productStore.products;
  } catch (error) {
    console.error('Error fetching products:', error);
  }
});

// Watch for changes in products list
watch(() => productStore.products, (newProducts) => {
  products.value = newProducts;

  // Update matching status for all JAN codes
  fileJanCodes.value.forEach((janCode, index) => {
    if (janCode) {
      const product = products.value.find(p => p.janCode === janCode);
      matchingProducts[janCode] = !!product;
    }
  });
}, { deep: true });
</script>

<style scoped>
.image-uploader {
  @apply mb-8;
}

.image-preview-item {
  @apply bg-white rounded-lg shadow overflow-hidden transition-transform hover:shadow-md hover:-translate-y-1;
}

.image-preview-container {
  @apply relative aspect-w-1 aspect-h-1 bg-secondary-100;
}

.image-preview {
  @apply w-full h-full object-cover;
}

.remove-image-btn {
  @apply absolute top-1 right-1 bg-white bg-opacity-80 hover:bg-opacity-100 text-danger-500 hover:text-danger-700 p-1 rounded-full;
}

.image-details {
  @apply p-2;
}

.image-filename {
  @apply text-xs font-medium text-secondary-900 truncate;
}

.image-filesize {
  @apply text-xs text-secondary-500;
}

.image-jancode {
  @apply text-xs flex items-center justify-between mt-1;
}

.match-indicator {
  @apply font-bold;
}

.match-summary {
  @apply mt-6;
}

.match-stat {
  @apply text-center p-2;
}

.match-stat-value {
  @apply text-2xl font-bold;
}

.match-stat-label {
  @apply text-sm text-secondary-600;
}
</style>