export interface fetchResult {
  code: number
  result?: any[]
  response?: BomItem[]
  responseError?: {
    message: string
  }
}

export interface BomItem {
  id?: number
  seq?: number // 顺序
  original_demand?: string
  category_1?: string
  category_2?: string
  manufacturer?: string[]
  part_number?: string
  quantity?: number
  spec?: Spec
  matchedIcDatas?: MatchedIcItem[]
  matchStatus?: number // 0: 未匹配 1: 待确认 2: 完全匹配
}

export interface MatchedIcItem {
  idCode?: string
  status?: number
  productName?: string
  productModel?: string
  brand?: string
  code?: string
  package?: string
  quantity?: number
  price?: number
  validStockNumber?: string
  deliveryDate?: string
  md5No?: string
}

export interface Spec {
  package?: string
  value?: string
  tolerance?: string
  power?: string
  voltage?: string
}
