export interface fetchResult {
  code: number;
  result?: any[];
  response?: BomItem[];
  responseError?: {
    message: string;
  };
}

export interface BomItem {
  id?: number;
  seq?: number; // 顺序
  original_demand?: string;
  category_1?: string;
  category_2?: string;
  manufacturer?: string[];
  part_number?: string;
  quantity?: number;
  specification?: any;
  matchedIcDatas?: MatchedIcItem[];
}

export interface MatchedIcItem {
  status?: number;
  productName?: string;
  productModel?: string;
  brand?: string;
  code?: string;
  package?: string;
  quantity?: number;
  price?: number;
  validStockNumber?: string;
  deliveryDate?: string;
}

export interface BomParserTaskResult {
  code: number;
  result: {
    bomUuid: string;
    bomName: string;
    bomItemList: BomItem[];
  };
}
