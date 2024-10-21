<template>
  <div class="bom_parser_container">
    <!-- <el-button type="primary" @click="createParserJob">触发查</el-button> -->
    <BomParserProgress
      v-show="
        bomParserStore.bomParserStatus !== 'not' ||
        bomParserStore.bomParserTableData.length !== 0
      "
    />
    <saveButton />
  </div>
  <BomParserTabs />
  <BomParserTable v-loading="tableLoading" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  reqCreateMaterialIdentifyJob,
  reqGetMaterialIdentifyJob,
  reqGetMaterialIdentifyResult,
} from "@/api/bomParser";
import { updateCrmData } from "./api";
import { getCrmData } from "./api";
import NP from "number-precision";
import BomParserProgress from "@/components/BomParserProgress/index.vue";
import BomParserTable from "@/components/BomParserTable/index.vue";
import BomParserTabs from "@/components/BomParserTabs/index.vue";
import saveButton from "./components/saveButton.vue";
import useBomParserStore from "@/store/bomParser";

const bomParserStore = useBomParserStore();
const route = useRoute();
const { bomId, token } = route.query as any;
const tableLoading = ref(false);

onMounted(async () => {
  if (!bomId || !token) return;

  bomParserStore.hjsCrm.token = token;
  await getCrmData(bomId); // 获取crm数据
  const { excelUrl, jobId, status } = bomParserStore.hjsCrm;
  if (excelUrl && status === "1") {
    createParserJob();
  } else if (jobId) {
    getMaterialParserResult();
  }
});

// 新增一个识别非标物料的任务
const createParserJob = async () => {
  tableLoading.value = true;
  const { excelUrl, fileName } = bomParserStore.hjsCrm;
  const res: any = await reqCreateMaterialIdentifyJob({
    excelUrl: excelUrl,
    name: fileName,
  });

  const { jobId, itemList } = res;
  itemList.slice(1).forEach((item, index: number) => {
    bomParserStore.bomParserTableData.push({
      seq: index + 1,
      original_demand: item.join(" "),
    });
  });
  bomParserStore.bomParserProgressData = [];
  bomParserStore.bomParserStatus = "start";
  bomParserStore.percentage = 0;
  bomParserStore.hjsCrm.jobId = jobId;
  tableLoading.value = false;
  getParserStatus(jobId);
};

// 获取识别非标物料的任务详情（完成状态）
const getParserStatus = async (jobId: string) => {
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
        await updateCrmData(); // 更新crm数据
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

// 如果已经查询过这个url，则不再查询 直接获取数据
const getMaterialParserResult = async () => {
  tableLoading.value = true;
  const { jobId } = bomParserStore.hjsCrm;
  bomParserStore.bomParserTableData = [];
  const params = new URLSearchParams({
    jobId,
    startSeq: 0,
  } as any);
  const resData: any = await reqGetMaterialIdentifyResult(params);
  bomParserStore.percentage = 100;
  for (let i = 0; i < resData.length; i++) {
    bomParserStore.bomParserTableData.push(resData[i].item);
  }
  tableLoading.value = false;
};

/*
bomId：crm数据id   1
token: crm token
*/

/** http://192.168.11.246:5188/hjsCrm?bomId=2&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcyOTAzOTQ4NSwiZXhwIjoxNzI5NjQ0Mjg1fQ.S48KWMOlJfq91S8eLu-L33i3NYrzRMb88ELp97NjWUQ */
</script>

<style lang="scss" scoped>
.bom_parser_container {
  width: 90%;
  margin: 20px auto 40px;
  display: flex;
  justify-content: space-between;
}
</style>
