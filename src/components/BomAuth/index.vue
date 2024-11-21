<template>
  <div class="bom_auth_container">
    <el-popover placement="top-start" :width="300" trigger="hover">
      <template #reference>
        <img :src="bomParserStore.xApiKey ? Lock : Unlock" alt="lock" />
      </template>

      <el-input
        v-model="bomParserStore.xApiKey"
        type="password"
        placeholder="请输入密钥，按回车确认"
        @keyup.enter="setXApiKey"
        show-password
      />
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Lock from './lock.svg'
import Unlock from './unlock.svg'
import useBomParserStore from '@/store/bomParser'

const bomParserStore = useBomParserStore()

onMounted(() => {
  const xApiKey = localStorage.getItem('xApiKey')
  if (xApiKey) bomParserStore.xApiKey = xApiKey
})

const setXApiKey = () => {
  bomParserStore.setXApiKey(bomParserStore.xApiKey)
  window.location.reload()
}
</script>

<style lang="scss" scoped>
.bom_auth_container {
  cursor: pointer;

  img {
    transition: all 0.3s ease-in-out;

    &:hover {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }
}
</style>
