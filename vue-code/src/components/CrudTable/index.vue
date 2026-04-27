<template>
  <!-- 搜索栏 -->
  <el-card v-if="searchFields.length" class="search-card" shadow="never">
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
        <el-button type="primary" :icon="Plus" @click="$emit('create')">新建</el-button>
      </slot>
      <div class="toolbar-right">
        <el-tooltip content="刷新">
          <el-button :icon="RefreshRight" circle @click="fetchData" />
        </el-tooltip>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      row-key="id"
      style="width: 100%"
    >
      <el-table-column
        v-for="col in columns"
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
            <el-tag :type="getTagType(col.options, row[col.prop])">
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
          <el-button type="primary" link :icon="Edit" @click="$emit('edit', row)">编辑</el-button>
          <el-popconfirm title="确定删除？" @confirm="$emit('delete', row)">
            <template #reference>
              <el-button type="danger" link :icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-wrap">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh, Plus, RefreshRight, Edit, Delete } from '@element-plus/icons-vue'
import { formatDate, getLabel } from '@/utils'

interface Column {
  prop: string
  label: string
  sortable?: boolean
  width?: number | string
  minWidth?: number | string
  formatter?: string
  tag?: boolean
  options?: { value: string | number; label: string; type?: string }[]
}

interface SearchField {
  prop: string
  label: string
  component: string
  options?: { value: string | number; label: string }[]
}

const props = defineProps<{
  columns: Column[]
  searchFields?: SearchField[]
  apiFn: (params: Record<string, any>) => Promise<{ list: any[]; total: number }>
}>()

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'edit', row: any): void
  (e: 'delete', row: any): void
}>()

// 搜索表单
const searchForm = reactive<Record<string, any>>({})
const loading = ref(false)
const tableData = ref<any[]>([])
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

async function fetchData() {
  loading.value = true
  try {
    const res = await props.apiFn({
      ...searchForm,
      page: pagination.page,
      pageSize: pagination.pageSize,
    })
    tableData.value = res.list
    pagination.total = res.total
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  fetchData()
}

function handleReset() {
  Object.keys(searchForm).forEach((k) => delete searchForm[k])
  handleSearch()
}

function getTagType(options: any[], value: any) {
  return options.find((o) => String(o.value) === String(value))?.type || ''
}

onMounted(fetchData)

defineExpose({ fetchData })
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
