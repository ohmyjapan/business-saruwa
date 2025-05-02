<!-- components/admin/ProductExcelUpload.vue -->
<template>
  <div class="excel-uploader">
    <div class="card p-6">
      <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2">Excel Product Upload</h2>
        <p class="text-sm text-secondary-600">
          Upload your product data Excel file. You'll be able to map your columns to our system in the next step.
        </p>
      </div>

      <!-- File Upload Zone -->
      <div class="upload-zone mb-6" v-if="!selectedFile">
        <div
            class="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition"
            :class="{ 'border-primary-500 bg-primary-50': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleFileDrop"
            @click="triggerFileInput"
        >
          <svg class="mx-auto h-12 w-12 text-secondary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="mt-4 text-sm text-secondary-600">
            <span class="font-medium text-primary-600 hover:text-primary-500">
              Click to browse
            </span> or drag and drop your Excel file here
          </p>
          <p class="mt-1 text-xs text-secondary-500">
            Supported formats: .xlsx, .xls
          </p>
        </div>

        <input
            type="file"
            ref="fileInput"
            accept=".xlsx,.xls"
            class="hidden"
            @change="handleFileSelect"
        />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-4 mb-6">
        <div class="inline-block animate-spin mr-2">⌛</div>
        <span class="text-secondary-700">
          {{ loadingMessage }}
        </span>
      </div>

      <!-- File Preview Section -->
      <div v-if="selectedFile && !loading" class="selected-file-section mb-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <svg class="h-8 w-8 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <h3 class="text-lg font-medium">{{ selectedFile.name }}</h3>
              <p class="text-sm text-secondary-500">{{ formatFileSize(selectedFile.size) }}</p>
            </div>
          </div>
          <button
              @click="clearSelectedFile"
              class="text-sm text-danger-600 hover:text-danger-800"
          >
            Remove
          </button>
        </div>

        <!-- File Details -->
        <div class="bg-secondary-50 rounded-lg p-4 mb-4">
          <h4 class="font-medium mb-2">File Details</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p class="text-secondary-600">File Type:</p>
              <p class="font-medium">{{ fileType }}</p>
            </div>
            <div>
              <p class="text-secondary-600">Sheets:</p>
              <p class="font-medium">{{ excelSheets.length > 0 ? excelSheets.join(', ') : 'Loading...' }}</p>
            </div>
            <div>
              <p class="text-secondary-600">Total Rows:</p>
              <p class="font-medium">{{ totalRows > 0 ? totalRows : 'Calculating...' }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Import Settings -->
      <div v-if="selectedFile && !headersExtracted && !loading" class="import-settings mb-6">
        <h3 class="text-lg font-medium mb-4">Import Settings</h3>

        <div class="bg-secondary-50 p-4 rounded-lg mb-4">
          <!-- Sheet Selection -->
          <div class="form-group" v-if="excelSheets.length > 1">
            <label for="sheet-select" class="form-label">Select Sheet</label>
            <select
                id="sheet-select"
                v-model="selectedSheetIndex"
                class="form-select"
                @change="previewSheetData"
            >
              <option v-for="(sheet, index) in excelSheets" :key="index" :value="index">
                {{ sheet }}
              </option>
            </select>
            <p class="mt-1 text-xs text-secondary-500">
              Your Excel file has multiple sheets. Select which one to import.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <!-- Header Row Setting -->
            <div class="form-group">
              <label for="header-row" class="form-label">Header Row</label>
              <div class="flex items-center">
                <input
                    type="number"
                    id="header-row"
                    v-model="headerRowIndex"
                    min="1"
                    class="form-input w-24"
                    @change="validateHeaderRow"
                />
                <span class="ml-2 text-sm text-secondary-700">
                  Which row contains your column headers?
                  <span class="text-primary-600">(Click on the row in the preview)</span>
                </span>
              </div>
              <p class="mt-1 text-xs text-secondary-500">
                Usually row 1, but might be different if your file has title rows or instructions.
              </p>
            </div>

            <!-- Data Start Row Setting -->
            <div class="form-group">
              <label for="data-start-row" class="form-label">Data Start Row</label>
              <div class="flex items-center">
                <input
                    type="number"
                    id="data-start-row"
                    v-model="dataStartRowIndex"
                    min="2"
                    class="form-input w-24"
                    @change="validateDataStartRow"
                />
                <span class="ml-2 text-sm text-secondary-700">
                  Which row does your data begin?
                  <span class="text-success-600">(Click on the row in the preview)</span>
                </span>
              </div>
              <p class="mt-1 text-xs text-secondary-500">
                Usually the row immediately after headers (row {{ headerRowIndex + 1 }}).
              </p>
            </div>
          </div>

          <div class="flex justify-end">
            <button
                @click="previewSheetData"
                class="btn-secondary mr-2"
            >
              Refresh Preview
            </button>
            <button
                @click="processExcelFile"
                class="btn-primary"
                :disabled="loading"
            >
              Continue to Mapping
            </button>
          </div>
        </div>
      </div>

      <!-- File Preview Table -->
      <div v-if="selectedFile && !headersExtracted && sheetPreviewData.length > 0" class="file-preview mb-6">
        <h3 class="text-lg font-medium mb-4">File Preview <span class="text-sm font-normal text-secondary-600">(Click on rows to select header and data start positions)</span></h3>

        <div class="overflow-x-auto bg-white rounded-lg border border-secondary-200">
          <table class="min-w-full divide-y divide-secondary-200">
            <thead>
            <tr class="bg-secondary-50">
              <th class="px-3 py-2 text-left text-xs font-medium text-secondary-600">Row #</th>
              <th v-for="col in sheetPreviewColumns" :key="col" class="px-3 py-2 text-left text-xs font-medium text-secondary-600">
                Column {{ col }}
              </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-secondary-200">
            <tr
                v-for="(row, rowIndex) in sheetPreviewData"
                :key="rowIndex"
                @click="selectRow(rowIndex + 1)"
                :class="{
                    'bg-primary-50 cursor-pointer hover:bg-primary-100': rowIndex + 1 === headerRowIndex,
                    'bg-success-50 cursor-pointer hover:bg-success-100': rowIndex + 1 === dataStartRowIndex,
                    'cursor-pointer hover:bg-gray-50': rowIndex + 1 !== headerRowIndex && rowIndex + 1 !== dataStartRowIndex
                  }"
            >
              <td class="px-3 py-2 whitespace-nowrap text-xs font-medium text-secondary-800">
                {{ rowIndex + 1 }}
                <span v-if="rowIndex + 1 === headerRowIndex" class="text-primary-600 ml-1">(Header)</span>
                <span v-if="rowIndex + 1 === dataStartRowIndex" class="text-success-600 ml-1">(Data Start)</span>
              </td>
              <td
                  v-for="(cell, colIndex) in row"
                  :key="colIndex"
                  class="px-3 py-2 whitespace-nowrap text-xs text-secondary-800"
              >
                {{ typeof cell === 'object' ? JSON.stringify(cell) : String(cell || '').substring(0, 50) }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Selection Instructions -->
        <div class="text-center mt-2 text-xs text-secondary-600">
          <p>Click on a row to select it as either header or data start row</p>
        </div>

        <!-- Context Menu for Selection -->
        <div
            v-if="showContextMenu"
            :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }"
            class="absolute bg-white shadow-lg rounded-md border border-secondary-200 p-2 z-10"
        >
          <button
              @click="setAsHeaderRow"
              class="block w-full text-left px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded"
          >
            Set as Header Row
          </button>
          <button
              @click="setAsDataStartRow"
              class="block w-full text-left px-4 py-2 text-sm text-success-600 hover:bg-success-50 rounded"
          >
            Set as Data Start Row
          </button>
          <button
              @click="hideContextMenu"
              class="block w-full text-left px-4 py-2 text-sm text-secondary-600 hover:bg-secondary-50 rounded"
          >
            Cancel
          </button>
        </div>

        <!-- Row Navigation -->
        <div class="flex justify-between items-center mt-2">
          <button
              @click="loadPreviousRows"
              class="text-sm text-primary-600"
              :disabled="previewStartRow <= 0"
          >
            &larr; Previous Rows
          </button>
          <span class="text-xs text-secondary-500">
            Showing rows {{ previewStartRow + 1 }} to {{ previewStartRow + sheetPreviewData.length }}
            {{ totalRows > 0 ? `of ${totalRows}` : '' }}
          </span>
          <button
              @click="loadNextRows"
              class="text-sm text-primary-600"
              :disabled="previewStartRow + sheetPreviewData.length >= totalRows"
          >
            Next Rows &rarr;
          </button>
        </div>
      </div>

      <!-- Column Mapping Section -->
      <div v-if="selectedFile && headersExtracted" class="mapping-section">
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Map Your Excel Columns</h3>
          <p class="text-sm text-secondary-600">
            We've detected the columns from your Excel file. Please map them to our system fields below.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-4 mb-6">
          <div class="bg-secondary-50 p-4 rounded-lg mb-4">
            <h4 class="font-medium text-secondary-800 mb-2">Required Fields</h4>
            <p class="text-sm text-secondary-600 mb-3">These fields are needed to create products in our system.</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(field, key) in requiredFields" :key="key" class="form-group">
                <label :for="`mapping-${key}`" class="form-label">
                  {{ field.label }} <span class="text-danger-500">*</span>
                </label>
                <div class="relative">
                  <select
                      :id="`mapping-${key}`"
                      v-model="columnMapping[key]"
                      class="form-select w-full"
                      :class="{ 'border-danger-300 ring-danger-500': validationErrors[key], 'border-success-300 ring-success-500': columnMapping[key] && !validationErrors[key] }"
                  >
                    <option value="">-- Select Column --</option>
                    <option v-for="header in excelHeaders" :key="header" :value="header">
                      {{ header }}
                    </option>
                  </select>
                  <div v-if="columnMapping[key]" class="absolute inset-y-0 right-10 flex items-center">
                    <span class="text-success-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div class="mt-1">
                  <p v-if="validationErrors[key]" class="text-sm text-danger-600">
                    {{ validationErrors[key] }}
                  </p>
                  <div v-else-if="columnMapping[key] && previewData.length > 0" class="text-xs text-secondary-600">
                    <strong>Sample value:</strong> {{ getSampleValueForField(key) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-secondary-50 p-4 rounded-lg">
            <div class="flex justify-between items-center mb-3">
              <div>
                <h4 class="font-medium text-secondary-800">Optional Fields</h4>
                <p class="text-sm text-secondary-600">These fields provide additional product information.</p>
              </div>
              <button
                  @click="showOptionalFields = !showOptionalFields"
                  class="text-sm text-primary-600 hover:text-primary-800"
              >
                {{ showOptionalFields ? 'Hide' : 'Show' }} optional fields
              </button>
            </div>

            <div v-if="showOptionalFields" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(field, key) in optionalFields" :key="key" class="form-group">
                <label :for="`mapping-${key}`" class="form-label">
                  {{ field.label }}
                </label>
                <div class="relative">
                  <select
                      :id="`mapping-${key}`"
                      v-model="columnMapping[key]"
                      class="form-select w-full"
                      :class="{ 'border-success-300 ring-success-500': columnMapping[key] }"
                  >
                    <option value="">-- Select Column --</option>
                    <option v-for="header in excelHeaders" :key="header" :value="header">
                      {{ header }}
                    </option>
                  </select>
                  <div v-if="columnMapping[key]" class="absolute inset-y-0 right-10 flex items-center">
                    <span class="text-success-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div class="mt-1">
                  <p class="text-xs text-secondary-500">
                    {{ field.description }}
                  </p>
                  <div v-if="columnMapping[key] && previewData.length > 0" class="text-xs text-secondary-600 mt-1">
                    <strong>Sample value:</strong> {{ getSampleValueForField(key) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-secondary-50 p-4 rounded-lg">
            <div class="flex justify-between items-center mb-3">
              <div>
                <h4 class="font-medium text-secondary-800">Product Specifications</h4>
                <p class="text-sm text-secondary-600">Map any custom specification fields from your Excel.</p>
              </div>
              <button
                  @click="showSpecFields = !showSpecFields"
                  class="text-sm text-primary-600 hover:text-primary-800"
              >
                {{ showSpecFields ? 'Hide' : 'Show' }} specification fields
              </button>
            </div>

            <div v-if="showSpecFields">
              <div class="mb-4">
                <p class="text-sm text-secondary-600 mb-2">
                  We'll automatically detect columns that start with "spec_", or you can manually map them below:
                </p>

                <div v-for="(header, index) in excelHeaders" :key="index" class="flex items-center mb-2">
                  <input
                      type="checkbox"
                      :id="`spec-${index}`"
                      :value="header"
                      v-model="specificationFields"
                      class="form-checkbox"
                  />
                  <label :for="`spec-${index}`" class="ml-2 text-sm text-secondary-700">
                    {{ header }}
                  </label>
                </div>
              </div>

              <div class="mt-4">
                <button
                    @click="addCustomSpecField"
                    class="text-sm text-primary-600 hover:underline flex items-center"
                >
                  <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                  Add Custom Specification Field
                </button>
              </div>

              <div v-for="(field, index) in customSpecFields" :key="index" class="mt-3 flex items-center">
                <div class="flex-grow">
                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="form-label text-xs">Specification Name</label>
                      <input
                          type="text"
                          v-model="field.name"
                          class="form-input w-full"
                          placeholder="e.g. Color, Size, Material"
                      />
                    </div>
                    <div>
                      <label class="form-label text-xs">Excel Column</label>
                      <select
                          v-model="field.column"
                          class="form-select w-full"
                      >
                        <option value="">-- Select Column --</option>
                        <option v-for="header in excelHeaders" :key="header" :value="header">
                          {{ header }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <button
                    @click="removeCustomSpecField(index)"
                    class="ml-2 p-1 text-danger-600 hover:text-danger-800"
                >
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="previewData.length > 0" class="preview-section mb-6">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-medium">Raw Data Preview</h3>
            <div class="text-sm text-secondary-600">
              Showing {{ Math.min(previewData.length, 5) }} of {{ previewData.length }} rows
            </div>
          </div>

          <div class="overflow-x-auto bg-white rounded-lg border border-secondary-200">
            <table class="min-w-full divide-y divide-secondary-200">
              <thead>
              <tr class="bg-secondary-50">
                <th class="px-3 py-2 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider">
                  Row
                </th>
                <th v-for="header in excelHeaders.slice(0, 10)" :key="header" class="px-3 py-2 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider">
                  {{ header }}
                </th>
                <th v-if="excelHeaders.length > 10" class="px-3 py-2 text-left text-xs font-medium text-secondary-600">
                  ...
                </th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-secondary-200">
              <tr v-for="(row, index) in previewData.slice(0, 5)" :key="index">
                <td class="px-3 py-2 whitespace-nowrap text-xs font-medium text-secondary-800">
                  {{ index + dataStartRowIndex }}
                </td>
                <td v-for="header in excelHeaders.slice(0, 10)" :key="header" class="px-3 py-2 whitespace-nowrap text-xs text-secondary-800">
                  {{ typeof row[header] === 'object' ? JSON.stringify(row[header]) : String(row[header] || '').substring(0, 50) }}
                </td>
                <td v-if="excelHeaders.length > 10" class="px-3 py-2 whitespace-nowrap text-xs text-secondary-500">
                  ...
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="previewData.length > 0 && Object.keys(columnMapping).some(k => columnMapping[k])" class="mb-6">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-lg font-medium">Mapped Data Preview</h3>
            <div class="text-sm text-secondary-600">
              Showing how your data will be imported
            </div>
          </div>

          <div class="overflow-x-auto bg-white rounded-lg border border-secondary-200">
            <table class="min-w-full divide-y divide-secondary-200">
              <thead>
              <tr class="bg-secondary-50">
                <th class="px-3 py-2 text-left text-xs font-medium text-secondary-600">Field</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-secondary-600">Excel Column</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-secondary-600">Sample Value</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-secondary-600">Status</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-secondary-200">
              <tr v-for="(field, key) in { ...requiredFields, ...optionalFields }" :key="key"
                  :class="{ 'bg-danger-50': !columnMapping[key] && key in requiredFields }">
                <td class="px-3 py-2 whitespace-nowrap text-xs font-medium text-secondary-800">
                  {{ field.label }}
                  <span v-if="key in requiredFields" class="text-danger-500">*</span>
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-secondary-800">
                  {{ columnMapping[key] || '(not mapped)' }}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-secondary-800">
                  {{ columnMapping[key] ? getSampleValueForField(key) : '—' }}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs">
                    <span v-if="columnMapping[key]" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      Mapped
                    </span>
                  <span v-else-if="key in requiredFields" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
                      Required
                    </span>
                  <span v-else class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                      Optional
                    </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="button-group">
          <button
              @click="importProducts"
              class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="loading || !isMappingValid"
          >
            <template v-if="loading">
              <span class="inline-block animate-spin mr-2">⌛</span>
              Importing Products...
            </template>
            <template v-else>
              Import Products
            </template>
          </button>

          <button
              @click="backToFileSettings"
              class="btn-secondary ml-3"
              :disabled="loading"
          >
            Back to Settings
          </button>

          <button
              @click="resetForm"
              class="btn-outline ml-3"
              :disabled="loading"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Import Results -->
      <div v-if="importResult" class="mt-6">
        <div v-if="importResult.success" class="bg-success-50 border border-success-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-success-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-success-800">
                Successfully imported {{ importResult.importedCount }} products!
              </p>
              <div v-if="importResult.invalidItems && importResult.invalidItems.length > 0" class="mt-2">
                <p class="text-sm text-success-700">
                  {{ importResult.invalidItems.length }} items were skipped due to validation errors.
                </p>
                <button
                    @click="showErrorDetails = !showErrorDetails"
                    class="mt-1 text-xs text-success-800 underline"
                >
                  {{ showErrorDetails ? 'Hide' : 'Show' }} details
                </button>
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
                Failed to import products
              </p>
              <p class="text-sm text-danger-700">
                {{ importResult.error }}
              </p>

              <!-- Validation Summary Section (for failed imports) -->
              <div v-if="importResult.validationSummary" class="mt-3 pt-3 border-t border-danger-200">
                <h4 class="text-sm font-medium text-danger-800 mb-2">Validation Issues:</h4>
                <ul class="text-xs text-danger-700 ml-2 space-y-1">
                  <li v-if="importResult.validationSummary.missingName">
                    Missing product name: {{ importResult.validationSummary.missingName }} products
                  </li>
                  <li v-if="importResult.validationSummary.missingJanCode">
                    Missing JAN code: {{ importResult.validationSummary.missingJanCode }} products
                  </li>
                  <li v-if="importResult.validationSummary.missingSku">
                    Missing SKU: {{ importResult.validationSummary.missingSku }} products
                  </li>
                  <li v-if="importResult.validationSummary.invalidPrice">
                    Invalid price: {{ importResult.validationSummary.invalidPrice }} products
                  </li>
                  <li v-if="importResult.validationSummary.duplicateJanCode">
                    Duplicate JAN code: {{ importResult.validationSummary.duplicateJanCode }} products
                  </li>
                  <li v-if="importResult.validationSummary.otherErrors">
                    Other validation errors: {{ importResult.validationSummary.otherErrors }} products
                  </li>
                </ul>

                <!-- JAN Code Examples -->
                <div v-if="importResult.validationSummary.janCodeExamples && importResult.validationSummary.janCodeExamples.length > 0" class="mt-2">
                  <p class="text-xs text-danger-800">Problematic JAN code examples:</p>
                  <ul class="text-xs text-danger-700 ml-2">
                    <li v-for="(janCode, index) in importResult.validationSummary.janCodeExamples" :key="index">
                      {{ janCode }}
                    </li>
                  </ul>
                </div>

                <button
                    @click="showErrorDetails = !showErrorDetails"
                    class="mt-2 text-xs text-danger-800 underline"
                >
                  {{ showErrorDetails ? 'Hide' : 'Show' }} detailed error list
                </button>
              </div>

              <!-- Debug Information (for development) -->
              <div v-if="importResult.debug && isDevelopment" class="mt-3 pt-3 border-t border-danger-200">
                <details>
                  <summary class="text-xs font-medium text-danger-800 cursor-pointer">Debug Information</summary>
                  <pre class="mt-2 text-xs text-danger-700 bg-danger-50 p-2 rounded overflow-auto max-h-40">{{ JSON.stringify(importResult.debug, null, 2) }}</pre>
                </details>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Error List -->
        <div v-if="showErrorDetails && importResult.invalidItems && importResult.invalidItems.length > 0" class="mt-4 bg-white border border-secondary-200 rounded-md p-4">
          <h4 class="text-sm font-medium text-secondary-900 mb-2">Validation Errors ({{ importResult.invalidItems.length }} items)</h4>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-secondary-200">
              <thead>
              <tr class="bg-secondary-50">
                <th class="px-3 py-2 text-left text-xs font-medium text-secondary-600">Row</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-secondary-600">Product</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-secondary-600">JAN Code</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-secondary-600">Errors</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-secondary-200">
              <tr v-for="(item, index) in importResult.invalidItems" :key="index">
                <td class="px-3 py-2 whitespace-nowrap text-xs text-secondary-800">
                  {{ item.rowIndex + dataStartRowIndex }}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-secondary-800">
                  {{ item.product.name || 'N/A' }}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-xs text-secondary-800">
                  {{ item.product.janCode || 'N/A' }}
                </td>
                <td class="px-3 py-2 text-xs text-danger-600">
                  <ul class="list-disc pl-4">
                    <li v-for="(error, i) in item.reasons" :key="i">
                      {{ error }}
                    </li>
                  </ul>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useProductStore } from '~/stores/products';
import * as XLSX from 'xlsx';

const productStore = useProductStore();

// Refs
const fileInput = ref(null);
const selectedFile = ref(null);
const isDragging = ref(false);
const loading = ref(false);
const loadingMessage = ref('Processing file...');
const headersExtracted = ref(false);
const showOptionalFields = ref(false);
const showSpecFields = ref(false);
const showErrorDetails = ref(false);
const excelHeaders = ref([]);
const previewData = ref([]);
const importResult = ref(null);
const workbook = ref(null);
const excelSheets = ref([]);
const selectedSheetIndex = ref(0);
const headerRowIndex = ref(1);  // Default: 1st row contains headers
const dataStartRowIndex = ref(2);  // Default: Data starts from 2nd row
const fileType = ref('Excel');
const totalRows = ref(0);
const isDevelopment = ref(process.env.NODE_ENV === 'development');

// Sheet preview data
const sheetPreviewData = ref([]);
const sheetPreviewColumns = ref([]);
const previewStartRow = ref(0);
const previewRowLimit = 10; // Show 10 rows at a time

// Context menu for row selection
const showContextMenu = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const selectedRowForContextMenu = ref(null);

// State for column mapping
const columnMapping = reactive({});
const validationErrors = reactive({});
const specificationFields = ref([]);
const customSpecFields = ref([]);

// Define required and optional fields
const requiredFields = {
  name: {
    label: 'Product Name',
    required: true,
    description: 'The name/title of the product'
  },
  janCode: {
    label: 'JAN Code',
    required: true,
    description: 'Japanese Article Number (barcode)'
  },
  sku: {
    label: 'SKU',
    required: true,
    description: 'Stock Keeping Unit (product code)'
  },
  basePrice: {
    label: 'Base Price',
    required: true,
    description: 'The product price in JPY'
  }
};

const optionalFields = {
  description: {
    label: 'Description',
    description: 'Detailed product description'
  },
  brand: {
    label: 'Brand',
    description: 'Product manufacturer or brand name'
  },
  category: {
    label: 'Category',
    description: 'Main product category'
  },
  subcategory: {
    label: 'Subcategory',
    description: 'Secondary product category'
  },
  tags: {
    label: 'Tags',
    description: 'Comma-separated keywords for searching'
  },
  minOrderQuantity: {
    label: 'Min Order Quantity',
    description: 'Minimum quantity per order'
  },
  stock: {
    label: 'Stock',
    description: 'Available inventory quantity'
  },
  discountPercentage: {
    label: 'Discount (%)',
    description: 'Percent discount from base price'
  },
  currency: {
    label: 'Currency',
    description: 'Price currency (default: JPY)'
  },
  isActive: {
    label: 'Is Active',
    description: 'Whether the product is active/visible'
  },
  isNew: {
    label: 'Is New',
    description: 'Mark as a new product'
  },
  isFeatured: {
    label: 'Is Featured',
    description: 'Show in featured products section'
  }
};

// Get a sample value for the currently mapped field
const getSampleValueForField = (fieldKey) => {
  // Make sure we have data and a mapping for this field
  if (previewData.length === 0 || !columnMapping[fieldKey]) {
    return 'No data available';
  }

  const mappedHeader = columnMapping[fieldKey];
  const sampleRow = previewData[0];

  if (sampleRow && sampleRow[mappedHeader] !== undefined) {
    const value = sampleRow[mappedHeader];

    if (fieldKey === 'basePrice') {
      // Show price with formatting
      return typeof value === 'number'
          ? `¥${value.toLocaleString()}`
          : value;
    }

    if (value === null || value === '') {
      return '(empty)';
    }

    // For all other fields, convert to string and truncate if too long
    return typeof value === 'object'
        ? JSON.stringify(value).substring(0, 50)
        : String(value).substring(0, 50);
  }

  return '(no value)';
};

// Computed property to check if mapping is valid
const isMappingValid = computed(() => {
  // Check if all required fields are mapped
  return Object.keys(requiredFields).every(field => !!columnMapping[field]);
});

// Select a row in the preview
const selectRow = (rowNumber) => {
  // If clicking on the current header row, toggle to data start row
  if (rowNumber === headerRowIndex.value) {
    // Show context menu
    showRowSelectionMenu(rowNumber);
  }
  // If clicking on the current data start row, toggle to header row
  else if (rowNumber === dataStartRowIndex.value) {
    // Show context menu
    showRowSelectionMenu(rowNumber);
  }
  // If clicking on a new row, show context menu
  else {
    showRowSelectionMenu(rowNumber);
  }
};

// Show context menu for row selection
const showRowSelectionMenu = (rowNumber) => {
  selectedRowForContextMenu.value = rowNumber;

  // Calculate position (this is simplified; you might need to adjust based on your layout)
  // In a real implementation, you would use the event's clientX and clientY
  // For simplicity, we're positioning it near the row number column
  const rowElement = document.querySelector(`tr:nth-child(${rowNumber - previewStartRow.value})`);
  if (rowElement) {
    const rect = rowElement.getBoundingClientRect();
    contextMenuPosition.value = {
      x: rect.left + 100, // Position it a bit to the right of the row number
      y: rect.top + rect.height / 2
    };
    showContextMenu.value = true;
  }
};

// Hide context menu
const hideContextMenu = () => {
  showContextMenu.value = false;
  selectedRowForContextMenu.value = null;
};

// Set selected row as header row
const setAsHeaderRow = () => {
  if (selectedRowForContextMenu.value) {
    headerRowIndex.value = selectedRowForContextMenu.value;
    validateHeaderRow();
  }
  hideContextMenu();
};

// Set selected row as data start row
const setAsDataStartRow = () => {
  if (selectedRowForContextMenu.value) {
    dataStartRowIndex.value = selectedRowForContextMenu.value;
    validateDataStartRow();
  }
  hideContextMenu();
};

// Validate header row input
const validateHeaderRow = () => {
  // Ensure it's at least 1
  if (headerRowIndex.value < 1) {
    headerRowIndex.value = 1;
  }

  // Ensure header row is before data row
  if (headerRowIndex.value >= dataStartRowIndex.value) {
    dataStartRowIndex.value = headerRowIndex.value + 1;
  }

  // Update preview
  if (!loading.value) {
    previewSheetData();
  }
};

// Validate data start row input
const validateDataStartRow = () => {
  // Ensure it's at least 2 (row after header)
  if (dataStartRowIndex.value < 2) {
    dataStartRowIndex.value = 2;
  }

  // Ensure data row is after header row
  if (dataStartRowIndex.value <= headerRowIndex.value) {
    dataStartRowIndex.value = headerRowIndex.value + 1;
  }

  // Update preview
  if (!loading.value) {
    previewSheetData();
  }
};

// Trigger file input click
const triggerFileInput = () => {
  fileInput.value.click();
};

// Handle file selection
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel')) {
    selectedFile.value = file;

    // Set file type
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      fileType.value = 'Excel (XLSX)';
    } else if (file.type === 'application/vnd.ms-excel') {
      fileType.value = 'Excel (XLS)';
    } else {
      fileType.value = 'Spreadsheet';
    }

    readExcelFile();
  } else {
    alert('Please select a valid Excel file (.xlsx or .xls)');
  }
};

// Handle file drop
const handleFileDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel')) {
    selectedFile.value = file;

    // Set file type
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      fileType.value = 'Excel (XLSX)';
    } else if (file.type === 'application/vnd.ms-excel') {
      fileType.value = 'Excel (XLS)';
    } else {
      fileType.value = 'Spreadsheet';
    }

    readExcelFile();
  } else {
    alert('Please drop a valid Excel file (.xlsx or .xls)');
  }
};

