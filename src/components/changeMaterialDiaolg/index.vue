<template>
  <el-dialog title="更换物料" v-model="visible" width="60%" @open="handleOpen" append-to-body>
    <el-table
      :data="materialSimilarData"
      border
      stripe
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        background: 'rgba(247, 247, 247, 1)',
        color: '#606266',
        textAlign: 'center'
      }"
      v-loading="loading"
    >
      <el-table-column type="index" width="50" fixed="left" />
      <el-table-column label="编码" prop="idCode" fixed="left" />
      <el-table-column label="品牌" prop="manufacturer" />
      <el-table-column label="封装" prop="package" width="100" />
      <el-table-column label="单价" width="100">
        <template #default="{ row }">
          <span style="color: #ff4a4b" v-if="row.price?.[0]?.unitPrice">￥{{ row.price?.[0]?.unitPrice }}</span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>

      <el-table-column label="其他规格">
        <template #default="{ row }">
          {{ specValues(row) }}
        </template>
      </el-table-column>
      <el-table-column label="更换" width="140">
        <template #default="{ row }">
          <el-button type="primary" v-if="row.hasSelect">已选择</el-button>
          <el-button @click="handleChangeMaterial(row)" v-else>选择</el-button>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <span></span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BomItem } from '@/types/bomParserTypes'
import { reqGetMaterialSimilarData, reqChangeMaterial } from '@/api/bomParser'
import { ElMessage } from 'element-plus'

interface Props {
  currentMaterial: BomItem
}

const props = defineProps<Props>()
const visible = defineModel('visible', { type: Boolean, default: false })
const emit = defineEmits(['handleChangeMaterial'])

const loading = ref(false)
const materialSimilarData = ref([])

const handleOpen = async () => {
  try {
    loading.value = true
    materialSimilarData.value = []
    await new Promise((resolve) => setTimeout(resolve, 500)) // 等待500ms，防止loading闪烁
    const { result } = await reqGetMaterialSimilarData(props.currentMaterial.id)
    materialSimilarData.value = result[0].matchedIcDatas
    materialSimilarData.value.forEach(
      (item: any) => (item.hasSelect = item.md5No && item.md5No === props.currentMaterial.matchedIcDatas?.[0]?.md5No)
    )
    materialSimilarData.value.sort((a: any, b: any) => Number(b.hasSelect) - Number(a.hasSelect))
  } finally {
    loading.value = false
  }
}

const handleChangeMaterial = async (row: any) => {
  try {
    loading.value = true
    const { code } = await reqChangeMaterial(props.currentMaterial.id, row.md5No)
    if (code === '00000') {
      ElMessage.success('更换成功')
      visible.value = false
      emit('handleChangeMaterial', props.currentMaterial.id, row) // 通知父组件更换物料
    }
  } finally {
    loading.value = false
  }
}

const specValues = (spec: any) => {
  const excludeKeys = ['package', 'manufacturer', 'idCode', 'md5No', 'status', 'hasSelect', 'price']
  const otherSpecs = Object.fromEntries(Object.entries(spec).filter(([key]) => !excludeKeys.includes(key)))
  return Object.values(otherSpecs).join(' ')
}
</script>

<style lang="scss" scoped></style>
