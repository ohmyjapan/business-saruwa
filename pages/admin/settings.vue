<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-secondary-900 mb-2">Settings</h1>
      <p class="text-secondary-600">Manage your store settings and preferences</p>
    </div>

    <!-- Settings Tabs -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div class="border-b border-secondary-200">
        <nav class="flex -mb-px">
          <button
              v-for="(tab, index) in tabs"
              :key="index"
              @click="activeTab = index"
              :class="[
              'py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap',
              activeTab === index
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- General Settings Tab -->
        <div v-if="activeTab === 0">
          <h2 class="text-lg font-medium text-secondary-900 mb-4">General Settings</h2>

          <div class="space-y-6">
            <!-- Store Information -->
            <div>
              <h3 class="text-sm font-medium text-secondary-900 mb-3">Store Information</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="store-name" class="form-label">Store Name</label>
                  <input id="store-name" type="text" class="form-input" value="WholesaleHub" />
                </div>

                <div>
                  <label for="store-email" class="form-label">Store Email</label>
                  <input id="store-email" type="email" class="form-input" value="info@example.com" />
                </div>

                <div>
                  <label for="store-phone" class="form-label">Store Phone</label>
                  <input id="store-phone" type="tel" class="form-input" value="+81 123-456-789" />
                </div>

                <div>
                  <label for="store-address" class="form-label">Store Address</label>
                  <input id="store-address" type="text" class="form-input" value="123 Business Street, Tokyo, Japan" />
                </div>
              </div>
            </div>

            <!-- Currency and Language -->
            <div class="border-t border-secondary-200 pt-6">
              <h3 class="text-sm font-medium text-secondary-900 mb-3">Currency and Language</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="default-currency" class="form-label">Default Currency</label>
                  <select id="default-currency" class="form-select">
                    <option value="JPY" selected>Japanese Yen (JPY)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                  </select>
                </div>

                <div>
                  <label for="default-language" class="form-label">Default Language</label>
                  <select id="default-language" class="form-select">
                    <option value="en-US" selected>English (US)</option>
                    <option value="ja-JP">Japanese</option>
                    <option value="zh-CN">Chinese (Simplified)</option>
                    <option value="ko-KR">Korean</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <div class="border-t border-secondary-200 pt-6">
              <button type="button" class="btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <!-- Notification Settings Tab -->
        <div v-if="activeTab === 1">
          <h2 class="text-lg font-medium text-secondary-900 mb-4">Notification Settings</h2>

          <div class="space-y-6">
            <!-- Email Notifications -->
            <div>
              <h3 class="text-sm font-medium text-secondary-900 mb-3">Email Notifications</h3>

              <div class="space-y-3">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input id="email-new-order" type="checkbox" class="form-checkbox" checked />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="email-new-order" class="font-medium text-secondary-900">New Order</label>
                    <p class="text-secondary-500">Receive an email when a new order is placed</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input id="email-low-stock" type="checkbox" class="form-checkbox" checked />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="email-low-stock" class="font-medium text-secondary-900">Low Stock</label>
                    <p class="text-secondary-500">Receive an email when product stock is running low</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input id="email-customer-account" type="checkbox" class="form-checkbox" checked />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="email-customer-account" class="font-medium text-secondary-900">New Customer Account</label>
                    <p class="text-secondary-500">Receive an email when a new customer account is created</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slack Integration -->
            <div class="border-t border-secondary-200 pt-6">
              <h3 class="text-sm font-medium text-secondary-900 mb-3">Slack Integration</h3>

              <div class="space-y-4">
                <div>
                  <label for="slack-webhook" class="form-label">Slack Webhook URL</label>
                  <input id="slack-webhook" type="text" class="form-input" placeholder="https://hooks.slack.com/services/..." />
                  <p class="mt-1 text-xs text-secondary-500">Enter your Slack webhook URL to receive notifications in your Slack channel</p>
                </div>

                <div class="space-y-3">
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input id="slack-new-order" type="checkbox" class="form-checkbox" checked />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="slack-new-order" class="font-medium text-secondary-900">New Order</label>
                      <p class="text-secondary-500">Receive a Slack notification when a new order is placed</p>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input id="slack-low-stock" type="checkbox" class="form-checkbox" />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="slack-low-stock" class="font-medium text-secondary-900">Low Stock</label>
                      <p class="text-secondary-500">Receive a Slack notification when product stock is running low</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <div class="border-t border-secondary-200 pt-6">
              <button type="button" class="btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <!-- User Account Tab -->
        <div v-if="activeTab === 2">
          <h2 class="text-lg font-medium text-secondary-900 mb-4">User Accounts</h2>

          <div class="space-y-6">
            <!-- Admin Users -->
            <div>
              <h3 class="text-sm font-medium text-secondary-900 mb-3">Admin Users</h3>

              <div class="overflow-x-auto bg-secondary-50 rounded-lg">
                <table class="min-w-full divide-y divide-secondary-200">
                  <thead>
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Name</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Email</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Role</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Last Login</th>
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                  </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-secondary-200">
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">Admin User</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">admin@example.com</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">Super Admin</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">Apr 15, 2023</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button class="text-primary-600 hover:text-primary-900">Edit</button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>

              <div class="mt-4">
                <button type="button" class="btn-outline text-sm">
                  <svg class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                  </svg>
                  Add Admin User
                </button>
              </div>
            </div>

            <!-- Change Password -->
            <div class="border-t border-secondary-200 pt-6">
              <h3 class="text-sm font-medium text-secondary-900 mb-3">Change Your Password</h3>

              <div class="space-y-4 max-w-lg">
                <div>
                  <label for="current-password" class="form-label">Current Password</label>
                  <input id="current-password" type="password" class="form-input" />
                </div>

                <div>
                  <label for="new-password" class="form-label">New Password</label>
                  <input id="new-password" type="password" class="form-input" />
                </div>

                <div>
                  <label for="confirm-password" class="form-label">Confirm New Password</label>
                  <input id="confirm-password" type="password" class="form-input" />
                </div>

                <div>
                  <button type="button" class="btn-primary">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Use admin layout
definePageMeta({
  layout: 'admin'
});

// Settings tabs
const tabs = [
  { name: 'General' },
  { name: 'Notifications' },
  { name: 'User Accounts' }
];

const activeTab = ref(0);
</script>