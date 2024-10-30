<template>
  <div class="bom_parser_table margin_auto" v-loading="bomParserStore.tableLoading">
    <el-table
      :data="tableList"
      border
      stripe
      height="calc(100vh - 200px)"
      :header-cell-style="{
        background: 'rgba(247, 247, 247, 1)',
        color: '#606266',
        textAlign: 'center'
      }"
    >
      <el-table-column type="index" label="序号" width="60" fixed="left" />
      <el-table-column prop="" label="原始需求" width="200px" fixed="left">
        <template #default="{ row }">
          <TextTooltip
            :content="row.original_demand"
            :lineNum="4"
            tooltipEffect="light"
            tooltipPlacement="right-start"
          />
        </template>
      </el-table-column>
      <el-table-column prop="" label="分类" width="160px" fixed="left">
        <template #default="{ row }">
          <div class="" v-if="row.category_1">
            <p>
              <span class="label">一级分类：</span>
              <span>{{ row.category_1 }}</span>
            </p>
            <p>
              <span class="label">二级分类：</span>
              <span>{{ row.category_2 }}</span>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="" label="整理后需求" min-width="200px" fixed="left">
        <template #default="{ row }">
          <div class="" v-if="row.spec">
            <p>
              <span class="label">型号：</span>
              <span>{{ row.part_number }}</span>
            </p>
            <p>
              <span class="label">品牌：</span>
              <span>{{ row.manufacturer?.join('/') }}</span>
            </p>
            <p>
              <span class="label">封装：</span>
              <span>{{ row.spec.package }}</span>
            </p>
            <p>
              <span class="label">参数：</span>
              <span>
                {{
                  `${row.spec.value ?? ''}${row.spec.unit ?? ''} ${row.spec.tolerance ?? ''} ${row.spec.power ?? ''}`
                }}
              </span>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="" label="需求量" fixed="left">
        <template #default="{ row }">
          <div class="" v-if="row.spec">{{ row.quantity }}</div>
        </template>
      </el-table-column>
      <el-table-column label="结果" class-name="column_result column_result_first" width="100px" align="center">
        <template #default="{ row }">
          <el-tag :type="getResultTagType(row)" round>
            {{ getResultTagText(row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="" label="推荐匹配商品" class-name="column_result" min-width="200">
        <template #default="{ row }">
          <div class="product_info" v-if="hasMatchedMaterial(row)">
            <div class="product_info_item">
              <span class="label">编码：</span>
              <span class="">{{ row.matchedIcDatas[0].idCode }}</span>
            </div>
            <div class="product_info_item">
              <span class="label">品牌：</span>
              <span class="">{{ row.matchedIcDatas[0].manufacturer }}</span>
            </div>
            <div class="product_info_item">
              <span class="label">封装：</span>
              <span class="">{{ row.matchedIcDatas[0].package }}</span>
            </div>
            <div class="product_info_item">
              <span class="label">参数：</span>
              <span class="">
                {{
                  `
                ${row.matchedIcDatas[0].resistance ?? ''} 
                ${row.matchedIcDatas[0].capacitance ?? ''}
                ${row.matchedIcDatas[0].inductance ?? ''} 
                ${row.matchedIcDatas[0].tolerance ?? ''}
                ${row.matchedIcDatas[0].power ?? ''}
                `
                }}
              </span>
            </div>
            <MoreParameterPopover :parameter="row.matchedIcDatas[0]" />
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="" label="购买数量" class-name="column_result" min-width="100">
        <template #default="{ row }">
          <el-input v-model="row.quantity" placeholder="" clearable v-if="hasMatchedMaterial(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="" label="价格" class-name="column_result" min-width="100">
        <template #default="{ row }">
          <div v-if="hasMatchedMaterial(row)"></div>
        </template>
      </el-table-column>
      <el-table-column prop="" label="小计（含税）" class-name="column_result" min-width="100">
        <template #default="">
          <!-- <span v-if="hasMatchedMaterial(row)">
              ￥{{ NP.times(1.1, row.quantity) }}</span
            > -->
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" fixed="right" class-name="column_result" width="120">
        <template #default="{ row }">
          <div class="btns" v-if="bomParserStore.percentage === 100">
            <el-button type="primary" size="small" @click="changeMaterial(row)">更换物料</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <changeMaterialDiaolg v-model:visible="changeMaterialDiaolgVisible" :currentMaterial="currentMaterial" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { BomItem } from '@/types/bomParserTypes'
import MoreParameterPopover from './moreParameterPopover.vue'
import TextTooltip from '@/components/textTooltip/index.vue'
// import NP from "number-precision";
import useBomParserStore from '@/store/bomParser'
import changeMaterialDiaolg from '../changeMaterialDiaolg/index.vue'

const bomParserStore = useBomParserStore()
const tableList = ref<BomItem[]>()
const changeMaterialDiaolgVisible = ref(false)
const currentMaterial = ref<BomItem>({})

const filterTableList = (status: number) => {
  const data = bomParserStore.bomParserTableData

  switch (status) {
    case 0:
      tableList.value = data
      break
    case 1:
      tableList.value = []
      break
    case 2:
      tableList.value = data.filter((item: BomItem) => item.matchedIcDatas?.[0])
      break
    case 3:
      tableList.value = data.filter((item: BomItem) => item.matchedIcDatas?.length === 0)
      break
    case 4:
      tableList.value = data.filter((item: BomItem) => !item.matchedIcDatas)
      break
    default:
      tableList.value = []
      break
  }
}

watch(
  () => [bomParserStore.currentTabLabel, bomParserStore.percentage, bomParserStore.bomParserStatus],
  () => {
    const tabLabelToFilterMap = {
      ['全部']: 0,
      ['完全匹配']: 1,
      ['待确认']: 2,
      ['未匹配']: 3,
      ['异常']: 4
    }

    filterTableList(tabLabelToFilterMap[bomParserStore.currentTabLabel])
  },
  {
    immediate: true,
    deep: true
  }
)

const getResultTagType = (row: BomItem) => {
  const { matchedIcDatas: M } = row
  if (hasMatchedMaterial(row)) return (M as Array<{ status: number }>)[0] ? 'primary' : ''
  if (M && M.length === 0) return 'danger'
  if (!M && bomParserStore.percentage === 100) return 'warning'
  return ''
}

const getResultTagText = (row: BomItem) => {
  const { matchedIcDatas: M } = row
  if (hasMatchedMaterial(row)) return (M as Array<{ status: number }>)[0] ? '待确认' : ''
  if (M && M.length === 0) return '未匹配'
  if (!M && bomParserStore.percentage === 100) return '异常'
  return ''
}

const hasMatchedMaterial = (row: BomItem) => row.matchedIcDatas && row.matchedIcDatas.length > 0

const changeMaterial = (row: BomItem) => {
  changeMaterialDiaolgVisible.value = true
  currentMaterial.value = row
}
</script>

<style lang="scss" scoped>
.bom_parser_table {
  width: 90%;

  :deep(.column_result_first) {
    border-left: 1px dashed #cd45ef;
  }
  :deep(.column_result) {
    background-color: #ecd7f0 !important;
  }
  .product_info_item {
    display: flex;
  }
  .label {
    color: $base-label-color;
  }
  .btns {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
<style lang="scss">
.bom_parser_table {
  .el-table__row {
    height: 80px;
  }
  .el-table__row:hover {
    background-color: #ecd7f0 !important;
  }
}
</style>
