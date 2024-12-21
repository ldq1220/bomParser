<template>
  <div class="bom_upload">
    <el-button type="primary" size="default" @click="handleParser">上传BOM表</el-button>
    <el-button type="" size="default" @click="handleClear">清空</el-button>

    <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { read, utils } from 'xlsx'
import { useRoute, useRouter } from 'vue-router'
import useBomParserStore from '@/store/bomParser'
import { BroadcastChannel } from 'broadcast-channel'
import { createParserJob, getMaterialParserResult, clearBomTableData } from '@/utils/bomParser'

const bomParserStore = useBomParserStore()
const route = useRoute()
const router = useRouter()
const channel = new BroadcastChannel('parserJob')

onMounted(async () => {
  const jobId = route.query.jobId || JSON.parse(localStorage.getItem('jobData') || '{}').jobId
  if (jobId) await getMaterialParserResult(jobId as string)

  if (route.query.jobId && route.path !== '/externalCrm') router.replace({ path: '/' }) // 如果存在jobId，则重定向到根路径
})

const fileInput = ref()

const handleParser = async () => fileInput.value.click()

const handleFileChange = async (event: any) => {
  const file = event.target.files[0]

  if (file) {
    readFile(file)
      .then(async (fileData) => {
        bomParserStore.fileName = file.name
        bomParserStore.bomParserStatus = 'not'
        const bomData = await parseExcel(fileData)
        createParserJob(false, { name: file.name, itemList: bomData })
      })
      .catch((error) => {
        console.error('Error reading or parsing file:', error)
      })
  }
}

const readFile = (file: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event: any) => {
      resolve(event.target.result)
    }
    reader.onerror = (error) => {
      reject(error)
    }
    reader.readAsArrayBuffer(file)
  })
}

const parseExcel = (fileData: any) => {
  const excel = new Uint8Array(fileData)
  const workbook = read(excel, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const data: any = utils.sheet_to_json(sheet, {
    header: 1,
    blankrows: false // 忽略空行
  })

  // 处理合并单元格
  const merges = sheet['!merges'] || []
  merges.forEach(({ s, e }) => {
    const value = sheet[utils.encode_cell(s)].v
    for (let r = s.r; r <= e.r; r++) {
      for (let c = s.c; c <= e.c; c++) {
        if (!data[r]) data[r] = []
        if (!data[r][c]) data[r][c] = value
      }
    }
  })

  return data
}

const handleClear = () => {
  fileInput.value.value = '' // 清空文件输入的值
  bomParserStore.bomParserStatus = 'not'
  bomParserStore.fileName = ''
  localStorage.removeItem('jobData')
  channel.postMessage('parserJobStop')
  clearBomTableData()
}
</script>

<style lang="scss" scoped>
.bom_upload {
  display: flex;
}
</style>
