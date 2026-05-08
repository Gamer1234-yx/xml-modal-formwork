<template>
  <!-- 搜索栏 -->
  <el-card v-if="searchFields?.length" class="search-card" shadow="never">
    <el-form :model="searchForm" inline @submit.prevent="handleSearch">
      <el-form-item
        v-for="field in searchFields"
        :key="field.prop"
        :label="field.label"
      >
        <el-input
          v-if="field.component === 'ElInput'"
          v-model="searchForm[field.prop]"
          :placeholder="`请输入${field.label}`"
          clearable
          style="width: 180px"
        />
        <el-select
          v-else-if="field.component === 'ElSelect'"
          v-model="searchForm[field.prop]"
          :placeholder="`请选择${field.label}`"
          clearable
          style="width: 180px"
        >
          <el-option
            v-for="opt in field.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button :icon="Refresh" @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <!-- 表格区域 -->
  <el-card shadow="never" style="margin-top: 12px">
    <!-- 工具栏 -->
    <div class="table-toolbar">
      <slot name="toolbar">
        <el-button v-if="showCreate" type="primary" :icon="Plus" @click="$emit('create')">新建</el-button>
      </slot>
      <div class="toolbar-right">
        <el-tooltip content="刷新">
          <el-button :icon="RefreshRight" circle @click="fetchData" />
        </el-tooltip>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="loading && !data"
      :data="displayData"
      border
      stripe
      row-key="id"
      style="width: 100%"
    >
      <el-table-column
        v-for="col in visibleColumns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :sortable="col.sortable ? 'custom' : false"
        :min-width="col.minWidth || 120"
        :width="col.width"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <!-- 标签渲染 -->
          <template v-if="col.tag && col.options">
            <el-tag v-if="getLabel(col.options, row[col.prop])" :type="getTagType(col.options, row[col.prop])">
              {{ getLabel(col.options, row[col.prop]) }}
            </el-tag>
          </template>
          <!-- 日期格式化 -->
          <template v-else-if="col.formatter === 'datetime'">
            {{ formatDate(row[col.prop], 'YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template v-else-if="col.formatter === 'date'">
            {{ formatDate(row[col.prop], 'YYYY-MM-DD') }}
          </template>
          <!-- 默认 -->
          <template v-else>{{ row[col.prop] }}</template>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button v-if="showEdit" type="primary" link :icon="Edit" @click="$emit('edit', row)">编辑</el-button>
          <el-popconfirm title="确定删除？" @confirm="$emit('delete', row)">
            <template #reference>
              <el-button type="danger" link :icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div v-if="!data" class="pagination-wrap">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-size-options="['10', '20', '50', '100']"
        layout="total, page-size-selector, prev, pager, next, jumper"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { Search, Refresh, Plus, RefreshRight, Edit, Delete } from '@element-plus/icons-vue'
import { formatDate, getLabel } from '@/utils'
import { ApiResponse } from '@/utils/request'
import { TableColumnConfig } from '@/models/common/types'

// 计算可见列
const visibleColumns = computed(() =>
  props.columns.filter(col => col.visible !== false)
)

// 显示数据：优先使用传入的 data，否则使用 apiFn 获取的数据
const displayData = computed(() => {
  return props.data || tableData.value
})

interface SearchField {
  prop: string
  label: string
  component: string
  options?: { value: string | number; label: string }[]
}

const props = withDefaults(defineProps<{
  columns: TableColumnConfig[]
  searchFields?: SearchField[]
  apiFn?: (params: Record<string, any>) => Promise<ApiResponse<{ list: any[]; total: number }>>
  showCreate?: boolean
  showEdit?: boolean
  data?: any[]
}>(), {
  showCreate: true,
  showEdit: true,
})

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'edit', row: any): void
  (e: 'delete', row: any): void
  (e: 'query', params: { pageInfo: Record<string, any>; searchParams: Record<string, any> }): void
}>()

// 搜索表单
const searchForm = reactive<Record<string, any>>({})
const loading = ref(false)
const tableData = ref<any[]>([])
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

async function fetchData() {
  if (props.data) return
  
  if (!props.apiFn) return
  
  loading.value = true
  try {
    const res = await props.apiFn({
      ...searchForm,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    tableData.value = res.data.list || []
    pagination.total = res.data.total || 0
  } finally {
    loading.value = false
  }
}

watch(
  () => [pagination.page, pagination.pageSize],
  () => {
    emitQuery()
    fetchData()
  },
  { immediate: false }
)

watch(
  () => props.data,
  () => {
    if (props.data) {
      pagination.total = props.data.length
    }
  },
  { immediate: true, deep: true }
)

function handleSearch() {
  pagination.page = 1
  emitQuery()
  if (!props.data) {
    fetchData()
  }
}

function handleReset() {
  Object.keys(searchForm).forEach((k) => delete searchForm[k])
  handleSearch()
}

function emitQuery() {
  const params = {
    pageInfo: { page: pagination.page, pageSize: pagination.pageSize, total: pagination.total },
    searchParams: { ...searchForm }
  }
  emit('query', params)
}

function getTagType(options: any[], value: any) {
  return options.find((o) => String(o.value) === String(value))?.type || ''
}

onMounted(fetchData)

defineExpose({ fetchData, tableData })
</script>

<style lang="scss" scoped>
.search-card { :deep(.el-card__body) { padding: 16px 16px 0; } }
.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>