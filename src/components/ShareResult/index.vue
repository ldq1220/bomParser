<template>
  <div class="share">
    <el-tooltip content="分享" placement="bottom" effect="light">
      <img
        :src="currentIcon"
        alt=""
        @click="copyResultUrl"
        @mouseenter="currentIcon = ShareMove"
        @mouseleave="currentIcon = ShareIcon"
      />
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import ShareIcon from './share.svg'
import ShareMove from './shareMove.svg'
import useClipboard from 'vue-clipboard3'

const currentIcon = ref(ShareIcon)

// 复制方法
const copyResultUrl = async () => {
  try {
    const { toClipboard } = useClipboard()
    const jobData = localStorage.getItem('jobData') as string
    if (!jobData) return ElMessage.warning('暂无解析任务可分享，请上传BOM表。')
    const jobId = JSON.parse(jobData).jobId
    await toClipboard(`${window.location.href}?jobId=${jobId}`)
    ElMessage.success('已复制分享链接。')
  } catch (e: any) {
    ElMessage.error('复制失败', e)
  }
}
</script>

<style lang="scss" scoped>
.share {
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
