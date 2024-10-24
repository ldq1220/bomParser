<template>
  <div class="download_bom_btn">
    <el-button type="primary" plain size="default" @click="downloadBom">下载示例BOM表</el-button>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx'
import { utils } from 'xlsx'

const downloadBom = () => {
  // 准备数据
  const data = [
    ['序号', '物料名称', '规格型号', '品牌', '基本单位', '需求量'],
    [1, '表贴电阻', '10KΩ/1206', 'ROYALOHM/厚声', '个', '5000'],
    [2, '表贴电阻', '33R/1%/0603', 'Uniohm厚声/YAGEO国巨/muRata村田/FH风华', '个', '4000'],
    [3, '绕线电阻', 'RX21-3W-R51J(0.51R)', 'Tyohm幸亚/kayocota嘉莹兴', '个', '200'],
    [4, '直插压敏电阻', '20D391K', 'Brightking台湾君耀/RUILON瑞隆源/SURGING绍鑫', '个', '200'],
    [5, '贴片电阻', '4D03 5% 330R 1/16W', 'ROYALOHM/厚声', '个', '300'],
    [6, '表贴电容', '1nF/16V/5%(NPO)/0805', 'Samsung三星/YAGEO国巨/muRata村田/FH风华/AVX', '个', '4000'],
    [7, '表贴钽电容', '47uF/10V/A3216', 'VISHAY威世/Kyocera Avx/ PANASONIC松下/KEMET(基美)', '个', '1000'],
    [8, '表贴电感', 'TMS252012ALM-2R2MTAA', 'TDK', '个', '100'],
    [9, '表贴电阻', '0603 5% 330R 1/10W', '厚声/风华', '个', '100'],
    [10, '表贴电感', 'CSAB0420-6R8M', '科达嘉', '个', '200']
  ]

  const workbook = utils.book_new()
  const worksheet = utils.aoa_to_sheet(data)

  // 计算每一列的最大宽度 如果包含中文，则宽度为：文本长度2.5，否则为：文本长度1.5
  const colWidths = data[0].map((col: any, i) => {
    return data.reduce((max, row) => {
      const cell = row[i] !== undefined ? String(row[i]) : ''
      const isChinese = /[\u4e00-\u9fa5]/.test(cell)
      const cellWidth = cell.length * (isChinese ? 2.5 : 1.5)
      return Math.max(max, cellWidth)
    }, col.length * 1.5)
  })

  // 设置列宽
  worksheet['!cols'] = colWidths.map((width) => ({ wch: width }))
  utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  // 生成Excel文件并下载
  XLSX.writeFile(workbook, 'BOM模版.xlsx')
}
</script>

<style lang="scss" scoped>
.download_bom_btn {
  flex: 1;
  display: flex;
  justify-content: center;
}
</style>
