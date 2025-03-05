<template>
  <div class="bom_parser_btns">
    <div class="v2_material_input">
      <el-input v-model="materialsValue" type="textarea" :rows="8" placeholder="输入物料" />
      <el-button type="primary" size="large" @click="handleParserMaterial">一键解析</el-button>
    </div>

    <BomParserProgress
      v-show="bomParserStore.bomParserStatus !== 'not' || bomParserStore.bomParserTableData.length !== 0"
    />
    <OperationGroup />
  </div>

  <BomParserTabs />
  <BomParserTable />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BomParserProgress from '@/components/BomParserProgress/index.vue'
import BomParserTable from '@/components/BomParserTable/index.vue'
import BomParserTabs from '@/components/BomParserTabs/index.vue'
import OperationGroup from '@/components/OperationGroup/index.vue'
import useBomParserStore from '@/store/bomParser'
import { createParserJob, getMaterialParserResult } from '@/utils/bomParser'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const materialsValue = ref()
const bomParserStore = useBomParserStore()

onMounted(async () => {
  const jobId = route.query.jobId || JSON.parse(localStorage.getItem('jobData') || '{}').jobId
  if (jobId) await getMaterialParserResult(jobId as string)

  if (route.query.jobId && route.path !== '/externalCrm') router.replace({ path: '/v2' }) // 如果存在jobId，则重定v2
})

const handleParserMaterial = async () => {
  const materialItemList = materialsValue.value
    .split('\n')
    .filter(Boolean)
    .map((item) => [item])

  await createParserJob(false, 'v2', { name: 'v2', itemList: materialItemList })
}
</script>

<style lang="scss" scoped>
.bom_parser_btns {
  width: 90%;
  margin: 40px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.v2_material_input {
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  gap: 20px;
}
</style>
