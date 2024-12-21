<template>
  <div class="bom_parser_container">
    <BomParserProgress
      v-show="bomParserStore.bomParserStatus !== 'not' || bomParserStore.bomParserTableData.length !== 0"
    />
    <saveButton />
  </div>
  <BomParserTabs />
  <BomParserTable />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCrmData } from './api'
import BomParserProgress from '@/components/BomParserProgress/index.vue'
import BomParserTable from '@/components/BomParserTable/index.vue'
import BomParserTabs from '@/components/BomParserTabs/index.vue'
import saveButton from './components/saveButton.vue'
import useBomParserStore from '@/store/bomParser'
import { createParserJob, getMaterialParserResult } from '@/utils/bomParser'

const bomParserStore = useBomParserStore()
const route = useRoute()
const { bomId, token, apiUrl } = route.query as any

onMounted(async () => {
  if (!bomId || !token || !apiUrl) return
  bomParserStore.externalCrm.token = token
  bomParserStore.externalCrm.apiUrl = apiUrl
  await getCrmData(bomId) // 获取crm数据
  const { excelUrl, status, fileName } = bomParserStore.externalCrm
  if (excelUrl && status === '1') {
    createParserJob(true, {
      name: fileName,
      excelUrl: excelUrl
    })
  } else {
    const jobId = bomParserStore.externalCrm.jobId || JSON.parse(localStorage.getItem('jobData') || '{}').jobId
    if (jobId) await getMaterialParserResult(jobId as string)
  }
})
/*
bomId：crm数据id   1
token: crm token
apiUrl: crm api url  如：http://192.168.11.246:13000/api/bom_list
*/
</script>

<style lang="scss" scoped>
.bom_parser_container {
  width: 90%;
  margin: 20px auto 40px;
  display: flex;
  justify-content: space-between;
}
</style>
