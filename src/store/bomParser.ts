import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'
import { BomItem } from '@/types/bomParserTypes'

interface hjsCrm {
  bomId: number | undefined
  jobId: string
  status: string | undefined
  excelUrl: string
  fileName: string
  token: string // nocobase token
}

const useBomParserStore = defineStore('BomParserStore', () => {
  const itemList = ref([])
  const bomParserTableData = ref<BomItem[]>([])
  const bomParserProgressData = ref<BomItem[]>([])
  const bomParserStatus = ref('end') // not start end
  const percentage = ref(100) // 0-100 解析进度
  const fileName = ref<string | undefined>('BOM解析.xlsx')
  const bomParserUuid = ref()
  const currentTabLabel = ref('全部')
  const tableLoading = ref(false)
  const hjsCrm: hjsCrm = reactive({
    bomId: undefined,
    jobId: '',
    status: undefined,
    excelUrl: '',
    fileName: '',
    token: '' // nocobase token
  })
  const perfectMatch = ref(0) // 完全匹配
  const toBeConfirmed = ref(0) // 待确认
  const unmatch = ref(0) // 未匹配
  const abnormal = ref(0) // 异常
  const xApiKey = ref('') // 请求头x-api-key

  // 对比异常数据
  const syncBomParserData = () => {
    const materialMap = new Map(bomParserTableData.value.map((material) => [material.seq, material]))

    const items = itemList.value.slice(1)
    items.forEach((item: any) => {
      const seq = Number(item[0])
      if (!materialMap.has(seq)) {
        const newMaterial: BomItem = {
          seq: seq,
          matchStatus: 3, // 设置为未匹配状态
          original_demand: item.slice(1).join(' ')
        }

        let insertIndex = bomParserTableData.value.findIndex((material) => material.seq && material.seq > seq)
        if (insertIndex === -1) insertIndex = bomParserTableData.value.length

        bomParserTableData.value.splice(insertIndex, 0, newMaterial)
      }
    })
  }

  watch(
    () => bomParserTableData.value,
    () => {
      perfectMatch.value = toBeConfirmed.value = unmatch.value = abnormal.value = 0
      syncBomParserData() // 对比异常数据
      bomParserTableData.value.forEach((item: BomItem) => {
        // 0: 未匹配 1: 待确认 2: 完全匹配 3: 异常
        switch (item.matchStatus) {
          case 0:
            unmatch.value++
            break
          case 1:
            toBeConfirmed.value++
            break
          case 2:
            perfectMatch.value++
            break
          case 3:
            abnormal.value++
            break
        }
      })
    },
    {
      immediate: true,
      deep: true
    }
  )

  const setXApiKey = (value: string) => {
    localStorage.setItem('xApiKey', value.trim())
    xApiKey.value = value
  }

  return {
    itemList,
    bomParserTableData,
    bomParserProgressData,
    bomParserStatus,
    percentage,
    fileName,
    bomParserUuid,
    currentTabLabel,
    tableLoading,
    hjsCrm,
    unmatch,
    perfectMatch,
    toBeConfirmed,
    abnormal,
    xApiKey,
    syncBomParserData,
    setXApiKey
  }
})

export default useBomParserStore
