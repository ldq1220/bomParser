import request from '@/utils/request'

enum API {
  MATERIAL_IDENTIFY_JOB = '/material/identify-job',
  MATERIAL_IDENTIFY_JOB_V2 = '/material/identify-job-v2',
  MATERIAL_IDENTIFY_RESULTS = '/material/identify-results'
}

// 新增一个识别非标物料的任务
export const reqCreateMaterialIdentifyJob = (data: any) => request.post(API.MATERIAL_IDENTIFY_JOB, data)

// 新增一个识别非标物料的任务V2
export const reqCreateMaterialIdentifyJobV2 = (data: any) => request.post(API.MATERIAL_IDENTIFY_JOB_V2, data)

// 获取识别非标物料的任务详情（完成状态）
export const reqGetMaterialIdentifyJob = (jobId: string) => request.get(`${API.MATERIAL_IDENTIFY_JOB}/?jobId=${jobId}`)

// 获取已识别成功的结果（物料列表）
export const reqGetMaterialIdentifyResult = (params: URLSearchParams) =>
  request.get(`${API.MATERIAL_IDENTIFY_JOB}/result/?${params}`)

// 定时检查物料识别任务进度 （未开始 ==> 进行中 ==> 已完成）
export const reqCheckMaterialIdentifyJob = () => request.post(`${API.MATERIAL_IDENTIFY_JOB}/check`)

// 获取该条物料相似的数据
export const reqGetMaterialSimilarData = (id: number | undefined) =>
  request.get(`${API.MATERIAL_IDENTIFY_RESULTS}/${id}/recommand?`)

// 更换物料
export const reqChangeMaterial = (id: number | undefined, md5No: string) =>
  request.patch(`${API.MATERIAL_IDENTIFY_RESULTS}/${id}`, { md5No })
