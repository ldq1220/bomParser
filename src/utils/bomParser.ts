import { reqCreateMaterialIdentifyJob, reqGetMaterialIdentifyResult, reqGetMaterialIdentifyJob } from '@/api/bomParser'
import { updateCrmData } from '@/views/hjsCrm/api/updateCrmData'
import { BroadcastChannel } from 'broadcast-channel'
import useBomParserStore from '@/store/bomParser'
import NP from 'number-precision'

const bomParserStore = useBomParserStore()
const channel = new BroadcastChannel('parserJob')
let parserResultTimer: any = null

channel.onmessage = (msg) => {
  if (msg === 'parserJobStop' && parserResultTimer) {
    clearInterval(parserResultTimer)
  }
}

interface CreateJobBody {
  name: string | undefined
  itemList?: string[]
  excelUrl?: string
}

// 创建解析任务
export const createParserJob = async (hasCrm: boolean, body: CreateJobBody) => {
  try {
    bomParserStore.tableLoading = true
    const { result } = await reqCreateMaterialIdentifyJob(body)
    const { jobId, itemList, headerSeq, itemCnt } = result
    bomParserStore.bomParserStatus = 'start'
    localStorage.setItem('jobData', JSON.stringify({ jobId, itemList, headerSeq, itemCnt }))
    bomParserStore.hjsCrm.jobId = jobId
    if (hasCrm) await updateCrmData() // 更新crm数据
    getMaterialParserResult(jobId)
  } finally {
    bomParserStore.tableLoading = false
  }
}

// 获取识别非标物料的任务详情（完成状态）
export const getParserResult = async (jobId: string, itemCnt: number) => {
  let startSeq = 0
  parserResultTimer = setInterval(async () => {
    try {
      const params = new URLSearchParams({
        jobId,
        startSeq
      } as any)
      const { result: resData } = await reqGetMaterialIdentifyResult(params)
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
        clearInterval(parserResultTimer)
      } else {
        bomParserStore.percentage = Number(
          (
            NP.divide(bomParserStore.bomParserProgressData.length, bomParserStore.bomParserTableData.length) * 100
          ).toFixed(2)
        )
      }
    } catch {
      // clearInterval(parserResultTimer);
    }
  }, 3000)
}

// 直接通过jobId 获取状态 判断状态 是进行中还是结束
export const getMaterialParserResult = async (jobId: string) => {
  try {
    await clearBomTableData()
    bomParserStore.tableLoading = true
    const {
      result: {
        name,
        status,
        jobId: resultJobId,
        itemList: resultItemList,
        headerSeq: resultHeaderSeq,
        itemCnt: resultItemCnt
      }
    } = await reqGetMaterialIdentifyJob(jobId)
    localStorage.removeItem('jobData')
    localStorage.setItem(
      'jobData',
      JSON.stringify({ jobId, itemList: resultItemList, headerSeq: resultHeaderSeq, itemCnt: resultItemCnt })
    )
    bomParserStore.fileName = name

    if (status === 3) {
      const params = new URLSearchParams({
        jobId,
        startSeq: 0
      } as any)
      const { result: resData } = await reqGetMaterialIdentifyResult(params)
      bomParserStore.percentage = 100
      for (let i = 0; i < resData.length; i++) {
        bomParserStore.bomParserTableData.push(resData[i])
      }
    } else {
      bomParserStore.bomParserStatus = 'start'
      localStorage.setItem(
        'jobData',
        JSON.stringify({
          jobId: resultJobId,
          itemList: resultItemList,
          headerSeq: resultHeaderSeq,
          itemCnt: resultItemCnt
        })
      )
      const { jobId, itemList, headerSeq, itemCnt } = JSON.parse(localStorage.getItem('jobData') || '{}')
      itemList.slice(headerSeq + 1).forEach((item: any[], index: number) => {
        bomParserStore.bomParserTableData.push({
          seq: index + 1,
          original_demand: item.join(' ')
        })
      })
      getParserResult(jobId, itemCnt)
    }
  } finally {
    bomParserStore.tableLoading = false
  }
}

// 清空数据
export const clearBomTableData = async () => {
  bomParserStore.bomParserTableData = []
  bomParserStore.bomParserProgressData = []
  bomParserStore.percentage = 0
}