// Read Excel file and extract basic information
const readExcelFile = async () => {
  if (!selectedFile.value) return;

  loading.value = true;
  loadingMessage.value = 'Reading Excel file...';

  try {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        workbook.value = XLSX.read(data, { type: 'array' });

        // Get all sheet names
        excelSheets.value = workbook.value.SheetNames;
        selectedSheetIndex.value = 0;

        // Get total rows count
        const sheet = workbook.value.Sheets[excelSheets.value[selectedSheetIndex.value]];
        const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:A1');
        totalRows.value = range.e.r + 1;

        // Load preview data
        previewSheetData();
      } catch (error) {
        console.error('Error reading Excel file:', error);
        alert(`Error reading Excel file: ${error.message}`);
      } finally {
        loading.value = false;
      }
    };

    reader.onerror = () => {
      loading.value = false;
      alert('Error reading the file');
    };

    reader.readAsArrayBuffer(selectedFile.value);
  } catch (error) {
    loading.value = false;
    console.error('Error processing Excel file:', error);
    alert(`Error processing Excel file: ${error.message}`);
  }
};

// Preview sheet data - IMPROVED VERSION
const previewSheetData = () => {
  if (!workbook.value) return;

  loading.value = true;
  loadingMessage.value = 'Generating preview...';

  try {
    // Get the selected sheet
    const sheetName = excelSheets.value[selectedSheetIndex.value];
    const sheet = workbook.value.Sheets[sheetName];

    console.log(`Generating preview for sheet: ${sheetName}`);

    // Get the range for the whole sheet
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:A1');
    totalRows.value = range.e.r + 1;

    console.log(`Sheet total rows: ${totalRows.value}`);

    // Find max number of columns
    let maxCols = 0;
    for (let r = 0; r <= Math.min(range.e.r, 20); r++) {
      let colCount = 0;
      for (let c = 0; c <= range.e.c; c++) {
        const cell = sheet[XLSX.utils.encode_cell({r, c})];
        if (cell) colCount = c + 1;
      }
      maxCols = Math.max(maxCols, colCount);
    }

    // Create column labels
    sheetPreviewColumns.value = Array.from({ length: maxCols }, (_, i) =>
        XLSX.utils.encode_col(i)
    );

    console.log(`Max columns detected: ${maxCols}`);

    // Get a slice of data for preview - show from the beginning to provide context
    const startRow = previewStartRow.value;
    const endRow = Math.min(startRow + previewRowLimit - 1, range.e.r);

    // Create preview range
    const previewRange = {
      s: { r: startRow, c: 0 },
      e: { r: endRow, c: range.e.c }
    };

    console.log(`Showing preview rows ${startRow+1} to ${endRow+1}`);

    // Extract data as an array of arrays (preserving the exact format as shown in Excel)
    const rawData = XLSX.utils.sheet_to_json(sheet, {
      header: 1,  // Use array format
      range: previewRange,
      defval: ''  // Default value for empty cells
    });

    // Ensure all rows have the same number of columns
    sheetPreviewData.value = rawData.map(row => {
      const filledRow = Array(maxCols).fill('');
      row.forEach((cell, i) => {
        if (i < maxCols) filledRow[i] = cell;
      });
      return filledRow;
    });

    console.log(`Preview data rows loaded: ${sheetPreviewData.value.length}`);
    console.log(`Header row set to: ${headerRowIndex.value}, Data start row set to: ${dataStartRowIndex.value}`);

  } catch (error) {
    console.error('Error generating preview:', error);
    alert(`Error: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

// Process Excel file to extract headers and data - FIXED VERSION
const processExcelFile = async () => {
  if (!selectedFile.value || !workbook.value) return;

  loading.value = true;
  loadingMessage.value = 'Extracting data...';
  headersExtracted.value = false; // Reset this flag when starting processing

  try {
    // Get the selected sheet
    const sheetName = excelSheets.value[selectedSheetIndex.value];
    const worksheet = workbook.value.Sheets[sheetName];

    console.log(`Processing Excel file - sheet: ${sheetName}`);
    console.log(`Header row: ${headerRowIndex.value}, Data start row: ${dataStartRowIndex.value}`);

    // Get header row (headerRowIndex) - 0-indexed in XLSX
    const headerRange = {
      s: { c: 0, r: headerRowIndex.value - 1 },  // Starting cell (0-indexed)
      e: { c: 100, r: headerRowIndex.value - 1 }  // Ending cell - same row
    };

    // Extract headers as an array first to preserve order exactly as they appear in Excel
    const headerArray = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,  // Return array of arrays
      range: headerRange
    })[0] || [];

    // Filter out empty headers but keep their positions using null placeholders
    const headersWithPlaceholders = headerArray.map(header => {
      const headerStr = header ? String(header).trim() : '';
      return headerStr || null; // Convert empty strings to null
    });

    // Remove null placeholders for actual data processing but remember original indices
    const headerIndices = {};
    const cleanHeaders = headersWithPlaceholders
        .map((header, index) => {
          if (header) {
            headerIndices[header] = index; // Remember original position
            return header;
          }
          return null;
        })
        .filter(Boolean); // Remove nulls

    console.log(`Raw headers from row ${headerRowIndex.value}:`, headerArray);
    console.log(`Clean headers for mapping:`, cleanHeaders);
    console.log(`Header original positions:`, headerIndices);

    // Store the cleaned headers
    excelHeaders.value = cleanHeaders;

    if (excelHeaders.value.length === 0) {
      throw new Error(`No headers found in row ${headerRowIndex.value}. Please check your header row setting.`);
    }

    // Define the data range starting from dataStartRowIndex
    const dataRowsRange = {
      s: { c: 0, r: dataStartRowIndex.value - 1 },  // 0-indexed
      e: { c: 100, r: Math.min(dataStartRowIndex.value + 19, totalRows.value - 1) }  // Get 20 rows max
    };

    console.log(`Getting data rows from ${dataStartRowIndex.value} to ${Math.min(dataStartRowIndex.value + 19, totalRows.value)}`);

    // First get data as raw rows (arrays) to preserve exact structure
    const rawDataRows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,  // Get as arrays
      range: dataRowsRange,
      defval: ''  // Default value for empty cells
    });

    console.log(`Raw data rows (first row):`, rawDataRows[0]);

    // Now transform raw rows into objects using our clean headers
    // This ensures we match data to the correct headers
    const jsonData = rawDataRows.map(row => {
      const rowObj = {};

      // For each clean header, find its value in the raw row using original position
      cleanHeaders.forEach(header => {
        const originalIndex = headerIndices[header];
        if (originalIndex !== undefined && originalIndex < row.length) {
          rowObj[header] = row[originalIndex];
        } else {
          rowObj[header] = ''; // Handle missing values
        }
      });

      return rowObj;
    });

    console.log(`Processed ${jsonData.length} data rows`);

    if (jsonData.length === 0) {
      throw new Error(`No data found starting at row ${dataStartRowIndex.value}. Please check your data start row setting.`);
    }

    // Debug - verify first row data has correct structure
    if (jsonData.length > 0) {
      console.log('First data row headers:', Object.keys(jsonData[0]));
      console.log('First data row values:', Object.values(jsonData[0]));
      console.log('First data row object:', jsonData[0]);
    }

    // Auto-map columns based on header names
    autoMapColumns(cleanHeaders, jsonData);

    // Auto-detect specification columns
    autoDetectSpecColumns(cleanHeaders);

    // Preview first 5 rows (or all if less than 5)
    previewData.value = jsonData.slice(0, Math.min(5, jsonData.length));

    // Debug - verify final mapping
    console.log('Final column mapping:', columnMapping);
    console.log('Preview data:', previewData.value);

    headersExtracted.value = true;
  } catch (error) {
    console.error('Error processing Excel file:', error);
    alert(`Error: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

const autoMapColumns = (headers, jsonData = []) => {
  // Reset mapping first
  resetMapping();

  // Map headers to fields based on common naming patterns
  const headerMapping = {
    // Required fields
    'name': ['name', 'product name', 'product_name', 'productname', 'title', 'item name', 'item_name', 'item', 'product', '品名', '商品名', '商品', '名称'],
    'janCode': ['jan code', 'jan_code', 'jancode', 'jan', 'ean', 'barcode', 'jan/ean', 'ean/jan', 'jan/upc', 'upc', 'gtin', 'JANコード', 'JAN', '商品コード'],
    'sku': ['sku', 'product code', 'product_code', 'item code', 'item_code', 'itemcode', 'article number', 'article_number', 'article', 'code', 'product id', '品番', '商品番号', 'SKU'],
    'basePrice': ['price', 'base price', 'base_price', 'baseprice', 'cost', 'wholesale price', 'wholesale_price', 'unit price', 'unitprice', 'unit_price', '価格', '単価', '値段', '上代', '上代（税抜）'],

    // Optional fields
    'description': ['description', 'desc', 'product description', 'product_description', 'details', 'product details', 'info', '説明', '商品説明', '詳細', '備考'],
    'brand': ['brand', 'manufacturer', 'maker', 'vendor', 'supplier', 'company', 'producer', 'メーカー', 'ブランド', '製造元', 'メーカ'],
    'category': ['category', 'product category', 'product_category', 'primary category', 'main category', 'dept', 'department', 'カテゴリー', 'カテゴリ', '分類'],
    'subcategory': ['subcategory', 'sub category', 'sub_category', 'product subcategory', 'product_subcategory', 'secondary category', 'sub dept', 'サブカテゴリー', 'サブカテゴリ', '子カテゴリ'],
    'tags': ['tags', 'keywords', 'search terms', 'search_terms', 'labels', 'attributes', 'タグ', 'キーワード', 'ラベル'],
    'minOrderQuantity': ['moq', 'min order qty', 'min_order_quantity', 'minimum order', 'min order', 'min qty', 'minimum quantity', '最小発注数', '最小注文数', '入数', '入数（受注単位）'],
    'stock': ['stock', 'inventory', 'quantity', 'qty', 'available', 'in stock', 'on hand', 'inventory level', '在庫数', '在庫', '数量', 'ご注文数', 'PCS合計'],
    'discountPercentage': ['discount', 'discount percentage', 'discount_percentage', 'discount %', 'sale', 'sale percentage', 'discount rate', '割引率', '割引', 'ディスカウント', '掛率'],
    'currency': ['currency', 'price currency', 'price_currency', 'currency code', 'currency_code', '通貨', '通貨コード'],
    'isActive': ['active', 'is active', 'is_active', 'enabled', 'status', 'visible', 'is available', 'online', '有効', 'ステータス', '公開状態'],
    'isNew': ['new', 'is new', 'is_new', 'new arrival', 'new_arrival', 'newly listed', '新着', '新商品', '新規'],
    'isFeatured': ['featured', 'is featured', 'is_featured', 'highlight', 'recommend', 'promoted', 'special', 'おすすめ', '特集', 'ピックアップ']
  };

  // Log original headers for debugging
  console.log('Original Excel headers for mapping:', headers);

  // For each header in the Excel file, check if it matches any of our field mappings
  headers.forEach((header, index) => {
    const headerLower = String(header).toLowerCase();

    // For debugging purposes
    console.log(`Analyzing header ${index}: "${header}"`);

    // Try pattern matching based on common naming conventions
    Object.keys(headerMapping).forEach(field => {
      // Check for exact match
      if (headerMapping[field].includes(headerLower)) {
        columnMapping[field] = header;
        console.log(`Mapped ${header} to ${field} (exact match)`);
      }
      // Check for partial match if header is in Japanese
      else if (/[\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF\u2605-\u2606\u2190-\u2195\u203B]/.test(header)) {
        // For Japanese text, try partial matching
        for (const mapping of headerMapping[field]) {
          if (headerLower.includes(mapping) || mapping.includes(headerLower)) {
            columnMapping[field] = header;
            console.log(`Mapped ${header} to ${field} (partial match with ${mapping})`);
            break;
          }
        }
      }
    });
  });

  // Basic data analysis to help with mapping
  if (jsonData && jsonData.length > 0) {
    console.log('Sample raw data for analysis:', jsonData[0]);

    // Check for required fields that might be missing
    if (!columnMapping['janCode'] && !columnMapping['sku']) {
      console.log('No JAN code or SKU field found. Looking for numeric columns...');

      // Look for numeric columns that might be JAN codes
      headers.forEach(header => {
        const sampleValue = jsonData[0][header];
        if (sampleValue && (typeof sampleValue === 'string' || typeof sampleValue === 'number')) {
          const strVal = String(sampleValue);
          const numericOnly = strVal.replace(/\D/g, '');

          // Look for long numeric values (likely JAN codes)
          if (numericOnly.length >= 8 && numericOnly.length <= 14 && /^\d+$/.test(numericOnly)) {
            console.log(`Column "${header}" might contain JAN codes based on pattern: ${sampleValue}`);

            // Suggest this as JAN code but don't automatically assign
          }
        }
      });
    }
  }

  // If SKU is missing but JAN code is present, suggest using JAN as SKU
  if (!columnMapping['sku'] && columnMapping['janCode']) {
    console.log('No SKU column found. JAN code can be used as SKU if needed.');
    // Don't automatically assign - let user confirm
  }

  // Log final suggested mappings
  console.log('Suggested column mappings:', columnMapping);
};

// Auto-detect specification columns
const autoDetectSpecColumns = (headers) => {
  // Reset spec fields
  specificationFields.value = [];

  // Check for spec_ prefixed columns
  headers.forEach(header => {
    const headerStr = String(header).toLowerCase();
    if (headerStr.startsWith('spec_') ||
        headerStr.startsWith('specification_') ||
        headerStr.includes('specification') ||
        headerStr.includes('spec ')) {
      specificationFields.value.push(header);
      console.log(`Added specification field: ${header}`);
    }
  });
};

// Load previous rows in preview
const loadPreviousRows = () => {
  if (previewStartRow.value <= 0) return;

  previewStartRow.value = Math.max(0, previewStartRow.value - previewRowLimit);
  console.log(`Loading previous rows - now showing rows ${previewStartRow.value + 1} to ${previewStartRow.value + previewRowLimit}`);
  previewSheetData();
};

// Load next rows in preview
const loadNextRows = () => {
  if (previewStartRow.value + previewRowLimit >= totalRows.value) return;

  previewStartRow.value += previewRowLimit;
  console.log(`Loading next rows - now showing rows ${previewStartRow.value + 1} to ${previewStartRow.value + previewRowLimit}`);
  previewSheetData();
};

// Close context menu when clicking outside
const handleClickOutside = (event) => {
  if (showContextMenu.value) {
    const contextMenuElement = document.querySelector('.context-menu');
    if (contextMenuElement && !contextMenuElement.contains(event.target)) {
      hideContextMenu();
    }
  }
};

// Clear selected file
const clearSelectedFile = () => {
  selectedFile.value = null;
  fileInput.value.value = null;
  headersExtracted.value = false;
  excelHeaders.value = [];
  previewData.value = [];
  importResult.value = null;
  workbook.value = null;
  excelSheets.value = [];
  sheetPreviewData.value = [];
  resetMapping();
};

// Reset form
const resetForm = () => {
  clearSelectedFile();
  showOptionalFields.value = false;
  showSpecFields.value = false;
  showErrorDetails.value = false;
  importResult.value = null;
  specificationFields.value = [];
  customSpecFields.value = [];
  headerRowIndex.value = 1;
  dataStartRowIndex.value = 2;
  previewStartRow.value = 0;
  totalRows.value = 0;
};

// Go back to file settings
const backToFileSettings = () => {
  headersExtracted.value = false;
  previewData.value = [];
  previewSheetData();
};

// Reset mapping
const resetMapping = () => {
  Object.keys(columnMapping).forEach(key => {
    columnMapping[key] = '';
  });
  Object.keys(validationErrors).forEach(key => {
    validationErrors[key] = '';
  });
};

// Add custom specification field
const addCustomSpecField = () => {
  customSpecFields.value.push({
    name: '',
    column: ''
  });
};

// Remove custom specification field
const removeCustomSpecField = (index) => {
  customSpecFields.value.splice(index, 1);
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate mapping - IMPROVED VERSION
const validateMapping = () => {
  let isValid = true;
  console.log('Validating column mapping...');

  // Clear previous validation errors
  Object.keys(validationErrors).forEach(key => {
    validationErrors[key] = '';
  });

  // Check required fields
  Object.keys(requiredFields).forEach(field => {
    if (!columnMapping[field]) {
      validationErrors[field] = `This field is required`;
      console.log(`Validation error: ${field} is required but not mapped`);
      isValid = false;
    } else {
      // Additional validation: verify that the mapped column exists in the headers
      if (!excelHeaders.value.includes(columnMapping[field])) {
        validationErrors[field] = `Mapped column "${columnMapping[field]}" not found in Excel headers`;
        console.log(`Validation error: Mapped column ${columnMapping[field]} for field ${field} not found in headers`);
        isValid = false;
      }
    }
  });

  console.log(`Mapping validation result: ${isValid ? 'VALID' : 'INVALID'}`);
  return isValid;
};

// Import products - IMPROVED VERSION
const importProducts = async () => {
  if (!validateMapping()) return;

  loading.value = true;
  loadingMessage.value = 'Importing products...';
  importResult.value = null;

  try {
    // Get the selected sheet
    const sheetName = excelSheets.value[selectedSheetIndex.value];
    const worksheet = workbook.value.Sheets[sheetName];

    console.log(`Starting import process for sheet: ${sheetName}`);
    console.log(`Header row: ${headerRowIndex.value}, Data start row: ${dataStartRowIndex.value}`);
    console.log(`Using Excel headers:`, excelHeaders.value);
    console.log(`Column mapping:`, columnMapping);

    // Define the data range for the ENTIRE dataset
    const fullDataRange = {
      s: { c: 0, r: dataStartRowIndex.value - 1 },  // 0-indexed
      e: { c: 100, r: totalRows.value - 1 }  // Get all rows to end of sheet
    };

    // First get raw data rows to preserve structure
    const rawDataRows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,  // Get as arrays
      range: fullDataRange,
      defval: ''  // Default value for empty cells
    });

    console.log(`Found ${rawDataRows.length} total data rows for import`);

    if (rawDataRows.length === 0) {
      throw new Error('No data rows found in the selected range.');
    }

    // Recreate the header indices map from the processExcelFile function
    const headerRange = {
      s: { c: 0, r: headerRowIndex.value - 1 },
      e: { c: 100, r: headerRowIndex.value - 1 }
    };

    const headerArray = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      range: headerRange
    })[0] || [];

    // Map headers to their original column positions
    const headerIndices = {};
    headerArray.forEach((header, index) => {
      if (header) {
        headerIndices[String(header).trim()] = index;
      }
    });

    console.log('Header to column index mapping:', headerIndices);

    // Now convert raw rows to objects with proper headers
    const jsonData = rawDataRows.map((row, rowIndex) => {
      const rowObj = {};

      // Map each Excel header to its value in this row
      excelHeaders.value.forEach(header => {
        const columnIndex = headerIndices[header];
        if (columnIndex !== undefined && columnIndex < row.length) {
          rowObj[header] = row[columnIndex];
        } else {
          rowObj[header] = ''; // Handle missing values
        }
      });

      return rowObj;
    });

    // Log some debug info from the first few rows
    if (jsonData.length > 0) {
      console.log('First data row:', JSON.stringify(jsonData[0]).substring(0, 200) + '...');
    }

    // Transform data according to our mapping
    const transformedData = jsonData.map((row, rowIndex) => {
      const result = {
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
          discountPercentage: 0
        },
        images: [],
        specifications: {},
        isActive: true,
        isNew: false,
        isFeatured: false
      };

      // Debug first few rows
      if (rowIndex < 3) {
        console.log(`Processing row ${rowIndex + dataStartRowIndex.value}:`,
            JSON.stringify(row).substring(0, 200) + '...');
      }

      // Process required fields
      Object.keys(requiredFields).forEach(field => {
        const mappedHeader = columnMapping[field];

        // Check if mapped column exists
        if (!mappedHeader) {
          if (rowIndex < 3) console.log(`No mapping for required field: ${field}`);
          return;
        }

        // Check if row contains mapped header
        if (row[mappedHeader] === undefined) {
          if (rowIndex < 3) console.log(`Mapped header "${mappedHeader}" not found in row data for field: ${field}`);
          return;
        }

        const rawValue = row[mappedHeader];

        // Log value for debugging first few rows
        if (rowIndex < 3) {
          console.log(`Field: ${field}, Header: ${mappedHeader}, Raw value: ${rawValue}`);
        }

        if (field === 'basePrice') {
          let priceValue = rawValue;

          // Handle prices in various formats
          if (typeof priceValue === 'string') {
            // Remove currency symbols, commas and spaces
            priceValue = priceValue.replace(/[¥,$,€,£,\s,]/g, '');
          }

          result.pricing.basePrice = parseFloat(priceValue) || 0;

          if (rowIndex < 3) {
            console.log(`Processed price: ${rawValue} -> ${result.pricing.basePrice}`);
          }
        } else if (field === 'janCode' || field === 'sku') {
          // Clean code fields (ensure as string, trim)
          result[field] = String(rawValue).trim();

          // For JAN code, also clean non-numeric characters if needed
          if (field === 'janCode' && !/^\d{8,14}$/.test(result[field])) {
            const cleaned = String(rawValue).replace(/\D/g, '');
            if (/^\d{8,14}$/.test(cleaned)) {
              // Only use cleaned version if it looks like a valid JAN code
              result[field] = cleaned;
              if (rowIndex < 3) {
                console.log(`Cleaned JAN code: ${rawValue} -> ${result[field]}`);
              }
            }
          }
        } else {
          // Handle all other required fields
          result[field] = typeof rawValue === 'string' ? rawValue.trim() : String(rawValue || '');
        }
      });

      // Process optional fields
      Object.keys(optionalFields).forEach(field => {
        const mappedHeader = columnMapping[field];
        if (!mappedHeader) return; // Skip if no mapping

        // Skip if row doesn't contain mapped header
        if (row[mappedHeader] === undefined) {
          if (rowIndex < 3) console.log(`Mapped header "${mappedHeader}" not found in row data for field: ${field}`);
          return;
        }

        const rawValue = row[mappedHeader];

        if (field === 'discountPercentage') {
          // Parse percentage values
          let discountValue = rawValue;
          if (typeof discountValue === 'string') {
            // Remove % symbol and spaces
            discountValue = discountValue.replace(/[%\s]/g, '');
          }
          result.pricing.discountPercentage = parseFloat(discountValue) || 0;
        } else if (field === 'currency') {
          result.pricing.currency = String(rawValue || 'JPY').trim();
        } else if (field === 'tags') {
          // Handle tags (comma-separated values)
          const tagsStr = String(rawValue || '');
          result.tags = tagsStr.split(',').map(tag => tag.trim()).filter(Boolean);
        } else if (field === 'minOrderQuantity' || field === 'stock') {
          result[field] = parseInt(rawValue, 10) || 0;
        } else if (field === 'isActive' || field === 'isNew' || field === 'isFeatured') {
          // Handle boolean fields
          const value = String(rawValue || '').toLowerCase();
          result[field] = value === 'true' || value === 'yes' || value === '1' || value === 'y';
        } else {
          result[field] = typeof rawValue === 'string' ? rawValue.trim() : String(rawValue || '');
        }
      });

      // Process specification fields
      specificationFields.value.forEach(header => {
        if (row[header] !== undefined && row[header] !== '') {
          // Extract the spec name from the header (remove spec_ prefix if present)
          let specName = String(header).toLowerCase();
          if (specName.startsWith('spec_')) {
            specName = specName.substring(5);
          } else if (specName.startsWith('specification_')) {
            specName = specName.substring(14);
          }

          result.specifications[specName] = row[header];
        }
      });

      // Process custom specification fields
      customSpecFields.value.forEach(field => {
        if (field.name && field.column && row[field.column] !== undefined && row[field.column] !== '') {
          result.specifications[field.name.toLowerCase()] = row[field.column];
        }
      });

      return result;
    });

    // Validate transformed products
    console.log(`Total transformed products: ${transformedData.length}`);

    // Check for empty products
    const emptyProducts = transformedData.filter(p => !p.name && !p.janCode && !p.sku);
    if (emptyProducts.length > 0) {
      console.warn(`Found ${emptyProducts.length} empty products - likely header mapping issue`);
    }

    // Additional validation to ensure data consistency
    const validProducts = transformedData.filter(product => {
      // Basic validation - name, janCode, and price are required
      return product.name && product.janCode && product.pricing.basePrice > 0;
    });

    if (validProducts.length === 0) {
      throw new Error('No valid products found after transformation. Check your column mappings and ensure data rows contain required fields.');
    }

    console.log(`Found ${validProducts.length} valid products out of ${transformedData.length}`);

    // For debugging: log a sample of the first valid product
    if (validProducts.length > 0) {
      console.log('Sample transformed product:', JSON.stringify(validProducts[0]).substring(0, 200) + '...');
    }

    // Import products via store
    const result = await productStore.importProductsFromData(validProducts);

    // Handle improved error details
    if (result && !result.success && result.invalidItems && result.invalidItems.length > 0) {
      // Adjust row numbers to match Excel file by adding dataStartRowIndex
      result.invalidItems.forEach(item => {
        item.excelRowNumber = item.rowIndex + dataStartRowIndex.value;
      });
    }

    // Force refresh products list after successful import
    if (result && result.success) {
      try {
        await productStore.fetchProducts(true); // Force refresh
      } catch (err) {
        console.error('Error refreshing product list:', err);
      }
    }

    importResult.value = result;

    // Auto-show error details if there are serious validation issues
    if (result && !result.success && result.validationSummary) {
      showErrorDetails.value = true;
    }
  } catch (error) {
    console.error('Error importing products:', error);
    importResult.value = {
      success: false,
      error: error.message || 'Error importing products'
    };
  } finally {
    loading.value = false;
  }
};

// Initialize form
onMounted(() => {
  console.log('ProductExcelUpload component mounted');
  resetMapping();
  document.addEventListener('click', handleClickOutside);
});

// Cleanup
onUnmounted(() => {
  console.log('ProductExcelUpload component unmounted');
  document.removeEventListener('click', handleClickOutside);
});
</script>
