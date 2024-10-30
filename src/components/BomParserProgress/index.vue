<template>
  <div class="bom_parser_progress">
    <el-text>处理进度</el-text>
    <el-progress :text-inside="true" :stroke-width="26" :percentage="bomParserStore.percentage">
      <template #default="{ percentage }">
        <div
          class="progress_content"
          :style="{
            paddingLeft: '10px'
          }"
        >
          <span class="percentage-label" style="margin-right: 20px" v-show="bomParserStore.fileName">
            {{ bomParserStore.fileName }}
          </span>
          <span class="percentage-value">{{ percentage }}%</span>
        </div>
      </template>
    </el-progress>
    <el-text style="width: 120px">总计用时：{{ sumTime }}s</el-text>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { BroadcastChannel } from 'broadcast-channel'
import { ElNotification } from 'element-plus'
import useBomParserStore from '@/store/bomParser'

const channel = new BroadcastChannel('parserJob')
const bomParserStore = useBomParserStore()
let sumTimer: any = null
let sumTime = ref(0)

watch(
  () => bomParserStore.bomParserStatus,
  (newVal) => {
    clearInterval(sumTimer)
    if (newVal === 'start') {
      sumTime.value = 0
      sumTimer = setInterval(() => {
        sumTime.value++
      }, 1000)
    } else if (newVal === 'end') {
      clearInterval(sumTimer)
    }
  }
)

watch(sumTime, (newVal) => {
  if (newVal >= 60 * 20) {
    channel.postMessage('parserJobStop')
    ElNotification({
      title: '解析任务异常',
      type: 'error',
      message: 'BOM解析任务超时，请重试。',
      duration: 0,
      offset: 65
    })
  }
})
</script>

<style lang="scss" scoped>
.bom_parser_progress {
  width: 60%;
  display: flex;
  justify-content: right;
  margin: 0 auto;
  :deep(.el-text) {
    font-size: 16px;
    color: #a6559d;
    font-weight: 700;
  }
  :deep(.el-progress) {
    flex: 1;
    margin: 0 20px;
  }
}
</style>
