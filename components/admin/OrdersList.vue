<template>
  <div>
    <!-- Header with filters and search -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <!-- Search -->
        <div class="w-full md:w-64">
          <div class="relative">
            <input
                v-model="searchQuery"
                type="text"
                class="form-input w-full pl-10"
                placeholder="Search orders..."
            />
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-secondary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap items-center gap-4">
          <!-- Status filter -->
          <div class="min-w-32">
            <select v-model="statusFilter" class="form-select">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <!-- Date range filter -->
          <div>
            <div class="flex items-center gap-2">
              <div>
                <label class="form-label text-xs">From</label>
                <input type="date" v-model="dateRange.from" class="form-input text-sm py-1" />
              </div>
              <div>
                <label class="form-label text-xs">To</label>
                <input type="date" v-model="dateRange.to" class="form-input text-sm py-1" />
              </div>
            </div>
          </div>

          <!-- Clear filters -->
          <button
              class="btn-outline py-1.5 text-sm"
              @click="clearFilters"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Orders table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-secondary-200">
          <thead class="bg-secondary-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Order ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Customer
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-secondary-200">
          <tr v-if="loading" class="hover:bg-secondary-50">
            <td colspan="6" class="px-6 py-10 text-center text-secondary-500">
              <div class="flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              </div>
              <p class="mt-2">Loading orders...</p>
            </td>
          </tr>

          <tr v-else-if="filteredOrders.length === 0" class="hover:bg-secondary-50">
            <td colspan="6" class="px-6 py-10 text-center text-secondary-500">
              <svg class="h-12 w-12 text-secondary-400 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No orders found</p>
              <p class="text-sm">Try adjusting your search or filter criteria</p>
            </td>
          </tr>

          <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-secondary-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
              <a
                  href="#"
                  class="text-primary-600 hover:text-primary-900"
                  @click.prevent="viewOrderDetails(order.id)"
              >
                {{ order.id }}
              </a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
              <div>{{ order.customer.companyName }}</div>
              <div class="text-xs text-secondary-500">{{ order.customer.contactName }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
              {{ formatDate(order.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
              {{ formatCurrency(order.total) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span
                    :class="getStatusClass(order.status)"
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ order.status }}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <button
                    class="text-primary-600 hover:text-primary-900"
                    @click="viewOrderDetails(order.id)"
                >
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                </button>

                <button
                    class="text-secondary-600 hover:text-secondary-900"
                    @click="editOrder(order.id)"
                >
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>

                <button
                    class="text-danger-600 hover:text-danger-900"
                    @click="confirmDelete(order.id)"
                >
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-6 py-3 border-t border-secondary-200">
        <div class="text-sm text-secondary-700">
          Showing <span class="font-medium">{{ paginationStart }}</span> to
          <span class="font-medium">{{ paginationEnd }}</span> of
          <span class="font-medium">{{ filteredOrders.length }}</span> results
        </div>

        <div class="flex space-x-1">
          <button
              @click="currentPage > 1 && (currentPage--)"
              :disabled="currentPage === 1"
              class="btn-outline py-1 px-2 text-sm disabled:opacity-50"
              aria-label="Previous page"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>

          <button
              v-for="page in displayedPages"
              :key="page"
              @click="currentPage = page"
              :class="[
              'btn text-sm min-w-[2.5rem]',
              currentPage === page
                ? 'btn-primary'
                : 'btn-outline'
            ]"
          >
            {{ page }}
          </button>

          <button
              @click="currentPage < totalPages && (currentPage++)"
              :disabled="currentPage === totalPages"
              class="btn-outline py-1 px-2 text-sm disabled:opacity-50"
              aria-label="Next page"
          >
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showOrderModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
            class="fixed inset-0 bg-secondary-500 bg-opacity-75 transition-opacity"
            @click="showOrderModal = false"
        ></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="px-6 py-4 bg-secondary-50 border-b border-secondary-200 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-secondary-900">
              Order Details: {{ selectedOrder ? selectedOrder.id : '' }}
            </h3>

            <button
                class="text-secondary-500 hover:text-secondary-700"
                @click="showOrderModal = false"
            >
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="selectedOrder" class="p-6">
            <!-- Order information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 class="text-sm font-medium text-secondary-500 mb-1">Customer Information</h4>
                <div class="bg-secondary-50 p-4 rounded-lg">
                  <p class="font-medium">{{ selectedOrder.customer.companyName }}</p>
                  <p>{{ selectedOrder.customer.contactName }}</p>
                  <p>{{ selectedOrder.customer.email }}</p>
                  <p>{{ selectedOrder.customer.phone }}</p>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-medium text-secondary-500 mb-1">Shipping Address</h4>
                <div class="bg-secondary-50 p-4 rounded-lg">
                  <p>{{ selectedOrder.customer.address.line1 }}</p>
                  <p v-if="selectedOrder.customer.address.line2">{{ selectedOrder.customer.address.line2 }}</p>
                  <p>{{ selectedOrder.customer.address.city }}, {{ selectedOrder.customer.address.state }} {{ selectedOrder.customer.address.postalCode }}</p>
                  <p>{{ selectedOrder.customer.address.country }}</p>
                </div>
              </div>
            </div>

            <!-- Order items -->
            <h4 class="text-sm font-medium text-secondary-500 mb-3">Order Items</h4>
            <div class="overflow-x-auto mb-6">
              <table class="min-w-full divide-y divide-secondary-200">
                <thead class="bg-secondary-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-secondary-200">
                <tr v-for="(item, index) in selectedOrder.items" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                    {{ item.productName }}
                    <div v-if="item.variantName" class="text-xs text-secondary-500">
                      Variant: {{ item.variantName }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                    {{ item.sku }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                    {{ formatCurrency(item.unitPrice) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                    {{ item.quantity }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-900 text-right font-medium">
                    {{ formatCurrency(item.totalPrice) }}
                  </td>
                </tr>
                </tbody>
                <tfoot class="bg-secondary-50">
                <tr>
                  <td colspan="4" class="px-6 py-3 text-right text-sm font-medium text-secondary-500">
                    Subtotal
                  </td>
                  <td class="px-6 py-3 text-right text-sm font-medium text-secondary-900">
                    {{ formatCurrency(selectedOrder.pricing.subtotal) }}
                  </td>
                </tr>
                <tr v-if="selectedOrder.pricing.discount > 0">
                  <td colspan="4" class="px-6 py-3 text-right text-sm font-medium text-secondary-500">
                    Discount
                  </td>
                  <td class="px-6 py-3 text-right text-sm font-medium text-danger-600">
                    -{{ formatCurrency(selectedOrder.pricing.discount) }}
                  </td>
                </tr>
                <tr>
                  <td colspan="4" class="px-6 py-3 text-right text-sm font-medium text-secondary-500">
                    Tax
                  </td>
                  <td class="px-6 py-3 text-right text-sm font-medium text-secondary-900">
                    {{ formatCurrency(selectedOrder.pricing.tax) }}
                  </td>
                </tr>
                <tr>
                  <td colspan="4" class="px-6 py-3 text-right text-sm font-medium text-secondary-900">
                    Total
                  </td>
                  <td class="px-6 py-3 text-right text-base font-bold text-secondary-900">
                    {{ formatCurrency(selectedOrder.pricing.total) }}
                  </td>
                </tr>
                </tfoot>
              </table>
            </div>

            <!-- Order notes -->
            <div v-if="selectedOrder.customer.notes" class="mb-6">
              <h4 class="text-sm font-medium text-secondary-500 mb-1">Customer Notes</h4>
              <div class="bg-secondary-50 p-4 rounded-lg">
                <p class="text-sm text-secondary-700">{{ selectedOrder.customer.notes }}</p>
              </div>
            </div>

            <!-- Update Status -->
            <div class="border-t border-secondary-200 pt-6 flex justify-between items-center">
              <div class="flex items-center space-x-4">
                <label for="order-status" class="text-sm font-medium text-secondary-700">Status:</label>
                <select
                    id="order-status"
                    v-model="selectedOrder.status"
                    class="form-select"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                    class="btn-primary text-sm"
                    @click="updateOrderStatus(selectedOrder)"
                >
                  Update Status
                </button>
              </div>

              <button
                  class="btn-outline text-sm"
                  @click="printOrder(selectedOrder)"
              >
                <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
            class="fixed inset-0 bg-secondary-500 bg-opacity-75 transition-opacity"
            @click="showDeleteModal = false"
        ></div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-6 py-6">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-danger-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-danger-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-secondary-900">
                  Delete Order
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-secondary-600">
                    Are you sure you want to delete this order? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                  type="button"
                  class="btn-danger sm:ml-3"
                  @click="deleteOrder"
              >
                Delete
              </button>
              <button
                  type="button"
                  class="btn-outline mt-3 sm:mt-0"
                  @click="showDeleteModal = false"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

// Reactive state
const orders = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const statusFilter = ref('');
const dateRange = ref({
  from: '',
  to: ''
});
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showOrderModal = ref(false);
const selectedOrder = ref(null);
const showDeleteModal = ref(false);
const orderToDelete = ref(null);

// Sample data (In a real app, this would come from an API)
const sampleOrders = [
  {
    id: 'ORD-2023-001',
    customer: {
      companyName: 'ABC Company',
      contactName: 'John Smith',
      email: 'john@abccompany.com',
      phone: '+1 555-123-4567',
      address: {
        line1: '123 Business St',
        line2: 'Suite 101',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'United States'
      },
      notes: 'Please deliver during business hours (9 AM - 5 PM)'
    },
    items: [
      { productId: 'P001', productName: 'Wireless Headphones', sku: 'WH-100', janCode: '4901234567890', quantity: 10, unitPrice: 8000, totalPrice: 80000 },
      { productId: 'P002', productName: 'Bluetooth Speaker', sku: 'BS-200', janCode: '4901234567891', quantity: 5, unitPrice: 12000, totalPrice: 60000 }
    ],
    pricing: {
      subtotal: 140000,
      discount: 0,
      tax: 14000,
      total: 154000
    },
    status: 'pending',
    createdAt: '2023-04-10T09:30:00Z'
  },
  {
    id: 'ORD-2023-002',
    customer: {
      companyName: 'XYZ Industries',
      contactName: 'Jane Doe',
      email: 'jane@xyzindustries.com',
      phone: '+1 555-987-6543',
      address: {
        line1: '456 Corporate Ave',
        line2: '',
        city: 'Chicago',
        state: 'IL',
        postalCode: '60601',
        country: 'United States'
      },
      notes: ''
    },
    items: [
      { productId: 'P003', productName: 'Smart Watch', sku: 'SW-300', janCode: '4901234567892', quantity: 15, unitPrice: 15000, totalPrice: 225000 }
    ],
    pricing: {
      subtotal: 225000,
      discount: 22500,
      tax: 20250,
      total: 222750
    },
    status: 'approved',
    createdAt: '2023-04-09T14:15:00Z'
  },
  {
    id: 'ORD-2023-003',
    customer: {
      companyName: 'Acme Corp',
      contactName: 'Robert Johnson',
      email: 'robert@acmecorp.com',
      phone: '+1 555-456-7890',
      address: {
        line1: '789 Enterprise Rd',
        line2: 'Floor 12',
        city: 'Los Angeles',
        state: 'CA',
        postalCode: '90001',
        country: 'United States'
      },
      notes: 'Fragile items, handle with care'
    },
    items: [
      { productId: 'P004', productName: 'Wireless Charger', sku: 'WC-400', janCode: '4901234567893', quantity: 20, unitPrice: 3500, totalPrice: 70000 },
      { productId: 'P005', productName: 'Power Bank', sku: 'PB-500', janCode: '4901234567894', quantity: 10, unitPrice: 4500, totalPrice: 45000 },
      { productId: 'P006', productName: 'USB-C Cable', sku: 'UC-600', janCode: '4901234567895', quantity: 30, unitPrice: 1000, totalPrice: 30000 }
    ],
    pricing: {
      subtotal: 145000,
      discount: 0,
      tax: 14500,
      total: 159500
    },
    status: 'shipped',
    createdAt: '2023-04-08T11:45:00Z'
  },
  {
    id: 'ORD-2023-004',
    customer: {
      companyName: 'Global Traders',
      contactName: 'Michael Brown',
      email: 'michael@globaltraders.com',
      phone: '+1 555-789-0123',
      address: {
        line1: '321 International Blvd',
        line2: '',
        city: 'Miami',
        state: 'FL',
        postalCode: '33101',
        country: 'United States'
      },
      notes: ''
    },
    items: [
      { productId: 'P007', productName: 'Wireless Keyboard', sku: 'WK-700', janCode: '4901234567896', quantity: 8, unitPrice: 7000, totalPrice: 56000 },
      { productId: 'P008', productName: 'Wireless Mouse', sku: 'WM-800', janCode: '4901234567897', quantity: 8, unitPrice: 3500, totalPrice: 28000 }
    ],
    pricing: {
      subtotal: 84000,
      discount: 8400,
      tax: 7560,
      total: 83160
    },
    status: 'delivered',
    createdAt: '2023-04-07T16:20:00Z'
  },
  {
    id: 'ORD-2023-005',
    customer: {
      companyName: 'Smart Solutions',
      contactName: 'Sarah Wilson',
      email: 'sarah@smartsolutions.com',
      phone: '+1 555-321-6547',
      address: {
        line1: '654 Tech Park',
        line2: 'Building B',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'United States'
      },
      notes: 'Please contact before delivery'
    },
    items: [
      { productId: 'P009', productName: 'Smart Bulb', sku: 'SB-900', janCode: '4901234567898', quantity: 25, unitPrice: 2000, totalPrice: 50000 }
    ],
    pricing: {
      subtotal: 50000,
      discount: 0,
      tax: 5000,
      total: 55000
    },
    status: 'cancelled',
    createdAt: '2023-04-06T10:10:00Z'
  },
  // Additional orders to demonstrate pagination
  {
    id: 'ORD-2023-006',
    customer: {
      companyName: 'Tech Innovators',
      contactName: 'David Lee',
      email: 'david@techinnovators.com',
      phone: '+1 555-111-2222',
      address: {
        line1: '987 Innovation Way',
        line2: '',
        city: 'Boston',
        state: 'MA',
        postalCode: '02108',
        country: 'United States'
      },
      notes: ''
    },
    items: [
      { productId: 'P010', productName: 'Tablet Stand', sku: 'TS-1000', janCode: '4901234567899', quantity: 15, unitPrice: 1800, totalPrice: 27000 }
    ],
    pricing: {
      subtotal: 27000,
      discount: 0,
      tax: 2700,
      total: 29700
    },
    status: 'pending',
    createdAt: '2023-04-05T09:25:00Z'
  },
  {
    id: 'ORD-2023-007',
    customer: {
      companyName: 'Digital Solutions',
      contactName: 'Amanda Martinez',
      email: 'amanda@digitalsolutions.com',
      phone: '+1 555-444-5555',
      address: {
        line1: '753 Digital Ave',
        line2: 'Suite 300',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94102',
        country: 'United States'
      },
      notes: ''
    },
    items: [
      { productId: 'P011', productName: 'External SSD', sku: 'ES-1100', janCode: '4901234567900', quantity: 5, unitPrice: 9000, totalPrice: 45000 }
    ],
    pricing: {
      subtotal: 45000,
      discount: 4500,
      tax: 4050,
      total: 44550
    },
    status: 'approved',
    createdAt: '2023-04-04T14:40:00Z'
  }
];

// Filter orders based on search, status, and date range
const filteredOrders = computed(() => {
  let result = [...orders.value];

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(order =>
        order.id.toLowerCase().includes(query) ||
        order.customer.companyName.toLowerCase().includes(query) ||
        order.customer.contactName.toLowerCase().includes(query) ||
        order.customer.email.toLowerCase().includes(query)
    );
  }

  // Filter by status
  if (statusFilter.value) {
    result = result.filter(order => order.status === statusFilter.value);
  }

  // Filter by date range
  if (dateRange.value.from) {
    const fromDate = new Date(dateRange.value.from);
    result = result.filter(order => new Date(order.createdAt) >= fromDate);
  }

  if (dateRange.value.to) {
    const toDate = new Date(dateRange.value.to);
    // Set time to end of day for the "to" date
    toDate.setHours(23, 59, 59, 999);
    result = result.filter(order => new Date(order.createdAt) <= toDate);
  }

  return result;
});

// Paginate orders
const paginatedOrders = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredOrders.value.slice(startIndex, endIndex);
});

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / itemsPerPage.value) || 1;
});

// Calculate displayed page numbers for pagination
const displayedPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);

  // Adjust start page if we're near the end
  startPage = Math.max(1, endPage - maxPagesToShow + 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Calculate pagination details for display
const paginationStart = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, filteredOrders.value.length);
});

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Format currency
const formatCurrency = (amount) => {
  return `¥${amount.toLocaleString()}`;
};

