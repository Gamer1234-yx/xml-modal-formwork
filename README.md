# XML Modal Framework

> **XML驱动的全栈业务模型代码生成框架**
> 一次定义，同时生成 Vue3 前端模型 + NestJS 后端模型 + WebSocket 实时通信

***

## 目录结构

```
xml-modal-formwork/
├── xml-modal/               # 📝 XML 模型定义文件（你在这里写定义）
│   ├── user.xml             # 用户模块示例
│   ├── product.xml          # 商品模块示例
│   └── dashboard.xml        # 仪表盘模块示例（无数据库实体）
│
├── modal-gen-control/       # ⚙️ 代码生成器核心
│   ├── src/
│   │   ├── parser/
│   │   │   └── XmlParser.js          # 解析 XML → ModalSchema
│   │   ├── generators/
│   │   │   ├── VueCodeGenerator.js   # 生成 Vue3 前端代码
│   │   │   └── NestCodeGenerator.js  # 生成 NestJS 后端代码
│   │   ├── utils/
│   │   │   ├── typeMapper.js         # 类型映射（XML→TS/DB）
│   │   │   └── fileWriter.js         # 文件写入工具
│   │   ├── index.js                  # 核心控制器
│   │   └── cli.js                    # CLI 入口
│   └── package.json
│
├── vue-code/                # 🖥️ Vue3 前端项目（生成产物在 src/models/）
│   └── src/
│       ├── models/
│       │   ├── common/               # 公共类型定义（自动生成）
│       │   │   └── types.ts          # FieldConfig, QueryParams 等
│       │   ├── system/log/           ← log.xml 生成
│       │   │   ├── generated/        # 自动生成目录（每次覆盖）
│       │   │   └── log.api.ts        # 用户自定义 API
│       │   └── shop/product/         ← product.xml 生成
│       │       ├── generated/
│       │       └── product.api.ts
│       ├── stores/
│       │   └── modules/
│       │       └── websocket.ts      # WebSocket 状态管理
│       ├── views/
│       │   ├── system/log/           # 日志页面（WS 示例）
│       │   └── shop/product/         # 商品页面（WS 示例）
│       └── components/
│           └── CrudTable/            # CRUD 表格组件
│
└── nest-code/               # 🔧 NestJS 后端项目（生成产物在 src/）
    └── src/
        ├── common/
        │   └── ws/                    # WebSocket 模块
        │       ├── ws.module.ts
        │       ├── ws.service.ts      # WS 服务核心
        │       ├── ws.gateway.ts      # WS 网关
        │       └── ws-entity.service.ts  # WS 辅助类
        ├── system/log/                ← log.xml 生成
        │   ├── generated/
        │   └── log.service.ts         # 用户自定义 Service（WS 集成）
        └── shop/product/              ← product.xml 生成
            ├── generated/
            └── product.service.ts     # 用户自定义 Service（WS 集成）
```

***

## 快速开始

### 1. 安装依赖

```bash
cd modal-gen-control
npm install

# 前端依赖
cd ../vue-code
npm install

# 后端依赖
cd ../nest-code
npm install
```

### 2. 编写 XML 模型定义

