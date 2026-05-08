import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AppState } from '../types'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapse = ref(false)
  const theme = ref<'light' | 'dark'>('light')
  const breadcrumbs = ref<Array<{ path: string; title: string }>>([])

  function toggleSidebar() {
    sidebarCollapse.value = !sidebarCollapse.value
  }

  function setSidebarCollapse(collapse: boolean) {
    sidebarCollapse.value = collapse
  }

  function setTheme(newTheme: 'light' | 'dark') {
    theme.value = newTheme
  }

  function setBreadcrumbs(crumbs: Array<{ path: string; title: string }>) {
    breadcrumbs.value = crumbs
  }

  return {
    sidebarCollapse,
    theme,
    breadcrumbs,
    toggleSidebar,
    setSidebarCollapse,
    setTheme,
    setBreadcrumbs,
  }
})