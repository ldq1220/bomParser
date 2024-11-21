<template>
  <div class="operation_group">
    <BomAuth />
    <ShareResult />
  </div>
</template>

<script setup lang="ts">
import BomAuth from '@/components/BomAuth/index.vue'
import ShareResult from '@/components/ShareResult/index.vue'
</script>

<style lang="scss" scoped>
.operation_group {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  margin-left: 12px;
}
</style>
