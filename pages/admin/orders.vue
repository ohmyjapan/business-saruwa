<template>
  <div>
    <OrdersList />
  </div>
</template>

<script setup>
import OrdersList from '~/components/admin/OrdersList.vue';

// Use admin layout
definePageMeta({
  layout: 'admin'
});
</script>