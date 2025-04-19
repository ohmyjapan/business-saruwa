<template>
  <div class="bg-white rounded-lg shadow-card p-6">
    <h2 class="text-xl font-semibold mb-6">Upload Products</h2>

    <!-- File Upload Area -->
    <div
        class="border-2 border-dashed border-secondary-300 rounded-lg p-6 mb-6 text-center"
        :class="{ 'border-primary-500 bg-primary-50': isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="onFileDrop"
    >
      <div v-if="!selectedFile">
        <svg class="mx-auto h-12 w-12 text-secondary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p class="mt-2 text-sm text-secondary-600">
          Drag and drop your Excel file here, or
          <button
              type="button"
              class="text-primary-600 hover:text-primary-500 font-medium focus:outline-none"
              @click="$refs.fileInput.click()"
          >
            browse
          </button>
          to select a file
        </p>
        <p class="mt-1 text-xs text-secondary-500">
          Excel files only (.xlsx, .xls)
        </p>
        <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept=".xlsx,.xls"
            @change="onFileChange"
        />
      </div>

      <div v-else class="text-left">
        <div class="flex items-center">
          <svg class="h-8 w-8 text-success-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <div class="flex-1">
            <p class="text-sm font-medium text-secondary-900">{{ selectedFile.name }}</p>
            <p class="text-xs text-secondary-500">
              {{ formatFileSize(selectedFile.size) }}
            </p>
          </div>
          <button
              type="button"
              class="text-secondary-400 hover:text-secondary-500"
              @click="selectedFile = null"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Template Download and Upload Buttons -->
    <div class="flex flex-wrap gap-4 mb-6">
      <button
          type="button"
          class="btn-outline text-sm flex items-center"
          @click="downloadTemplate"
      >
        <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        Download Template
      </button>

      <button
          type="button"
          class="btn-primary text-sm flex items-center"
          :disabled="!selectedFile || isUploading"
          @click="uploadFile"
      >
        <svg v-if="!isUploading" class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isUploading ? 'Uploading...' : 'Upload Products' }}
      </button>
    </div>

    <!-- Upload Status -->
    <div v-if="uploadStatus" :class="[
      'p-4 rounded-md mb-6',
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

    <!-- Instructions -->
    <div class="bg-secondary-50 p-4 rounded-md">
      <h3 class="text-sm font-medium text-secondary-900 mb-2">Instructions:</h3>
      <ol class="text-xs text-secondary-600 space-y-1 list-decimal list-inside">
        <li>Download the template Excel file</li>
        <li>Fill in the product details following the format</li>
        <li>Upload the completed file</li>
        <li>Review any errors and fix them if needed</li>
      </ol>
      <p class="mt-2 text-xs text-secondary-500">
        Required fields: Name, JAN Code, SKU, Price
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useProductStore } from '~/stores/products';
import * as XLSX from 'xlsx';

const productStore = useProductStore();

const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const selectedFile = ref<File | null>(null);
const isUploading = ref(false);
const uploadStatus = ref<{
  success: boolean;
  message: string;
  details?: string[];
} | null>(null);

// Handle file selection change from the input
const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    // Check if it's an Excel file
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel') {
      selectedFile.value = file;
    } else {
      alert('Please select an Excel file (.xlsx or .xls)');
    }
  }
};

// Handle file drop
const onFileDrop = (event: DragEvent) => {
  isDragging.value = false;

  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];

    // Check if it's an Excel file
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel') {
      selectedFile.value = file;
    } else {
      alert('Please select an Excel file (.xlsx or .xls)');
    }
  }
};

// Format file size for display
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Download template Excel file
const downloadTemplate = () => {
  // Create a template workbook
  const wb = XLSX.utils.book_new();

  // Define the template headers
  const headers = [
    'name', 'description', 'janCode', 'sku', 'brand', 'category', 'subcategory',
    'tags', 'minOrderQuantity', 'stock', 'basePrice', 'currency', 'discountPercentage',
    'volumeDiscounts', 'isActive', 'isNew', 'isFeatured'
  ];

  // Add example data
  const exampleData = [
    {
      name: 'Example Product 1',
      description: 'This is an example product description',
      janCode: '4901234567890',
      sku: 'PROD-001',
      brand: 'Example Brand',
      category: 'Electronics',
      subcategory: 'Accessories',
      tags: 'wireless,bluetooth,audio',
      minOrderQuantity: 5,
      stock: 100,
      basePrice: 2000,
      currency: 'JPY',
      discountPercentage: 10,
      volumeDiscounts: '10:5,20:10,50:15',
      isActive: true,
      isNew: true,
      isFeatured: false
    },
    {
      name: 'Example Product 2',
      description: 'Another example product description',
      janCode: '4901234567891',
      sku: 'PROD-002',
      brand: 'Example Brand',
      category: 'Electronics',
      subcategory: 'Cables',
      tags: 'usb,charging,cable',
      minOrderQuantity: 10,
      stock: 200,
      basePrice: 800,
      currency: 'JPY',
      discountPercentage: '',
      volumeDiscounts: '',
      isActive: true,
      isNew: false,
      isFeatured: true
    }
  ];

  // Create worksheet with headers and example data
  const ws = XLSX.utils.json_to_sheet(exampleData, { header: headers });

  // Add column widths
  const colWidths = [
    { wch: 20 }, // name
    { wch: 30 }, // description
    { wch: 15 }, // janCode
    { wch: 10 }, // sku
    { wch: 15 }, // brand
    { wch: 15 }, // category
    { wch: 15 }, // subcategory
    { wch: 20 }, // tags
    { wch: 8 },  // minOrderQuantity
    { wch: 8 },  // stock
    { wch: 8 },  // basePrice
    { wch: 8 },  // currency
    { wch: 8 },  // discountPercentage
    { wch: 20 }, // volumeDiscounts
    { wch: 8 },  // isActive
    { wch: 8 },  // isNew
    { wch: 8 }   // isFeatured
  ];

  ws['!cols'] = colWidths;

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Products Template');

  // Write and download the file
  XLSX.writeFile(wb, 'wholesale_products_template.xlsx');
};

// Upload the selected file
const uploadFile = async () => {
  if (!selectedFile.value) return;

  try {
    isUploading.value = true;
    uploadStatus.value = null;

    // Use the productStore to handle the upload
    const result = await productStore.uploadProductsFromExcel(selectedFile.value);

    if (result) {
      // Display success message
      uploadStatus.value = {
        success: true,
        message: `Successfully processed ${result.valid} out of ${result.total} products.`,
        details: result.valid < result.total
            ? [`${result.invalid} products had validation errors. Please check and fix the data.`]
            : undefined
      };

      // Clear the selected file after successful upload
      selectedFile.value = null;
    } else {
      // Handle upload failure
      uploadStatus.value = {
        success: false,
        message: 'Failed to upload products. Please try again.',
        details: ['The server could not process your request. Check the file format and try again.']
      };
    }
  } catch (error: any) {
    console.error('Error uploading products:', error);

    // Display error message
    uploadStatus.value = {
      success: false,
      message: 'Error uploading products',
      details: [error.message || 'Unknown error occurred']
    };
  } finally {
    isUploading.value = false;
  }
};
</script>