在 `xml-modal/` 目录下新建 XML 文件，例如 `order.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<modal name="Order" label="订单" module="trade">
  <description>订单管理模块</description>

  <fields>
    <field name="id" label="ID" type="number" primary="true" visible="false">
      <validation required="false" />
    </field>

    <field name="orderNo" label="订单号" type="string" visible="true" searchable="true">
      <validation required="true" minLength="8" maxLength="32" />
    </field>

    <field name="amount" label="金额" type="number" visible="true">
      <validation required="true" min="0" message="金额不能为负数" />
    </field>

    <field name="status" label="状态" type="select" visible="true">
      <options>
        <option value="0" label="待支付" />
        <option value="1" label="已支付" />
        <option value="2" label="已取消" />
      </options>
      <validation required="true" default="0" />
    </field>

    <field name="createdAt" label="创建时间" type="datetime" visible="true" readonly="true">
      <validation required="false" />
    </field>
  </fields>

  <table pagination="true" pageSize="20" sortable="true" />
  <form layout="grid" cols="2" labelWidth="100px" />

  <api prefix="/api/trade/order">
    <type name="ListQuery">
      <param name="page" type="number" default="1" />
      <param name="pageSize" type="number" default="20" />
      <param name="orderNo" type="string" />
    </type>

    <endpoint action="findAll" method="POST" path="/list" description="查询列表">
      <param name="query" type="ListQuery" required="true" />
      <returns>
        <field name="list" type="modelName[]" />
        <field name="total" type="number" />
      </returns>
    </endpoint>

    <endpoint action="create" method="POST" path="/create" description="新建">
      <param name="body" type="modelName" required="true" />
      <returns type="modelName" />
    </endpoint>

    <endpoint action="update" method="POST" path="/update" description="更新">
      <param name="body" type="modelName" required="true" />
      <returns type="modelName" />
    </endpoint>

    <endpoint action="remove" method="POST" path="/delete" description="删除">
      <param name="id" type="number" required="true" />
      <returns>
        <field name="message" type="string" />
      </returns>
    </endpoint>
  </api>
</modal>
```

### 3. 执行代码生成

```bash
# 生成所有 XML（推荐）
npm run gen

# 生成指定 XML
node src/cli.js --file order.xml
```

### 4. 启动项目

```bash
# 启动后端（NestJS + WebSocket）
cd nest-code
npm run start:dev

# 启动前端（Vue3）
cd vue-code
npm run start
```

***

## 核心功能：WebSocket 实时通信

### 架构设计

```
前端 (Vue3)                    后端 (NestJS)
┌─────────────┐               ┌─────────────────┐
│ wsStore      │◀── WS ─────▶│ WsGateway       │
│ (Pinia Store)│              │ (连接管理)       │
│              │              │        │         │
│ watch()      │              │        ▼         │
│ unwatch()    │              │  WsService       │
│              │              │ (订阅管理)       │
│ moduleData[] │              │        │         │
└─────────────┘              │        ▼         │
                             │  Data Fetcher    │
                             │  (LogService)    │
                             │  (ProductService)│
                             └─────────────────┘
```

### 前端使用

#### 1. 在页面中订阅数据

```vue
<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useWsStore } from '@/stores'
import type { QueryParams } from '@/models/common/types'

const wsStore = useWsStore()

// 从 WS 获取数据（响应式）
const dataList = computed(() => wsStore.moduleData['module/name']?.list || [])

// 处理查询事件（分页、搜索）
function handleSearch(params: QueryParams) {
  wsStore.watch({ 
    module: 'module/name', 
    params: {
      ...params.searchParams,
      page: params.pageInfo.page,
      pageSize: params.pageInfo.pageSize,
    }
  })
}

// 页面加载时订阅
onMounted(() => {
  wsStore.watch({ module: 'module/name', params: { page: 1, pageSize: 20 } })
})

// 页面卸载时取消订阅
onUnmounted(() => {
  wsStore.unwatch({ module: 'module/name' })
})
</script>

<template>
  <CrudTable :data="dataList" @query="handleSearch" />
</template>
```

#### 2. WebSocket Store API

| 方法          | 说明     | 参数                                               |
| ----------- | ------ | ------------------------------------------------ |
| `watch()`   | 订阅模块数据 | `{ module: string, params?: object }`            |
| `unwatch()` | 取消订阅   | `{ module: string }`                             |
| `send()`    | 发送消息   | `{ module: string, action: string, data?: any }` |

#### 3. 数据结构

```typescript
wsStore.moduleData = {
  'system/log': {
    list: [...],           // 数据列表
    pageInfo: {            // 分页信息
      page: 1,
      pageSize: 20,
      total: 100
    },
    searchParams: {...}    // 搜索参数
  },
  'shop/product': {
    list: [...],
    pageInfo: {...},
    searchParams: {...}
  }
}
```

### 后端使用

