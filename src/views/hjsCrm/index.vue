<template>
    <div class="bom_parser_container">
        <!-- <el-button type="primary" @click="createParserJob">触发查</el-button> -->
        <BomParserProgress v-show="bomParserStore.bomParserStatus !== 'not' || bomParserStore.bomParserTableData.length !== 0" />
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
const { bomId, token } = route.query as any

onMounted(async () => {
    if (!bomId || !token) return

    bomParserStore.hjsCrm.token = token
    await getCrmData(bomId) // 获取crm数据
    const { excelUrl, jobId, status, fileName } = bomParserStore.hjsCrm
    if (excelUrl && status === '1') {
        createParserJob(true, {
            name: fileName,
            excelUrl: excelUrl,
        })
    } else if (jobId) {
        getMaterialParserResult(jobId)
    }
})
/*
bomId：crm数据id   1
token: crm token
*/

/** http://192.168.11.246:5188/hjsCrm?bomId=2&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcyOTAzOTQ4NSwiZXhwIjoxNzI5NjQ0Mjg1fQ.S48KWMOlJfq91S8eLu-L33i3NYrzRMb88ELp97NjWUQ */
</script>

<style lang="scss" scoped>
.bom_parser_container {
    width: 90%;
    margin: 20px auto 40px;
    display: flex;
    justify-content: space-between;
}
</style>
