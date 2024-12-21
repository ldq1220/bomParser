import axios from 'axios'
import { getFileName } from '@/utils/index'
import useBomParserStore from '@/store/bomParser'

const bomParserStore = useBomParserStore()

export const getCrmData = async (filterByTk: string) => {
  const { token, apiUrl } = bomParserStore.externalCrm

  try {
    const res = await axios({
      url: `${apiUrl}:get?filterByTk=${filterByTk}`,
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`
      }
    })

    const { id, file_url, bom_status, job_id } = res.data.data
    bomParserStore.fileName = getFileName(file_url as string)
    Object.assign(bomParserStore.externalCrm, {
      bomId: id,
      excelUrl: file_url,
      jobId: job_id,
      status: bom_status,
      fileName: getFileName(file_url as string)
    })
    return res.data.data
  } catch (error) {
    console.log(error)
    return error
  }
}