#### 1. 在 Service 中集成 WebSocket

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { XxxServiceBase } from './generated/xxx.service';
import { WsEntityHelper } from '../../common/ws/ws-entity.service';
import { WsService } from '../../common/ws';

@Injectable()
export class XxxService extends XxxServiceBase implements OnModuleInit {
  protected wsHelper: WsEntityHelper;

  constructor(
    @InjectRepository(XxxEntity)
    protected readonly repo: Repository<XxxEntity>,
    wsService: WsService,
  ) {
    super(repo);
    this.wsHelper = new WsEntityHelper(wsService);  // 初始化 Helper
  }

  onModuleInit() {
    // 注册 WS 数据获取器
    this.wsHelper.init(this, 'module/name');
  }

  async create(body: Partial<CreateXxxDto>) {
    const record = await super.create(body);
    this.wsHelper.pushData();  // 创建后推送更新
    return record;
  }

  async remove(body: Partial<IdQuery>) {
    const result = await super.remove(body);
    this.wsHelper.pushData();  // 删除后推送更新
    return result;
  }
}
```

#### 2. WsEntityHelper 方法

| 方法                      | 说明           |
| ----------------------- | ------------ |
| `init(service, module)` | 初始化并注册数据获取器  |
| `pushData()`            | 推送最新数据到所有订阅者 |

**特性**：

- ✅ 数据变更后自动推送到所有订阅者
- ✅ 支持多模块同时订阅
- ✅ 取消订阅后停止推送

#### 3. Module 配置

在模块中导入 `WsModule`：

```typescript
@Module({
  imports: [WsModule],  // 导入 WS 模块
  providers: [XxxService],
  controllers: [XxxController],
})
export class XxxModule {}
```

***

## XML 字段定义参考

### `<modal>` 属性

| 属性       | 说明              | 示例       |
| -------- | --------------- | -------- |
| `name`   | 模型名（PascalCase） | `User`   |
| `label`  | 中文名             | `用户`     |
| `module` | 所属模块（影响生成路径）    | `system` |

### `<field>` 属性

| 属性           | 说明             | 默认值      |
| ------------ | -------------- | -------- |
| `name`       | 字段名（camelCase） | 必填       |
| `label`      | 中文标签           | 必填       |
| `type`       | 字段类型（见下表）      | `string` |
| `primary`    | 是否主键           | `false`  |
| `visible`    | 是否显示（表单和表格）    | `true`   |
| `searchable` | 是否作为搜索条件       | `false`  |
| `readonly`   | 是否只读           | `false`  |
| `default`    | 默认值            | -        |

### 支持的字段类型

| XML Type     | TypeScript       | Vue组件                    | 数据库             |
| ------------ | ---------------- | ------------------------ | --------------- |
| `string`     | `string`         | `ElInput`                | `VARCHAR(255)`  |
| `number`     | `number`         | `ElInputNumber`          | `DECIMAL(18,4)` |
| `integer`    | `number`         | `ElInputNumber`          | `INT`           |
| `boolean`    | `boolean`        | `ElSwitch`               | `TINYINT(1)`    |
| `email`      | `string`         | `ElInput`                | `VARCHAR(255)`  |
| `password`   | `string`         | `ElInput(type=password)` | `VARCHAR(255)`  |
| `date`       | `string`         | `ElDatePicker`           | `DATE`          |
| `datetime`   | `string`         | `ElDatePicker`           | `DATETIME`      |
| `select`     | `string\|number` | `ElSelect`               | `VARCHAR(64)`   |
| `textarea`   | `string`         | `ElInput(textarea)`      | `TEXT`          |
| `richtext`   | `string`         | `RichTextEditor`         | `LONGTEXT`      |
| `image`      | `string`         | `ImageUpload`            | `VARCHAR(512)`  |
| `image-list` | `string[]`       | `ImageListUpload`        | `JSON`          |

### `<validation>` 属性

| 属性          | 说明            | 适用类型   |
| ----------- | ------------- | ------ |
| `required`  | 是否必填          | 全部     |
| `minLength` | 最小长度          | string |
| `maxLength` | 最大长度          | string |
| `min`       | 最小值           | number |
| `max`       | 最大值           | number |
| `pattern`   | 正则表达式         | string |
| `format`    | 格式（如 `email`） | string |
| `default`   | 默认值           | 全部     |
| `message`   | 自定义错误提示       | 全部     |

### `<condition>` 属性（条件显示）

| 属性         | 说明                             | 默认值  |
| ---------- | ------------------------------ | ---- |
| `name`     | 依赖字段名                          | 必填   |
| `value`    | 依赖字段的值                         | 必填   |
| `operator` | 比较运算符：`eq`/`ne`/`gt`/`lt`/`in` | `eq` |
| `logic`    | 与下一个条件的连接：`and`/`or`           | `or` |

**条件显示示例**：

```xml
<!-- status=1 或 status=2 时显示 -->
<field name="images" label="商品图片" type="image-list" visible="false">
  <condition name="status" value="1" operator="eq" logic="or" />
  <condition name="status" value="2" operator="eq" />
