<template>
  <div class="flex items-center py-4 border-b border-secondary-200 last:border-0">
    <!-- Product image -->
    <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-secondary-200 bg-secondary-50">
      <img
          v-if="item.image"
          :src="getImageUrl(item.image)"
          :alt="item.name"
          class="h-full w-full object-cover object-center"
      />
      <div v-else class="h-full w-full flex items-center justify-center text-secondary-400">
        <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <!-- Product details -->
    <div class="ml-4 flex-1">
      <div class="flex justify-between">
        <div>
          <h3 class="text-sm font-medium text-secondary-900">
            {{ item.name }}
          </h3>
          <p v-if="item.variant" class="text-xs text-secondary-500">
            {{ item.variant.name }}
          </p>
          <p class="text-xs text-secondary-500">
            {{ item.janCode }}
          </p>
          <p class="mt-1 text-sm font-medium text-secondary-900">
            {{ formatPrice(item.price) }}
            <span v-if="item.originalPrice" class="text-xs line-through text-secondary-400 ml-1">
              {{ formatPrice(item.originalPrice) }}
            </span>
          </p>
        </div>

        <!-- Quantity controls -->
        <div class="flex items-center">
          <div class="flex border border-secondary-300 rounded-md">
            <button
                type="button"
                class="p-1 text-secondary-600 hover:bg-secondary-100 focus:outline-none"
                :disabled="item.quantity <= item.minOrderQuantity"
                @click="updateQuantity(item.quantity - 1)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
            <input
                type="number"
                min="1"
                :value="item.quantity"
                @input="updateQuantity(parseInt($event.target.value) || 0)"
                class="w-12 text-center border-x border-secondary-300 focus:outline-none focus:ring-0 text-sm py-1"
            />
            <button
                type="button"
                class="p-1 text-secondary-600 hover:bg-secondary-100 focus:outline-none"
                @click="updateQuantity(item.quantity + 1)"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Item total and remove button -->
      <div class="flex justify-between items-center mt-2">
        <div class="text-sm text-secondary-700">
          Total: <span class="font-medium">{{ formatPrice(item.price * item.quantity) }}</span>
        </div>

        <button
            type="button"
            class="text-sm text-danger-600 hover:text-danger-500 focus:outline-none"
            @click="removeItem"
        >
          Remove
        </button>
      </div>

      <!-- Optional notes input -->
      <div v-if="showNotes" class="mt-2">
        <input
            type="text"
            v-model="notes"
            placeholder="Add notes for this item"
            class="form-input text-sm py-1 w-full"
            @change="updateNotes"
        />
      </div>
      <div v-else-if="item.notes" class="mt-1 text-xs text-secondary-600">
        <span class="font-medium">Notes:</span> {{ item.notes }}
        <button
            type="button"
            class="ml-1 text-primary-600 hover:text-primary-500"
            @click="showNotes = true"
        >
          Edit
        </button>
      </div>
      <div v-else class="mt-1">
        <button
            type="button"
            class="text-xs text-primary-600 hover:text-primary-500"
            @click="showNotes = true"
        >
          Add notes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CartItem } from '~/stores/cart';
import { useCartStore } from '~/stores/cart';

const props = defineProps<{
  item: CartItem;
}>();

const cartStore = useCartStore();
const config = useRuntimeConfig();

const showNotes = ref(false);
const notes = ref('');

// Initialize the notes from the item
onMounted(() => {
  notes.value = props.item.notes || '';
});

// Helper function to format price
const formatPrice = (price: number): string => {
  // Assuming JPY currency - adjust as needed
  return `¥${Math.round(price).toLocaleString()}`;
};

// Helper function to get image URL
const getImageUrl = (imagePath: string): string => {
  // Check if the path is already a URL
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // If it's a relative path, prepend the upload URL
  return `${config.public.uploadUrl}/${imagePath}`;
};

// Update item quantity
const updateQuantity = (quantity: number) => {
  if (quantity < 1) quantity = 1;
  if (quantity < props.item.minOrderQuantity) {
    quantity = props.item.minOrderQuantity;
  }

  cartStore.updateQuantity(props.item.id, quantity);
};

// Remove item from cart
const removeItem = () => {
  cartStore.removeFromCart(props.item.id);
};

// Update item notes
const updateNotes = () => {
  cartStore.updateItemNotes(props.item.id, notes.value);
  showNotes.value = false;
};
</script>