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
  // const bomParserTableData = ref<BomItem[]>(initialBomData);
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
  const status1 = ref(0) // 完全匹配
  const status2 = ref(0) // 部分匹配
  const status3 = ref(0) // 未匹配
  const status4 = ref(0) // 异常

  watch(
    () => bomParserTableData.value,
    () => {
      status1.value = status2.value = status3.value = status4.value = 0

      bomParserTableData.value.forEach((item: BomItem) => {
        if (item.matchedIcDatas) {
          const length = item.matchedIcDatas?.length
          length > 0 ? status2.value++ : status3.value++
          // switch (length > 0) {
          //   case 3:
          //   case undefined:
          //     status3.value++;
          //     break;
          //   case 1:
          //     status1.value++;
          //     break;
          //   case 2:
          //     status2.value++;
          //     break;
          //   default:
          //     break;
          // }
        } else if (!item.matchedIcDatas && percentage.value === 100) {
          status4.value++
        }
      })
    },
    {
      immediate: true,
      deep: true
    }
  )

  return {
    bomParserTableData,
    bomParserProgressData,
    bomParserStatus,
    percentage,
    fileName,
    bomParserUuid,
    currentTabLabel,
    tableLoading,
    hjsCrm,
    status3,
    status1,
    status2,
    status4
  }
})

export default useBomParserStore
