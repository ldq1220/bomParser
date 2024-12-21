<template>
  <div class="save_button">
    <el-button type="primary" @click="updateNocoDB" :disabled="bomParserStore.percentage !== 100">确认无误</el-button>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { updateCrmData } from '../api'
import useBomParserStore from '@/store/bomParser'

const bomParserStore = useBomParserStore()

const updateNocoDB = () => {
  try {
    updateCrmData()
    ElMessage.success('操作成功！')
  } catch (error) {
    ElMessage.error('操作失败！')
    console.error(error)
  }
}
</script>

<style lang="scss" scoped></style>
