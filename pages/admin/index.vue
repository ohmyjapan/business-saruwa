<template>
  <div>
    <Dashboard />
  </div>
</template>

<script setup>
import Dashboard from '~/components/admin/Dashboard.vue';

// Use admin layout
definePageMeta({
  layout: 'admin'
});
</script>