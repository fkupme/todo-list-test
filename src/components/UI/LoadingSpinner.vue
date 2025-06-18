<template>
  <div class="spinner" :class="{ 'spinner--small': size === 'small' }">
    <div class="spinner__circle"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'normal' | 'small';
}

withDefaults(defineProps<Props>(), {
  size: 'normal',
});
</script>

<style lang="scss" scoped>
@import '@/styles/variables';

.spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  
  &--small {
    width: 16px;
    height: 16px;
  }
}

.spinner__circle {
  width: 100%;
  height: 100%;
  border: 2px solid $border;
  border-top-color: $primary-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 