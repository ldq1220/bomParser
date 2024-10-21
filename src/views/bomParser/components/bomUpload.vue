<template>
  <div class="bom_upload">
    <el-button type="primary" size="default" @click="handleParser"
      >上传BOM表</el-button
    >
    <el-button type="" size="default" @click="handleClear">清空</el-button>

    <input
      type="file"
      ref="fileInput"
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { read, utils } from "xlsx";
import {
  reqCreateMaterialIdentifyJob,
  reqGetMaterialIdentifyJob,
  reqGetMaterialIdentifyResult,
} from "@/api/bomParser";
import { useRoute } from "vue-router";
import NP from "number-precision";
import useBomParserStore from "@/store/bomParser";

const bomParserStore = useBomParserStore();
const route = useRoute();

onMounted(() => {
  const { jobId } = route.query;
  if (jobId) getMaterialParserResult(jobId as string);
});

const fileInput = ref();
const controller: any = ref(null);
const tableLoading = defineModel("tableLoading", {
  default: false,
  type: Boolean,
});

const handleParser = async () => {
  fileInput.value.click();
};

const handleFileChange = async (event: any) => {
  const file = event.target.files[0];

  if (file) {
    readFile(file)
      .then(async (fileData) => {
        bomParserStore.fileName = file.name;
        bomParserStore.bomParserStatus = "not";
        const bomData = await parseExcel(fileData);

        createParserJob(bomData, file.name);
      })
      .catch((error) => {
        console.error("Error reading or parsing file:", error);
      });
  }
};

const readFile = (file: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};

const parseExcel = (fileData: any) => {
  const excel = new Uint8Array(fileData);
  const workbook = read(excel, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data: any = utils.sheet_to_json(sheet, {
    header: 1,
    blankrows: false, // 忽略空行
  });

  // 处理合并单元格
  const merges = sheet["!merges"] || [];
  merges.forEach(({ s, e }) => {
    const value = sheet[utils.encode_cell(s)].v;
    for (let r = s.r; r <= e.r; r++) {
      for (let c = s.c; c <= e.c; c++) {
        if (!data[r]) data[r] = [];
        if (!data[r][c]) data[r][c] = value;
      }
    }
  });

  return data;
};

const createParserJob = async (bomData: string[], fileName: string) => {
  tableLoading.value = true;
  bomParserStore.bomParserStatus = "start";
  handleBomTableData();
  const res: any = await reqCreateMaterialIdentifyJob({
    itemList: bomData,
    name: fileName,
  });
  const { jobId, itemList } = res;
  itemList.slice(1).forEach((item, index: number) => {
    bomParserStore.bomParserTableData.push({
      seq: index + 1,
      original_demand: item.join(" "),
    });
  });

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
      const { finishedCnt, status, itemCnt } = resJob[0];
      if (finishedCntCopy >= finishedCnt) return;
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

      if (status === 3 || finishedCnt >= itemCnt) {
        // 任务完成
        bomParserStore.bomParserStatus = "end";
        bomParserStore.percentage = 100;
        clearInterval(timer);
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

// 直接通知jobID获取数据
const getMaterialParserResult = async (jobId: string) => {
  tableLoading.value = true;
  handleBomTableData();

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

const handleClear = () => {
  fileInput.value.value = ""; // 清空文件输入的值
  bomParserStore.bomParserStatus = "not";
  bomParserStore.fileName = "";
  handleBomTableData();
  if (controller.value) {
    controller.value.abort(); // 终止fetch请求
  }
  nextTick(() => {
    controller.value = null;
  });
};

// 清空数据
const handleBomTableData = () => {
  bomParserStore.bomParserTableData = [];
  bomParserStore.bomParserProgressData = [];
  bomParserStore.percentage = 0;
};
</script>

<style lang="scss" scoped>
.bom_upload {
  display: flex;
}
</style>
