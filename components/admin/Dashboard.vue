<template>
  <div>
    <!-- Dashboard Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Products Card -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-500">Total Products</p>
            <h3 class="text-2xl font-bold mt-1">{{ totalProducts }}</h3>
          </div>
          <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
        </div>
        <div class="mt-2 flex items-center">
          <span :class="productsChange >= 0 ? 'text-success-500' : 'text-danger-500'">
            {{ productsChange >= 0 ? '+' : '' }}{{ productsChange }}%
          </span>
          <span class="text-secondary-500 text-sm ml-2">from last month</span>
        </div>
      </div>

      <!-- Orders Card -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-500">Pending Orders</p>
            <h3 class="text-2xl font-bold mt-1">{{ pendingOrders }}</h3>
          </div>
          <div class="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center text-warning-600">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
        </div>
        <div class="mt-2 flex items-center">
          <span class="text-secondary-500 text-sm">Requires attention</span>
        </div>
      </div>

      <!-- Revenue Card -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-500">Total Revenue</p>
            <h3 class="text-2xl font-bold mt-1">¥{{ formatNumber(totalRevenue) }}</h3>
          </div>
          <div class="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center text-success-600">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-2 flex items-center">
          <span :class="revenueChange >= 0 ? 'text-success-500' : 'text-danger-500'">
            {{ revenueChange >= 0 ? '+' : '' }}{{ revenueChange }}%
          </span>
          <span class="text-secondary-500 text-sm ml-2">from last month</span>
        </div>
      </div>

      <!-- Low Stock Card -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-500">Low Stock Items</p>
            <h3 class="text-2xl font-bold mt-1">{{ lowStockItems }}</h3>
          </div>
          <div class="w-12 h-12 bg-danger-100 rounded-full flex items-center justify-center text-danger-600">
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <div class="mt-2">
          <a href="#" class="text-primary-600 text-sm hover:text-primary-700">
            View inventory report
          </a>
        </div>
      </div>
    </div>

    <!-- Recent Orders and Activity Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Orders -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm">
          <div class="px-6 py-4 border-b border-secondary-200 flex justify-between items-center">
            <h2 class="font-semibold text-secondary-900">Recent Orders</h2>
            <a href="/admin/orders" class="text-sm text-primary-600 hover:text-primary-700">
              View all
            </a>
          </div>

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
                  Amount
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-secondary-200">
              <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-secondary-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                  {{ order.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                  {{ order.customer }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                  {{ formatDate(order.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                  ¥{{ formatNumber(order.amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(order.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ order.status }}
                    </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Activity Feed -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm h-full">
          <div class="px-6 py-4 border-b border-secondary-200">
            <h2 class="font-semibold text-secondary-900">Recent Activity</h2>
          </div>

          <div class="p-6">
            <ul class="space-y-6">
              <li v-for="(activity, index) in recentActivities" :key="index" class="relative">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div :class="getActivityIconClass(activity.type)" class="h-8 w-8 rounded-full flex items-center justify-center">
                      <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path v-if="activity.type === 'order'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        <path v-else-if="activity.type === 'product'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                        <path v-else-if="activity.type === 'user'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4 flex-1">
                    <p class="text-sm text-secondary-900">{{ activity.message }}</p>
                    <p class="text-xs text-secondary-500 mt-1">{{ formatTimeAgo(activity.timestamp) }}</p>
                  </div>
                </div>

                <!-- Timeline line -->
                <div v-if="index !== recentActivities.length - 1" class="absolute top-8 left-4 -ml-px h-full w-0.5 bg-secondary-200"></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Sample data for dashboard (In a real app, this would come from an API)
const totalProducts = ref(324);
const productsChange = ref(5.2);
const pendingOrders = ref(12);
const totalRevenue = ref(1284650);
const revenueChange = ref(12.5);
const lowStockItems = ref(8);

// Sample recent orders
const recentOrders = ref([
  {
    id: 'ORD-2023-001',
    customer: 'ABC Company',
    date: '2023-04-10T09:30:00',
    amount: 245000,
    status: 'Pending'
  },
  {
    id: 'ORD-2023-002',
    customer: 'XYZ Industries',
    date: '2023-04-09T14:15:00',
    amount: 128700,
    status: 'Approved'
  },
  {
    id: 'ORD-2023-003',
    customer: 'Acme Corp',
    date: '2023-04-08T11:45:00',
    amount: 312900,
    status: 'Shipped'
  },
  {
    id: 'ORD-2023-004',
    customer: 'Global Traders',
    date: '2023-04-07T16:20:00',
    amount: 187500,
    status: 'Delivered'
  },
  {
    id: 'ORD-2023-005',
    customer: 'Smart Solutions',
    date: '2023-04-06T10:10:00',
    amount: 98200,
    status: 'Cancelled'
  }
]);

// Sample recent activities
const recentActivities = ref([
  {
    type: 'order',
    message: 'New order received from ABC Company',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
  },
  {
    type: 'product',
    message: 'Product "Wireless Headphones" stock updated',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    type: 'user',
    message: 'New account created for XYZ Industries',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
  },
  {
    type: 'order',
    message: 'Order ORD-2023-002 has been approved',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    type: 'product',
    message: '15 new products added to inventory',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  }
]);

// Format numbers with commas
const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(date);
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

// Get class for activity icon
const getActivityIconClass = (type) => {
  switch (type) {
    case 'order':
      return 'bg-blue-100 text-blue-600';
    case 'product':
      return 'bg-green-100 text-green-600';
    case 'user':
      return 'bg-purple-100 text-purple-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

// Format time ago
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSecs < 60) {
    return 'just now';
  } else if (diffInMins < 60) {
    return `${diffInMins} minute${diffInMins > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
};

onMounted(() => {
  // In a real app, you would fetch data here
  console.log('Dashboard component mounted');
});
</script>