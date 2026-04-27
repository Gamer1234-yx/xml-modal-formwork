<template>
  <div>
    <CrudTable
      ref="tableRef"
      :columns="userTableColumns"
      :search-fields="userSearchFields"
      :api-fn="fetchList"
      @create="openDialog()"
      @edit="openDialog($event)"
      @delete="handleDelete"
    />

    <CrudDialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :fields="userFormFields"
      :rules="userFormRules"
      :initial-data="editRow"
      :cols="2"
      label-width="100px"
      width="680px"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import CrudTable from '@/components/CrudTable/index.vue'
import CrudDialog from '@/components/CrudDialog/index.vue'
import { userTableColumns, userSearchFields } from '@/models/system/user/user.table'
import { userFormFields, userFormRules } from '@/models/system/user/user.form'
import userApi from '@/models/system/user/user.api'

const tableRef = ref()
const dialogVisible = ref(false)
const dialogTitle = ref('新建用户')
const editRow = ref<Record<string, any>>({})

async function fetchList(params: Record<string, any>) {
  return userApi.list(params)
}

function openDialog(row?: Record<string, any>) {
  editRow.value = row ? { ...row } : {}
  dialogTitle.value = row ? '编辑用户' : '新建用户'
  dialogVisible.value = true
}

async function handleSubmit(data: Record<string, any>) {
  if (data.id) {
    await userApi.update(data.id, data)
    ElMessage.success('更新成功')
  } else {
    await userApi.create(data)
    ElMessage.success('创建成功')
  }
  dialogVisible.value = false
  tableRef.value?.fetchData()
}

async function handleDelete(row: Record<string, any>) {
  await userApi.remove(row.id)
  ElMessage.success('删除成功')
  tableRef.value?.fetchData()
}
</script>