</field>
```

### `<api>` 配置

| 属性       | 说明       |
| -------- | -------- |
| `prefix` | API 前缀路径 |

### `<endpoint>` 属性

| 属性            | 说明                                  |
| ------------- | ----------------------------------- |
| `action`      | 方法名（camelCase）                      |
| `method`      | HTTP 方法：`GET`/`POST`/`PUT`/`DELETE` |
| `path`        | 接口路径                                |
| `description` | 接口描述                                |

***

## 生成文件说明

### 前端（Vue3）

| 文件                     | 内容                                 | 更新策略  |
| ---------------------- | ---------------------------------- | ----- |
| `generated/*.model.ts` | TypeScript Interface + Model Class | 每次覆盖  |
| `generated/*.form.ts`  | 表单字段配置 + 校验规则                      | 每次覆盖  |
| `generated/*.table.ts` | 表格列配置 + 搜索字段                       | 每次覆盖  |
| `generated/*.api.ts`   | API Service 基类                     | 每次覆盖  |
| `*.api.ts`             | 用户自定义 API（继承基类）                    | 仅首次创建 |
| `index.ts`             | 统一导出入口                             | 每次覆盖  |

#### 公共类型定义

`models/common/types.ts`（自动生成）：

| 接口                  | 说明                                                              |
| ------------------- | --------------------------------------------------------------- |
| `FieldConfig`       | 字段配置（name, label, type, value, default, visible, conditions...） |
| `TableColumnConfig` | 表格列配置（prop, label, visible, sortable...）                        |
| `FormFieldConfig`   | 表单字段配置（prop, label, component, span...）                         |
| `FormItemRule`      | 表单校验规则                                                          |
| **`QueryParams`**   | **CrudTable query 事件参数（pageInfo, searchParams）**                |

### 后端（NestJS）

| 文件                          | 内容               | 更新策略  |
| --------------------------- | ---------------- | ----- |
| `generated/*.entity.ts`     | TypeORM Entity   | 每次覆盖  |
| `generated/*.service.ts`    | Service 基类       | 每次覆盖  |
| `generated/*.controller.ts` | Controller 基类    | 每次覆盖  |
| `generated/*.module.ts`     | Module 基类        | 每次覆盖  |
| `generated/dto/*.ts`        | DTO 定义           | 每次覆盖  |
| `*.service.ts`              | 用户自定义 Service    | 仅首次创建 |
| `*.controller.ts`           | 用户自定义 Controller | 仅首次创建 |
| `*.module.ts`               | 用户自定义 Module     | 仅首次创建 |

#### WebSocket 模块

`common/ws/`（手动维护）：

| 文件                     | 说明                                    |
| ---------------------- | ------------------------------------- |
| `ws.module.ts`         | WS 模块定义                               |
| `ws.service.ts`        | WS 服务核心（订阅管理、消息分发）                    |
| `ws.gateway.ts`        | WS 网关（连接处理、消息路由）                      |
| `ws-entity.service.ts` | **WsEntityHelper 辅助类**（简化 Service 集成） |

***

## 工作流

```
XML 定义
   │
   ▼
XmlParser（解析为 ModalSchema 对象）
   │
   ├──▶ VueCodeGenerator ──▶ vue-code/src/models/<module>/<name>/
   │                              generated/*.model.ts
   │                              generated/*.form.ts
   │                              generated/*.table.ts
   │                              generated/*.api.ts
   │                              *.api.ts（仅首次）
   │                              index.ts
   │                              models/common/types.ts（公共类型）
   │
   └──▶ NestCodeGenerator ──▶ nest-code/src/<module>/<name>/
                                   generated/*.entity.ts
                                   generated/*.service.ts
                                   generated/*.controller.ts
                                   generated/*.module.ts
                                   generated/dto/*.ts
                                   *.service.ts（仅首次）
                                   *.controller.ts（仅首次）
                                   *.module.ts（仅首次）

运行时工作流（WebSocket 实时通信）：
   
   前端页面加载
       │
       ▼
   wsStore.watch({ module, params })  ← 订阅模块
       │
       ▼
   WsGateway 接收订阅请求
       │
       ▼
   WsService.registerDataFetcher()  ← 注册数据获取器
       │
       ▼
   Service.findAll(params)  ← 查询数据
       │
       ▼
   WsService.publish()  ← 推送到所有订阅者
       │
       ▼
   前端 wsStore.moduleData 更新  ← UI 自动刷新
   
   数据变更（create/update/remove）
       │
       ▼
   Service.wsHelper.pushData()  ← 触发推送
       │
       ▼
   使用 lastParams 重新查询
       │
       ▼
   推送到所有订阅者
```

***

## 扩展说明

- **新增字段类型**：在 `modal-gen-control/src/utils/typeMapper.js` 的 `TYPE_MAP` 中添加映射
- **修改代码模板**：分别编辑 `VueCodeGenerator.js` 或 `NestCodeGenerator.js` 中对应的 `gen*` 方法
- **新增生成目标**：在 `modal-gen-control/src/index.js` 中扩展生成逻辑（如生成文档、SQL脚本等）
- **自定义字段配置**：修改 `models/common/types.ts` 添加新字段，同步更新 `fileWriter.js` 模板
- **扩展 WebSocket 功能**：
  - 修改 `WsService` 添加新的消息类型处理
  - 扩展 `WsEntityHelper` 添加更多便捷方法
  - 在 `WsGateway` 中添加新的事件监听

***

## 注意事项

1. **无实体模块**：如果模块不需要数据库实体（如 Dashboard），不要定义 `primary="true"` 的字段，生成器会自动跳过 Entity 生成
2. **用户自定义代码**：`generated/` 目录外的文件仅首次创建，可安全添加自定义逻辑
3. **条件显示**：`visible` 属性控制初始显示，`conditions` 数组控制动态显示逻辑
4. **API 方法**：默认使用 `POST` 方法，在 `<endpoint>` 中指定 `method` 属性可修改
5. **WebSocket 连接**：
   - 前端自动连接 `ws://localhost:3000/ws`（可通过环境变量配置）
   - 后端使用原生 WebSocket（非 Socket.IO）
   - 页面卸载时务必调用 `unwatch()` 取消订阅
6. **性能优化**：
   - `lastParams` 机制避免重复查询
   - 取消订阅后立即停止数据推送
   - 支持同一模块多个客户端独立订阅

***

## 技术栈

### 前端

- **Vue 3** + Composition API
- **TypeScript** + Vite
- **Pinia** 状态管理
- **Element Plus** UI 组件库
- **原生 WebSocket** API

### 后端

- **NestJS** 框架
- **TypeORM** ORM
- **@nestjs/platform-ws** WebSocket 支持
- **依赖注入** + **模块化架构**

### 代码生成

- **Node.js** + 自定义解析器
- **XML** 模型定义
- **模板引擎** 代码生成

