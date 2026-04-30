<template>
  <div class="dashboard">
    <el-row :gutter="16">
      <el-col :span="6" v-for="item in stats" :key="item.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-body">
            <el-icon :style="{ color: item.color }" class="stat-icon">
              <component :is="item.icon" />
            </el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-title">{{ item.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="24">
        <el-card shadow="never">
          <template #header>
            <span>框架说明</span>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="前端框架">Vue3 + TypeScript + Element Plus</el-descriptions-item>
            <el-descriptions-item label="后端框架">NestJS + TypeORM + class-validator</el-descriptions-item>
            <el-descriptions-item label="代码生成">XML Modal Framework</el-descriptions-item>
            <el-descriptions-item label="构建工具">Vite 5.x</el-descriptions-item>
            <el-descriptions-item label="XML定义目录">xml-modal/</el-descriptions-item>
            <el-descriptions-item label="数据库">SQLite</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Goods, Document, Setting } from '@element-plus/icons-vue'
import dashboardApi from '@/models/system/dashboard/dashboard.api'

import { DashboardModel } from '@/models/system/dashboard/generated/dashboard.model'

const dashboardSummary = reactive<DashboardModel>(new DashboardModel())

async function fetchDashboard() {
  const res = await dashboardApi.getDashboard()
  dashboardSummary.userCount.value = res.data.userCount
  dashboardSummary.productCount.value = res.data.productCount
  dashboardSummary.modelCount.value = res.data.modelCount ?? dashboardSummary.modelCount.default
  dashboardSummary.systemModuleCount.value = res.data.systemModuleCount ?? dashboardSummary.systemModuleCount.default
}

fetchDashboard()

const stats = computed(() => [
  { title: dashboardSummary.userCount.label, value: dashboardSummary.userCount.value, icon: 'User', color: '#409eff' },   
  { title: dashboardSummary.productCount.label, value: dashboardSummary.productCount.value, icon: 'Goods', color: '#67c23a' },
  { title: dashboardSummary.modelCount.label, value: dashboardSummary.modelCount.value, icon: 'Document', color: '#e6a23c' },
  { title: dashboardSummary.systemModuleCount.label, value: dashboardSummary.systemModuleCount.value, icon: 'Setting', color: '#f56c6c' },
])
</script>

<style lang="scss" scoped>
.dashboard { padding: 0; }
.stat-card {
  .stat-body {
    display: flex;
    align-items: center;
    gap: 16px;
    .stat-icon { font-size: 48px; }
    .stat-value { font-size: 28px; font-weight: bold; }
    .stat-title { color: #999; margin-top: 4px; }
  }
}
</style>
