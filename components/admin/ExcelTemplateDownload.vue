<!-- components/admin/ExcelTemplateDownload.vue -->
<template>
  <div class="excel-template">
    <button
        @click="generateTemplate"
        class="flex items-center px-4 py-2 bg-secondary-100 text-secondary-800 rounded-md hover:bg-secondary-200 transition-colors"
        :disabled="generating"
    >
      <svg v-if="generating" class="animate-spin -ml-1 mr-2 h-5 w-5 text-secondary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <svg v-else class="w-5 h-5 mr-2 text-secondary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {{ generating ? 'Generating...' : 'Download Excel Template' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const generating = ref(false);

const generateTemplate = async () => {
  generating.value = true;

  try {
    // Create a sample worksheet with headers and example data
    const workbook = XLSX.utils.book_new();

    // Define headers
    const headers = [
      'name',
      'description',
      'janCode',
      'sku',
      'brand',
      'category',
      'subcategory',
      'tags',
      'minOrderQuantity',
      'stock',
      'basePrice',
      'currency',
      'discountPercentage',
      'volumeDiscounts',
      'isActive',
      'isNew',
      'isFeatured',
      'spec_color',
      'spec_size',
      'spec_weight',
      'spec_material',
      'spec_country_of_origin'
    ];

    // Create example data (2 rows)
    const data = [
      // Row 1
      {
        name: 'Example Product 1',
        description: 'This is a sample product description for the first product.',
        janCode: '4901234567890',
        sku: 'PROD-001',
        brand: 'Sample Brand',
        category: 'Electronics',
        subcategory: 'Accessories',
        tags: 'electronics, accessory, sample',
        minOrderQuantity: 1,
        stock: 100,
        basePrice: 5000,
        currency: 'JPY',
        discountPercentage: 10,
        volumeDiscounts: '10:5,20:10,50:15',
        isActive: true,
        isNew: true,
        isFeatured: true,
        spec_color: 'Black',
        spec_size: 'Medium',
        spec_weight: '200g',
        spec_material: 'Plastic',
        spec_country_of_origin: 'Japan'
      },
      // Row 2
      {
        name: 'Example Product 2',
        description: 'This is a sample product description for the second product.',
        janCode: '4901234567891',
        sku: 'PROD-002',
        brand: 'Sample Brand',
        category: 'Electronics',
        subcategory: 'Cables',
        tags: 'electronics, cable, sample',
        minOrderQuantity: 2,
        stock: 50,
        basePrice: 3000,
        currency: 'JPY',
        discountPercentage: 0,
        volumeDiscounts: '10:3,20:5',
        isActive: true,
        isNew: false,
        isFeatured: false,
        spec_color: 'White',
        spec_size: 'Standard',
        spec_weight: '100g',
        spec_material: 'PVC',
        spec_country_of_origin: 'China'
      }
    ];

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });

    // Format the headers
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "EEEEEE" } }
    };

    // Add explanation row with colors
    const range = XLSX.utils.decode_range(worksheet['!ref']);

    // Add formatting for required fields
    const requiredFields = ['name', 'janCode', 'sku', 'basePrice'];
    const requiredCols = requiredFields.map(field => headers.indexOf(field));

    // Apply header styles
    for (let i = 0; i <= range.e.c; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
      worksheet[cellRef].s = headerStyle;

      // Add asterisk to required field headers
      if (requiredCols.includes(i)) {
        const headerName = headers[i];
        worksheet[cellRef].v = `${headerName} *`;
      }
    }

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    // Create a README sheet with instructions
    const instructionsData = [
      ['Product Import Template - Instructions'],
      [''],
      ['Required Fields:'],
      ['name * - Product name (required)'],
      ['janCode * - JAN/EAN code (required), must be 8-14 digits'],
      ['sku * - SKU/Product code (required)'],
      ['basePrice * - Base price (required)'],
      [''],
      ['Optional Fields:'],
      ['description - Product description'],
      ['brand - Brand name'],
      ['category - Product category'],
      ['subcategory - Product subcategory'],
      ['tags - Comma-separated tags'],
      ['minOrderQuantity - Minimum order quantity, default is 1'],
      ['stock - Available stock, default is 0'],
      ['currency - Currency, default is JPY'],
      ['discountPercentage - Discount percentage, default is 0'],
      ['volumeDiscounts - Format: "10:5,20:10,50:15" (quantity:discount%)'],
      ['isActive - true/false, default is true'],
      ['isNew - true/false, default is false'],
      ['isFeatured - true/false, default is false'],
      [''],
      ['Specifications:'],
      ['Any column starting with "spec_" will be treated as a product specification.'],
      ['Example: spec_color, spec_size, spec_weight, etc.'],
      [''],
      ['Note:'],
      ['- JAN Codes must be unique across all products'],
      ['- After importing products, you can upload images with filenames containing the JAN code'],
      ['- For large imports, consider breaking your data into multiple files']
    ];

    const instructionsWs = XLSX.utils.aoa_to_sheet(instructionsData);
    XLSX.utils.book_append_sheet(workbook, instructionsWs, 'Instructions');

    // Convert to binary and download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'product_import_template.xlsx');
  } catch (error) {
    console.error('Error generating template:', error);
    alert('Error generating the Excel template. Please try again.');
  } finally {
    generating.value = false;
  }
};
</script>

<style scoped>
.excel-template {
  @apply mb-0;
}
</style>