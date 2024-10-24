<template>
  <el-dialog title="更换物料" v-model="visible" width="60%" :before-close="beforClose" append-to-body>
    <el-table
      :data="props.currentMaterial.matchedIcDatas"
      border
      stripe
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{
        background: 'rgba(247, 247, 247, 1)',
        color: '#606266',
        textAlign: 'center'
      }"
    >
      <el-table-column type="index" width="50" fixed="left" />
      <el-table-column label="编码" prop="idCode" fixed="left" />
      <el-table-column label="封装" prop="package" />
      <el-table-column label="阻值" prop="resistance" v-if="currentMaterial.category_1 === '电阻'" />
      <el-table-column label="容值" prop="capacitance" v-if="currentMaterial.category_1 === '电容'" />
      <el-table-column label="感值" prop="inductance" v-if="currentMaterial.category_1 === '电感'" />
      <el-table-column label="精度" prop="tolerance" />
      <el-table-column label="品牌" prop="manufacturer" />
      <el-table-column label="单价" prop="price">
        <template #default="{ row }">
          <p v-for="item in JSON.parse(JSON.parse(row.price))" :key="item.unitPrice" style="font-size: 12px">
            {{ item.quantity }}+ : ￥{{ item.unitPrice }}
          </p>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <span>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { BomItem } from '@/types/bomParserTypes'

interface Props {
  currentMaterial: BomItem
}

const props = defineProps<Props>()
const visible = defineModel('visible', { type: Boolean, default: false })
const beforClose = () => {
  visible.value = false
}
</script>

<style lang="scss" scoped></style>
