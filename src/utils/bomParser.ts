import { reqCreateMaterialIdentifyJob, reqGetMaterialIdentifyResult } from '@/api/bomParser'
import { updateCrmData } from '@/views/hjsCrm/api/updateCrmData'
import useBomParserStore from '@/store/bomParser'
import NP from 'number-precision'

const bomParserStore = useBomParserStore()

interface CreateJobBody {
  name: string | undefined
  itemList?: string[]
  excelUrl?: string
}

// 创建解析任务
export const createParserJob = async (hasCrm: boolean, body: CreateJobBody) => {
  bomParserStore.tableLoading = true
  bomParserStore.bomParserStatus = 'start'
  clearBomTableData()
  const { data } = await reqCreateMaterialIdentifyJob(body)

  const { jobId, itemList, headerSeq, itemCnt } = data
  itemList.slice(headerSeq + 1).forEach((item, index: number) => {
    bomParserStore.bomParserTableData.push({
      seq: index + 1,
      original_demand: item.join(' ')
    })
  })

  bomParserStore.hjsCrm.jobId = jobId
  bomParserStore.tableLoading = false
  getParserResult(jobId, itemCnt, hasCrm)
}

// 获取识别非标物料的任务详情（完成状态）
export const getParserResult = async (jobId: string, itemCnt: number, hasCrm = false) => {
  let startSeq = 0
  const timer = setInterval(async () => {
    try {
      const params = new URLSearchParams({
        jobId,
        startSeq
      } as any)
      const { data: resData } = await reqGetMaterialIdentifyResult(params)
      startSeq = resData[resData.length - 1].seq
      const bomParserProgressDataIds = bomParserStore.bomParserProgressData.map((item) => item.id)
      resData.forEach((item) => {
        if (!bomParserProgressDataIds.includes(item.id)) {
          bomParserStore.bomParserProgressData.push(item)
        }

        const matchedItem = bomParserStore.bomParserTableData.find((tableItem) => tableItem.seq === item.seq)
        if (matchedItem) {
          delete item.original_demand
          Object.assign(matchedItem, item)
        }
      })
      if (startSeq >= itemCnt) {
        // 任务完成
        bomParserStore.bomParserStatus = 'end'
        bomParserStore.percentage = 100
        clearInterval(timer)
        if (hasCrm) await updateCrmData() // 更新crm数据
      } else {
        bomParserStore.percentage = Number(
          (
            NP.divide(bomParserStore.bomParserProgressData.length, bomParserStore.bomParserTableData.length) * 100
          ).toFixed(2)
        )
      }
    } catch {
      // clearInterval(timer);
    }
  }, 3000)
}

// 直接通过jobId获取数据
export const getMaterialParserResult = async (jobId: string) => {
  try {
    bomParserStore.tableLoading = true
    clearBomTableData()
    const params = new URLSearchParams({
      jobId,
      startSeq: 0
    } as any)
    const { data } = await reqGetMaterialIdentifyResult(params)
    bomParserStore.percentage = 100
    data[0] ? (bomParserStore.fileName = data[0].name) : ''
    for (let i = 0; i < data.length; i++) {
      bomParserStore.bomParserTableData.push(data[i])
    }
  } finally {
    bomParserStore.tableLoading = false
  }
}

// 清空数据
export const clearBomTableData = () => {
  bomParserStore.bomParserTableData = []
  bomParserStore.bomParserProgressData = []
  bomParserStore.percentage = 0
}
