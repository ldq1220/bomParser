<template>
    <div class="bom_parser_btns">
        <BomUpload v-if="hasInit" />
        <DownloadBom />
        <BomParserProgress v-show="bomParserStore.bomParserStatus !== 'not' || bomParserStore.bomParserTableData.length !== 0" />
    </div>

    <BomParserTabs />
    <BomParserTable />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { initialBomData } from '@/constant/initialBomData'
import BomUpload from './components/bomUpload.vue'
import DownloadBom from './components/downloadBom.vue'
import BomParserProgress from '@/components/BomParserProgress/index.vue'
import BomParserTable from '@/components/BomParserTable/index.vue'
import BomParserTabs from '@/components/BomParserTabs/index.vue'
import useBomParserStore from '@/store/bomParser'

const bomParserStore = useBomParserStore()
const hasInit = ref(false)

onMounted(() => {
    hasInit.value = true
    initialBomData.forEach((item) => {
        bomParserStore.bomParserTableData.push(item)
    })
})
</script>

<style lang="scss" scoped>
.bom_parser_btns {
    width: 90%;
    margin: 40px auto;
    display: flex;
    justify-content: space-between;
}
</style>
