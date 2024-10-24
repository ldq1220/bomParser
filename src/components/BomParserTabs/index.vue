<template>
  <div class="bom_parser_tabs margin_auto">
    <ul>
      <li
        v-for="item in parserResultTabs"
        :key="item.label"
        :class="item.active ? 'active' : ''"
        @click="changeTab(item)"
        v-show="item.label != '异常' || bomParserStore.percentage === 100"
      >
        <span>{{ item.label }}</span>
        <span class="number">{{ item.number }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import useBomParserStore from '@/store/bomParser'

const bomParserStore = useBomParserStore()

interface ParserResultTabs {
  label: string
  number: number | any
  active?: boolean
}

const parserResultTabs = ref<ParserResultTabs[]>([
  {
    label: '全部',
    number: computed(() => bomParserStore.bomParserTableData.length),
    active: true
  },
  {
    label: '完全匹配',
    number: computed(() => bomParserStore.status1),
    active: false
  },
  {
    label: '待确认',
    number: computed(() => bomParserStore.status2),
    active: false
  },
  {
    label: '未匹配',
    number: computed(() => bomParserStore.status3),
    active: false
  },
  {
    label: '异常',
    number: computed(() => bomParserStore.status4),
    active: false
  }
])

const changeTab = (currentTab: ParserResultTabs) => {
  const { label } = currentTab
  bomParserStore.currentTabLabel = label
  parserResultTabs.value.forEach((item) => (item.active = item.label === label))
}
</script>

<style lang="scss" scoped>
.bom_parser_tabs {
  width: 90%;
  ul {
    display: flex;
    padding: 0;
    margin: 0;
    li {
      margin-right: 10px;
      padding: 10px 20px;
      cursor: pointer;
      list-style: none;
      border-bottom: 2px solid transparent;
      .number {
        margin-left: 5px;
        color: $base-theme-color;
      }
    }
    li:hover {
      color: $base-theme-color;
    }
  }
  li.active {
    font-weight: bold;
    color: $base-theme-color;
    border-bottom: 2px solid $base-theme-color;
  }
}
</style>
