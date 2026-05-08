export interface UserInfo {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  status: number
  createdAt?: string
  updatedAt?: string
}

export interface AppState {
  sidebarCollapse: boolean
  theme: 'light' | 'dark'
  breadcrumbs: Array<{ path: string; title: string }>
}