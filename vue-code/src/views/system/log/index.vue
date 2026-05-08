<template>
  <div>
    <CrudTable
      ref="tableRef"
      :columns="LogTableColumns"
      :search-fields="LogSearchFields"
      :data="logData"
      :show-create="false"
      :show-edit="false"
      @delete="handleDelete"
      @query="handleSearch"
    >
      <template #toolbar>
        <el-button type="success" :icon="Plus" @click="openAddDialog">添加测试数据</el-button>
      </template>
    </CrudTable>

    <CrudDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :fields="LogFormFields"
      :rules="LogFormRules"
      :initial-data="editRow"
      :cols="2"
      label-width="100px"
      width="600px"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import CrudTable from '@/components/CrudTable/index.vue'
import CrudDialog from '@/components/CrudDialog/index.vue'
import { LogTableColumns, LogSearchFields } from '@/models/system/log/generated/log.table'
import { LogFormFields, LogFormRules } from '@/models/system/log/generated/log.form'
import logApi from '@/models/system/log/log.api'
import { useWsStore } from '@/stores'

const tableRef = ref()
const dialogVisible = ref(false)
const dialogTitle = ref('添加测试日志')
const wsStore = useWsStore()
const logData = computed(() => wsStore.moduleData['system/log']?.list || [])

async function handleDelete(row: Record<string, any>) {
  await logApi.remove({ id: row.id })
  ElMessage.success('删除成功')
}

function handleSearch(params) {
  console.log(params)
  wsStore.watch({ module: 'system/log', params: {
    ...params.searchParams,
    page: params.pageInfo.page,
    pageSize: params.pageInfo.pageSize,
  } })
}

const editRow = ref<Record<string, any>>();
function openAddDialog() {
  editRow.value = {
    level: 'info',
    operator: 'admin',
  }
  dialogTitle.value = '添加测试日志'
  dialogVisible.value = true
}

async function handleSubmit(data: Record<string, any>) {
  await logApi.create(data)
  ElMessage.success('添加成功')
  dialogVisible.value = false
}

onMounted(() => {
  wsStore.watch({ module: 'system/log', params: { page: 1, pageSize: 20 } })
})

onUnmounted(() => {
  wsStore.unwatch({ module: 'system/log' })
})
</script>