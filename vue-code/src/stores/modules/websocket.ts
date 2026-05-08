import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Subscription {
  module: string
  params?: Record<string, any>
}

interface ModuleData {
  pageInfo?: Record<string, any>
  list: any[]
}

export const useWsStore = defineStore('websocket', () => {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const subscriptions = ref<Subscription[]>([])
  const moduleData = ref<Record<string, ModuleData>>({})

  function connect() {
    if (ws.value) return
    
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws'
    ws.value = new WebSocket(wsUrl)

    ws.value.onopen = () => {
      isConnected.value = true
      console.log('[WS] Connected')
      subscriptions.value.forEach(sub => sendSubscribe(sub))
    }

    ws.value.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        console.log('[WS] Received:', message)
        handleMessage(message)
      } catch (error) {
        console.error('[WS] Parse error:', error)
      }
    }

    ws.value.onerror = (error) => {
      console.error('[WS] Error:', error)
    }

    ws.value.onclose = () => {
      isConnected.value = false
      console.log('[WS] Disconnected')
      setTimeout(connect, 3000)
    }
  }

  function sendSubscribe(sub: Subscription) {
    if (!isConnected.value) return
    ws.value?.send(JSON.stringify({
      action: 'subscribe',
      module: sub.module,
      params: sub.params || {}
    }))
  }

  function sendUnsubscribe(module: string) {
    if (!isConnected.value) return
    ws.value?.send(JSON.stringify({
      action: 'unsubscribe',
      module
    }))
  }

  function watch(payload: { module: string; params?: Record<string, any> }) {
    if (!isConnected.value) {
      connect()
    }
    
    const { module, params } = payload
    const existing = subscriptions.value.find(sub => sub.module === module)
    
    if (!existing) {
      const sub: Subscription = { module, params }
      subscriptions.value.push(sub)
      
      if (!moduleData.value[module]) {
        moduleData.value[module] = { list: [], pageInfo: params }
      }
    } else {
      // 更新已存在的订阅参数
      existing.params = params
      if (moduleData.value[module]) {
        moduleData.value[module].pageInfo = params
      }
    }
    
    // 始终发送订阅请求（支持参数更新）
    if (isConnected.value) {
      sendSubscribe({ module, params })
    }
  }

  function unwatch(payload: { module: string }, isClean?: boolean) {
    const { module } = payload
    const index = subscriptions.value.findIndex(sub => sub.module === module)
    
    if (index !== -1) {
      subscriptions.value.splice(index, 1)
      sendUnsubscribe(module)
      if (isClean) {
        delete moduleData.value[module]
      }
    }
  }

  function handleMessage(message: any) {
    const { module, list, pageInfo, data } = message
    
    if (!module || !moduleData.value[module]) return
    
    // 后端发送完整结果：{ module, list, pageInfo, total }
    if (list !== undefined) {
      moduleData.value[module].list = list
      if (pageInfo) {
        moduleData.value[module].pageInfo = pageInfo
      }
    } else if (data !== undefined) {
      // 兼容旧格式：{ module, data }
      if (Array.isArray(data)) {
        moduleData.value[module].list = data
      } else {
        moduleData.value[module].list.unshift(data)
        if (moduleData.value[module].list.length > 20) {
          moduleData.value[module].list.pop()
        }
      }
    }
  }

  return {
    isConnected,
    moduleData,
    watch,
    unwatch,
  }
})
