# XML Modal Framework

> **XML驱动的全栈业务模型代码生成框架**
> 一次定义，同时生成 Vue3 前端模型 + NestJS 后端模型

---

## 目录结构

```
xml-modal-formwork/
├── xml-modal/               # 📝 XML 模型定义文件（你在这里写定义）
│   ├── user.xml             # 用户模块示例
│   └── product.xml          # 商品模块示例
│
├── modal-gen-control/       # ⚙️ 代码生成器核心
│   ├── src/
│   │   ├── parser/
│   │   │   └── XmlParser.js          # 解析 XML → ModalSchema
│   │   ├── generators/
│   │   │   ├── VueCodeGenerator.js   # 生成 Vue3 前端代码
│   │   │   └── NestCodeGenerator.js  # 生成 NestJS 后端代码
│   │   ├── utils/
│   │   │   ├── typeMapper.js         # 类型映射（XML→TS/Java/DB）
│   │   │   └── fileWriter.js         # 文件写入工具
│   │   ├── index.js                  # 核心控制器
│   │   └── cli.js                    # CLI 入口
│   └── package.json
│
├── vue-code/                # 🖥️ Vue3 前端项目（生成产物在 src/models/）
│   └── src/
│       └── models/
│           ├── system/user/         ← user.xml 生成
│           │   ├── user.model.ts    # 数据模型 & Interface
│           │   ├── user.form.ts     # 表单字段配置 + 校验规则
│           │   ├── user.table.ts    # 表格列配置 + 搜索字段
│           │   ├── user.api.ts      # API Service
│           │   └── index.ts         # 统一导出
│           └── shop/product/        ← product.xml 生成
│
└── nest-code/               # 🔧 NestJS 后端项目（生成产物在 src/）
    └── src/
        ├── system/user/             ← user.xml 生成
        │   ├── user.entity.ts       # TypeORM 实体
        │   ├── user.service.ts      # Service（含分页/搜索）
        │   ├── user.controller.ts   # Controller（CRUD接口）
        │   ├── user.module.ts       # Module
        │   ├── dto/
        │   │   ├── create-user.dto.ts  # 创建 DTO（class-validator）
        │   │   └── update-user.dto.ts  # 更新 DTO（PartialType）
        │   └── index.ts
        └── shop/product/            ← product.xml 生成
```

---

## 快速开始

### 1. 安装依赖

```bash
cd modal-gen-control
npm install
```

### 2. 编写 XML 模型定义

在 `xml-modal/` 目录下新建 XML 文件，例如 `order.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<modal name="Order" label="订单" type="form" module="trade">
  <description>订单管理模块</description>

  <fields>
    <field name="id" label="ID" type="number" primary="true" hidden="true">
      <validation required="false" />
    </field>

    <field name="orderNo" label="订单号" type="string" tableVisible="true" searchable="true">
      <validation required="true" minLength="8" maxLength="32" />
    </field>

    <field name="amount" label="金额" type="number" tableVisible="true">
      <validation required="true" min="0" message="金额不能为负数" />
    </field>

    <field name="status" label="状态" type="select" tableVisible="true">
      <options>
        <option value="0" label="待支付" />
        <option value="1" label="已支付" />
        <option value="2" label="已取消" />
      </options>
      <validation required="true" default="0" />
    </field>

    <field name="createdAt" label="创建时间" type="datetime" tableVisible="true" readonly="true">
      <validation required="false" />
    </field>
  </fields>

  <table pagination="true" pageSize="20" sortable="true" />
  <form layout="grid" cols="2" labelWidth="100px" />

  <api prefix="/api/trade/order">
    <endpoint action="list"   method="GET"    path="/"    description="查询列表" />
    <endpoint action="detail" method="GET"    path="/:id" description="查询详情" />
    <endpoint action="create" method="POST"   path="/"    description="新建" />
    <endpoint action="update" method="PUT"    path="/:id" description="更新" />
    <endpoint action="delete" method="DELETE" path="/:id" description="删除" />
  </api>
</modal>
```

### 3. 执行代码生成

```bash
# 生成所有 XML（推荐）
node src/cli.js --all

# 生成指定 XML
node src/cli.js --file order.xml

# 监听模式（修改XML自动重新生成）
node src/cli.js --watch
```

---

## XML 字段定义参考

### `<modal>` 属性