// Get class for status badge
const getStatusClass = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Clear all filters
const clearFilters = () => {
  searchQuery.value = '';
  statusFilter.value = '';
  dateRange.value = { from: '', to: '' };
  currentPage.value = 1;
};

// View order details
const viewOrderDetails = (orderId) => {
  const order = orders.value.find(o => o.id === orderId);
  if (order) {
    selectedOrder.value = JSON.parse(JSON.stringify(order)); // Clone to avoid reference issues
    showOrderModal.value = true;
  }
};

// Edit order (placeholder function)
const editOrder = (orderId) => {
  alert(`Edit order ${orderId} functionality would go here`);
};

// Show delete confirmation modal
const confirmDelete = (orderId) => {
  orderToDelete.value = orderId;
  showDeleteModal.value = true;
};

// Delete order
const deleteOrder = () => {
  if (orderToDelete.value) {
    orders.value = orders.value.filter(o => o.id !== orderToDelete.value);
    showDeleteModal.value = false;
    orderToDelete.value = null;
    // In a real app, you would make an API call here
  }
};

// Update order status
const updateOrderStatus = (order) => {
  // Find the order in the orders array
  const index = orders.value.findIndex(o => o.id === order.id);
  if (index !== -1) {
    // Update the status
    orders.value[index].status = order.status;
    alert(`Order ${order.id} status updated to ${order.status}`);
    // In a real app, you would make an API call here
  }
};

// Print order (placeholder function)
const printOrder = (order) => {
  alert(`Print functionality for order ${order.id} would go here`);
};

// Watch for filter changes to reset to first page
watch([searchQuery, statusFilter, dateRange], () => {
  currentPage.value = 1;
});

// Initialize data
onMounted(() => {
  // Simulate API call
  setTimeout(() => {
    orders.value = sampleOrders;
    loading.value = false;
  }, 1000);
});
</script>