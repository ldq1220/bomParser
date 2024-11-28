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
                  // `${row.spec.value ?? ''} ${row.spec.tolerance ?? ''} ${row.spec.power ?? ''} ${row.spec.voltage ?? ''}`
                  specValues(row.spec)
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
        <template #default=""></template>
      </el-table-column>
      <el-table-column prop="" label="操作" fixed="right" class-name="column_result" width="120">
        <template #default="{ row }">
          <div class="btns" v-if="bomParserStore.percentage === 100">
            <el-button type="primary" size="small" @click="changeMaterial(row)" v-if="row.matchedIcDatas?.[0]?.idCode">
              更换物料
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <ChangeMaterialDiaolg
      v-model:visible="changeMaterialDiaolgVisible"
      :currentMaterial="currentMaterial"
      @handleChangeMaterial="handleChangeMaterial"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { BomItem } from '@/types/bomParserTypes'
import MoreParameterPopover from './moreParameterPopover.vue'
import TextTooltip from '@/components/TextTooltip/index.vue'
import useBomParserStore from '@/store/bomParser'
import ChangeMaterialDiaolg from '../ChangeMaterialDiaolg/index.vue'
import { specValues } from '@/utils'

const bomParserStore = useBomParserStore()
const tableList = ref<BomItem[]>()
const changeMaterialDiaolgVisible = ref(false)
const currentMaterial = ref<BomItem>({})

const filterTableList = (status: string) => {
  const data = bomParserStore.bomParserTableData

  switch (status) {
    case 'all':
      tableList.value = data
      break
    case 'perfectMatch': // 完全匹配
      tableList.value = data.filter((item: BomItem) => item.matchStatus === 2)
      break
    case 'toBeConfirmed': // 待确认
      tableList.value = data.filter((item: BomItem) => item.matchStatus === 1)
      break
    case 'unmatch': // 未匹配
      tableList.value = data.filter((item: BomItem) => item.matchStatus === 0)
      break
    case 'abnormal':
      tableList.value = data.filter((item: BomItem) => item.matchStatus === 3)
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
      ['全部']: 'all',
      ['完全匹配']: 'perfectMatch',
      ['待确认']: 'toBeConfirmed',
      ['未匹配']: 'unmatch',
      ['异常']: 'abnormal'
    }

    filterTableList(tabLabelToFilterMap[bomParserStore.currentTabLabel])
  },
  {
    immediate: true,
    deep: true
  }
)

const getResultTagType = (row: BomItem) => {
  const { matchStatus } = row
  switch (matchStatus) {
    case 0:
      return 'warning'
    case 1:
      return 'primary'
    case 2:
      return 'success'
    case 3:
      return 'danger'
  }
}

const getResultTagText = (row: BomItem) => {
  const { matchStatus } = row
  switch (matchStatus) {
    case 0:
      return '未匹配'
    case 1:
      return '待确认'
    case 2:
      return '完全匹配'
    case 3:
      return '异常'
  }
}

const hasMatchedMaterial = (row: BomItem) => row.matchedIcDatas?.[0]?.idCode

const changeMaterial = (row: BomItem) => {
  changeMaterialDiaolgVisible.value = true
  currentMaterial.value = row
}

// 前端处理更换物料
const handleChangeMaterial = async (id: number, materialInfo: any) => {
  const currentChangeMaterial = tableList.value?.find((item) => item.id === id)
  if (currentChangeMaterial) currentChangeMaterial.matchedIcDatas = [materialInfo]
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