| 属性 | 说明 | 示例 |
|------|------|------|
| `name` | 模型名（PascalCase） | `User` |
| `label` | 中文名 | `用户` |
| `type` | 类型：`form` / `table` / `both` | `form` |
| `module` | 所属模块（影响生成路径） | `system` |

### `<field>` 属性

| 属性 | 说明 | 默认值 |
|------|------|--------|
| `name` | 字段名（camelCase） | 必填 |
| `label` | 中文标签 | 必填 |
| `type` | 字段类型（见下表） | `string` |
| `primary` | 是否主键 | `false` |
| `hidden` | 是否在表单中隐藏 | `false` |
| `tableVisible` | 是否在表格中显示 | `false` |
| `searchable` | 是否作为搜索条件 | `false` |
| `readonly` | 是否只读 | `false` |

### 支持的字段类型

| XML Type | TypeScript | Vue组件 | 数据库 |
|----------|-----------|---------|--------|
| `string` | `string` | `ElInput` | `VARCHAR(255)` |
| `number` | `number` | `ElInputNumber` | `DECIMAL(18,4)` |
| `integer` | `number` | `ElInputNumber` | `INT` |
| `boolean` | `boolean` | `ElSwitch` | `TINYINT(1)` |
| `email` | `string` | `ElInput` | `VARCHAR(255)` |
| `password` | `string` | `ElInput(type=password)` | `VARCHAR(255)` |
| `date` | `string` | `ElDatePicker` | `DATE` |
| `datetime` | `string` | `ElDatePicker` | `DATETIME` |
| `select` | `string\|number` | `ElSelect` | `VARCHAR(64)` |
| `textarea` | `string` | `ElInput(textarea)` | `TEXT` |
| `richtext` | `string` | `RichTextEditor` | `LONGTEXT` |
| `image` | `string` | `ImageUpload` | `VARCHAR(512)` |
| `image-list` | `string[]` | `ImageListUpload` | `JSON` |

### `<validation>` 属性

| 属性 | 说明 | 适用类型 |
|------|------|---------|
| `required` | 是否必填 | 全部 |
| `minLength` | 最小长度 | string |
| `maxLength` | 最大长度 | string |
| `min` | 最小值 | number |
| `max` | 最大值 | number |
| `pattern` | 正则表达式 | string |
| `format` | 格式（如 `email`） | string |
| `default` | 默认值 | 全部 |
| `message` | 自定义错误提示 | 全部 |

---

## 生成文件说明

### 前端（Vue3）

| 文件 | 内容 |
|------|------|
| `*.model.ts` | TypeScript Interface + Model Class（含构造器、toJSON） |
| `*.form.ts` | 表单字段配置数组 + Element Plus 校验规则 |
| `*.table.ts` | 表格列配置数组 + 搜索字段配置 |
| `*.api.ts` | API Service（基于 axios/request 封装） |
| `index.ts` | 统一导出入口 |

### 后端（NestJS）

| 文件 | 内容 |
|------|------|
| `*.entity.ts` | TypeORM Entity（含列装饰器、自动时间戳） |
| `*.service.ts` | Service（分页查询、CRUD、404处理） |
| `*.controller.ts` | Controller（RESTful接口、Swagger注解） |
| `*.module.ts` | NestJS Module（含 TypeORM 注册） |
| `dto/create-*.dto.ts` | 创建 DTO（class-validator 校验） |
| `dto/update-*.dto.ts` | 更新 DTO（PartialType 继承） |

---

## 工作流

```
XML 定义
   │
   ▼
XmlParser（解析为 ModalSchema 对象）
   │
   ├──▶ VueCodeGenerator ──▶ vue-code/src/models/<module>/<name>/
   │                              *.model.ts
   │                              *.form.ts
   │                              *.table.ts
   │                              *.api.ts
   │
   └──▶ NestCodeGenerator ──▶ nest-code/src/<module>/<name>/
                                   *.entity.ts
                                   *.service.ts
                                   *.controller.ts
                                   *.module.ts
                                   dto/create-*.dto.ts
                                   dto/update-*.dto.ts
```

---

## 扩展说明

- **新增字段类型**：在 `modal-gen-control/src/utils/typeMapper.js` 的 `TYPE_MAP` 中添加映射
- **修改代码模板**：分别编辑 `VueCodeGenerator.js` 或 `NestCodeGenerator.js` 中对应的 `gen*` 方法
- **新增生成目标**：在 `modal-gen-control/src/index.js` 中扩展生成逻辑（如生成文档、SQL脚本等）
