import axios from 'axios'
import useBomParserStore from '@/store/bomParser'

const bomParserStore = useBomParserStore()

export type dataProps = {
  job_id?: string
  bom_status?: string | undefined
}

export const updateCrmData = async () => {
  const { bomId, jobId, status, token } = bomParserStore.hjsCrm

  const body: dataProps = {
    bom_status: status === '1' ? '2' : status,
    job_id: jobId
  }
  try {
    const baseUrl = import.meta.env.VITE_NOCOURL
    const res = await axios({
      url: `${baseUrl}/bom_list:update?filterByTk=${bomId}`,
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`
      },
      data: body
    })
    return res.data
  } catch (error) {
    console.log(error)
    return error
  }
}
