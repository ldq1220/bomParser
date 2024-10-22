import {
  reqCreateMaterialIdentifyJob,
  reqGetMaterialIdentifyJob,
  reqGetMaterialIdentifyResult,
} from "@/api/bomParser";
import { updateCrmData } from "@/views/hjsCrm/api/updateCrmData";
import useBomParserStore from "@/store/bomParser";
import NP from "number-precision";

const bomParserStore = useBomParserStore();

interface CreateJobBody {
  name: string | undefined;
  itemList?: string[];
  excelUrl?: string;
}

// 创建解析任务
export const createParserJob = async (hasCrm: boolean, body: CreateJobBody) => {
  bomParserStore.tableLoading = true;
  clearBomTableData();
  const res: any = await reqCreateMaterialIdentifyJob(body);
  const { jobId, itemList } = res;
  itemList.slice(1).forEach((item, index: number) => {
    bomParserStore.bomParserTableData.push({
      seq: index + 1,
      original_demand: item.join(" "),
    });
  });
  bomParserStore.bomParserStatus = "start";
  bomParserStore.hjsCrm.jobId = jobId;
  bomParserStore.tableLoading = false;
  getParserStatus(jobId, hasCrm);
};

// 获取识别非标物料的任务详情（完成状态）
export const getParserStatus = async (jobId: string, hasCrm = false) => {
  let timer;
  let finishedCntCopy = 0;
  timer = setInterval(async () => {
    try {
      const resJob = await reqGetMaterialIdentifyJob(jobId);
      const { finishedCnt, status } = resJob[0];
      if (finishedCntCopy >= finishedCnt && status !== 3) return;
      const params = new URLSearchParams({
        jobId,
        startSeq: finishedCntCopy,
      } as any);
      const resData: any = await reqGetMaterialIdentifyResult(params);

      for (let i = 0; i < resData.length; i++) {
        bomParserStore.bomParserProgressData.push(resData[i].item);
        for (let j = 0; j < bomParserStore.bomParserTableData.length; j++) {
          if (
            resData[i].item.seq === bomParserStore.bomParserTableData[j].seq
          ) {
            Object.assign(
              bomParserStore.bomParserTableData[j],
              resData[i].item
            );
          }
        }
      }

      if (status === 3) {
        // 任务完成
        bomParserStore.bomParserStatus = "end";
        bomParserStore.percentage = 100;
        clearInterval(timer);
        if (hasCrm) await updateCrmData(); // 更新crm数据
      } else {
        bomParserStore.percentage = Number(
          (
            NP.divide(
              bomParserStore.bomParserProgressData.length,
              bomParserStore.bomParserTableData.length
            ) * 100
          ).toFixed(2)
        );
      }

      finishedCntCopy = finishedCnt;
    } catch {
      // clearInterval(timer);
    }
  }, 3000);
};

// 直接通过jobId获取数据
export const getMaterialParserResult = async (jobId: string) => {
  bomParserStore.tableLoading = true;
  clearBomTableData();
  const params = new URLSearchParams({
    jobId,
    startSeq: 0,
  } as any);
  const resData: any = await reqGetMaterialIdentifyResult(params);
  bomParserStore.percentage = 100;
  for (let i = 0; i < resData.length; i++) {
    bomParserStore.bomParserTableData.push(resData[i].item);
  }
  bomParserStore.tableLoading = false;
};

// 清空数据
export const clearBomTableData = () => {
  bomParserStore.bomParserTableData = [];
  bomParserStore.bomParserProgressData = [];
  bomParserStore.percentage = 0;
};
