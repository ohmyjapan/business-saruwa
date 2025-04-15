<template>
  <div
      :class="[
      'overflow-hidden',
      variantClasses,
      elevationClasses,
      roundedClasses,
      borderClasses,
      paddingClasses,
      {'hover:shadow-lg transition-shadow duration-200': hover}
    ]"
  >
    <!-- Optional card header -->
    <div
        v-if="$slots.header"
        :class="[
        'border-b border-secondary-200',
        headerClasses
      ]"
    >
      <slot name="header"></slot>
    </div>

    <!-- Card body -->
    <div :class="bodyClasses">
      <slot></slot>
    </div>

    <!-- Optional card footer -->
    <div
        v-if="$slots.footer"
        :class="[
        'border-t border-secondary-200',
        footerClasses
      ]"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value: string) => ['default', 'flat', 'transparent'].includes(value)
  },
  elevation: {
    type: String,
    default: 'md',
    validator: (value: string) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  rounded: {
    type: String,
    default: 'md',
    validator: (value: string) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  bordered: {
    type: Boolean,
    default: false
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value: string) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  },
  headerPadding: {
    type: String,
    default: 'md',
    validator: (value: string) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  bodyPadding: {
    type: String,
    default: 'md',
    validator: (value: string) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  footerPadding: {
    type: String,
    default: 'md',
    validator: (value: string) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
  }
});

// Variant classes
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'flat': return 'bg-secondary-50';
    case 'transparent': return 'bg-transparent';
    default: return 'bg-white';
  }
});

// Elevation classes
const elevationClasses = computed(() => {
  if (props.variant === 'transparent') return '';

  switch (props.elevation) {
    case 'none': return '';
    case 'sm': return 'shadow-sm';
    case 'lg': return 'shadow-lg';
    case 'xl': return 'shadow-xl';
    default: return 'shadow';
  }
});

// Rounded classes
const roundedClasses = computed(() => {
  switch (props.rounded) {
    case 'none': return 'rounded-none';
    case 'sm': return 'rounded-sm';
    case 'lg': return 'rounded-lg';
    case 'xl': return 'rounded-xl';
    default: return 'rounded-md';
  }
});

// Border classes
const borderClasses = computed(() => {
  return props.bordered ? 'border border-secondary-200' : '';
});

// Padding classes for the whole card
const paddingClasses = computed(() => {
  // If individual padding is specified, we don't apply padding to the card container
  if (props.headerPadding !== 'md' || props.bodyPadding !== 'md' || props.footerPadding !== 'md') {
    return '';
  }

  switch (props.padding) {
    case 'none': return '';
    case 'sm': return 'p-3';
    case 'lg': return 'p-6';
    case 'xl': return 'p-8';
    default: return 'p-4';
  }
});

// Header padding classes
const headerClasses = computed(() => {
  // If the card has uniform padding applied, we don't need additional padding
  if (props.padding !== 'md' && props.padding !== 'none') {
    return '';
  }

  switch (props.headerPadding) {
    case 'none': return '';
    case 'sm': return 'px-3 py-2';
    case 'lg': return 'px-6 py-4';
    case 'xl': return 'px-8 py-5';
    default: return 'px-4 py-3';
  }
});

// Body padding classes
const bodyClasses = computed(() => {
  // If the card has uniform padding applied, we don't need additional padding
  if (props.padding !== 'md' && props.padding !== 'none') {
    return '';
  }

  switch (props.bodyPadding) {
    case 'none': return '';
    case 'sm': return 'p-3';
    case 'lg': return 'p-6';
    case 'xl': return 'p-8';
    default: return 'p-4';
  }
});

// Footer padding classes
const footerClasses = computed(() => {
  // If the card has uniform padding applied, we don't need additional padding
  if (props.padding !== 'md' && props.padding !== 'none') {
    return '';
  }

  switch (props.footerPadding) {
    case 'none': return '';
    case 'sm': return 'px-3 py-2';
    case 'lg': return 'px-6 py-4';
    case 'xl': return 'px-8 py-5';
    default: return 'px-4 py-3';
  }
});
</script>