import { BomParserTaskResult } from '@/types/bomParserTypes'
import axios from 'axios'
import useBomParserStore from '@/store/bomParser'

const companyId = 1920

export const createBomParserTask = async (bomData: string[]): Promise<BomParserTaskResult> => {
  const bomParserStore = useBomParserStore()

  const {
    data: { code, result }
  } = await axios('https://lg877h8zh1.hzh.sealos.run/bom/parser/create-task', {
    method: 'POST',
    data: {
      bomData,
      companyId,
      chunkSize: 10,
      maxTokens: 8192,
      stream: true,
      bomName: bomParserStore.fileName
    }
  })

  return { code, result }
}

export const getBomParserTaskResult = async (bomUuid: string) => {
  const {
    data: { code, result }
  } = await axios('https://lg877h8zh1.hzh.sealos.run/bom/parser/result', {
    method: 'GET',
    params: {
      bomUuid,
      companyId
    }
  })

  return { code, result }
}
