<template>
  <el-popover placement="right" title="物料参数" :width="260" trigger="hover" :popper-style="{ lineHeight: '24px' }">
    <template #reference>
      <el-text type="primary" style="cursor: pointer">更多参数...</el-text>
    </template>

    <p v-for="item in parameterView" :key="item.value">
      <span v-if="props.parameter[item.value]">{{ item.label }}: {{ props.parameter[item.value] }}</span>
    </p>
  </el-popover>
</template>

<script setup lang="ts">
interface Props {
  parameter: object
}

const props = defineProps<Props>()

const parameterView = [
  { label: '编码', value: 'idCode' },
  { label: '品牌', value: 'manufacturer' },
  { label: '封装', value: 'package' },
  { label: '精度', value: 'tolerance' },
  { label: '阻值', value: 'resistance' },
  { label: '容值', value: 'capacitance' },
  { label: '感值', value: 'inductance' }
]
</script>

<style lang="scss" scoped></style>
