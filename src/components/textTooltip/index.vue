<template>
  <el-tooltip :content="props.content" :disabled="!isShowTooltip" :effect="tooltipEffect" :placement="tooltipPlacement">
    <template #content>
      <el-scrollbar height="200px">
        <p style="max-width: 180px">{{ props.content }}</p>
      </el-scrollbar>
    </template>
    <p class="tooltip_p" ref="textRef" @mouseenter="handleMouseenter">
      {{ props.content }}
    </p>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { TooltipEffect, TooltipPlacement } from './types.ts'

interface Props {
  content: string
  lineNum?: number
  tooltipEffect?: TooltipEffect
  tooltipPlacement?: TooltipPlacement
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  lineNum: 1,
  tooltipEffect: 'dark',
  tooltipPlacement: 'top'
})

const isShowTooltip = ref(false)
const textRef = ref<HTMLElement | null>(null)

// 检查文本是否溢出
const handleMouseenter = () => {
  if (!textRef.value) return
  const element = textRef.value
  const lineHeight = parseInt(window.getComputedStyle(element).lineHeight)
  const maxHeight = lineHeight * props.lineNum
  isShowTooltip.value = element.scrollHeight > maxHeight
}

// 组件挂载后进行一次检查
onMounted(() => {
  handleMouseenter()
})
</script>

<style lang="scss" scoped>
@mixin text-ellipsis($line) {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: $line;
  -webkit-box-orient: vertical;
  white-space: normal;
}

.tooltip_p {
  cursor: pointer;
  width: 100%;
  margin: 0;
  line-height: 1.5;
  @include text-ellipsis(v-bind(lineNum));
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
