<template>
  <component
      :is="tag"
      :type="type"
      :class="[
      'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses,
      variantClasses,
      roundedClasses,
      widthClasses,
      {'opacity-75 cursor-not-allowed': loading}
    ]"
      :disabled="disabled || loading"
      v-bind="$attrs"
      @click="onClick"
  >
    <!-- Loading spinner -->
    <svg
        v-if="loading"
        class="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
      <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
      ></circle>
      <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <!-- Leading Icon -->
    <slot name="icon-left"></slot>

    <!-- Button Content -->
    <slot></slot>

    <!-- Trailing Icon -->
    <slot name="icon-right"></slot>
  </component>
</template>

<script setup lang="ts">
const props = defineProps({
  tag: {
    type: String,
    default: 'button'
  },
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) =>
        ['primary', 'secondary', 'success', 'danger', 'warning', 'outline', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  rounded: {
    type: String,
    default: 'md',
    validator: (value: string) => ['none', 'sm', 'md', 'lg', 'full'].includes(value)
  },
  width: {
    type: String,
    default: 'auto',
    validator: (value: string) => ['auto', 'full'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

// Size classes
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'px-2 py-1 text-xs';
    case 'sm': return 'px-3 py-1.5 text-sm';
    case 'lg': return 'px-5 py-2.5 text-lg';
    case 'xl': return 'px-6 py-3 text-xl';
    default: return 'px-4 py-2 text-sm';
  }
});

// Variant classes
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500';
    case 'secondary':
      return 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200 focus:ring-secondary-400';
    case 'success':
      return 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500';
    case 'danger':
      return 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500';
    case 'warning':
      return 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500';
    case 'outline':
      return 'bg-white text-secondary-800 border border-secondary-300 hover:bg-secondary-50 focus:ring-secondary-400';
    case 'ghost':
      return 'bg-transparent text-secondary-700 hover:bg-secondary-50 focus:ring-secondary-400';
    default:
      return 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500';
  }
});

// Rounded classes
const roundedClasses = computed(() => {
  switch (props.rounded) {
    case 'none': return 'rounded-none';
    case 'sm': return 'rounded-sm';
    case 'lg': return 'rounded-lg';
    case 'full': return 'rounded-full';
    default: return 'rounded-md';
  }
});

// Width classes
const widthClasses = computed(() => {
  return props.width === 'full' ? 'w-full' : '';
});

// Click handler that emits the click event when not disabled or loading
const onClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>