/**
 * Vue3前端代码生成器
 * 根据 ModalSchema 生成：
 *   1. model class (TypeScript) - 数据模型
 *   2. formRules - 表单校验规则
 *   3. tableColumns - 表格列配置
 *   4. formFields - 表单字段配置
 *   5. api service class
 */

const { getTsType, getFormComponent, toPascalCase, toKebabCase } = require('../utils/typeMapper');

class VueCodeGenerator {
  /**
   * 生成完整的前端模型文件内容（输出多个对象）
   * @param {import('../parser/XmlParser').ModalSchema} schema
   * @returns {{ modelClass: string, formConfig: string, tableConfig: string, apiService: string }}
   */
  generate(schema) {
    return {
      modelClass: this.genModelClass(schema),
      formConfig: this.genFormConfig(schema),
      tableConfig: this.genTableConfig(schema),
      apiService: this.genApiService(schema),
    };
  }

  // ─────────────────────────────────────────────────────
  // 1. Model Class
  // ─────────────────────────────────────────────────────
  genModelClass(schema) {
    const className = toPascalCase(schema.name);
    const lines = [
      `/**`,
      ` * ${schema.label} 数据模型`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` * 请勿手动修改，重新生成会覆盖此文件`,
      ` */`,
      ``,
      `export interface I${className} {`,
    ];

    for (const field of schema.fields) {
      const tsType = getTsType(field.type);
      const optional = field.validation.required === 'true' ? '' : '?';
      lines.push(`  /** ${field.label} */`);
      lines.push(`  ${field.name}${optional}: ${tsType};`);
    }

    lines.push(`}`);
    lines.push(``);
    lines.push(`export class ${className}Model implements I${className} {`);

    for (const field of schema.fields) {
      const tsType = getTsType(field.type);
      const def = this._getDefaultValue(field);
      lines.push(`  /** ${field.label} */`);
      lines.push(`  ${field.name}: ${tsType} = ${def};`);
    }

    lines.push(``);
    lines.push(`  constructor(data?: Partial<I${className}>) {`);
    lines.push(`    if (data) Object.assign(this, data);`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  /** 转为纯 JSON 对象 */`);
    lines.push(`  toJSON(): I${className} {`);
    lines.push(`    return { ...this };`);
    lines.push(`  }`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`export default ${className}Model;`);

    return lines.join('\n');
  }

  // ─────────────────────────────────────────────────────
  // 2. 表单字段配置 + 校验规则
  // ─────────────────────────────────────────────────────
  genFormConfig(schema) {
    const className = toPascalCase(schema.name);
    const lines = [
      `/**`,
      ` * ${schema.label} 表单配置`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` */`,
      ``,
      `import type { FormItemRule } from 'element-plus';`,
      ``,
      `// ---- 表单字段定义 ----`,
      `export interface FormFieldConfig {`,
      `  prop: string;`,
      `  label: string;`,
      `  component: string;`,
      `  type?: string;`,
      `  readonly?: boolean;`,
      `  hidden?: boolean;`,
      `  options?: { value: string | number; label: string }[];`,
      `  remoteOptions?: { api: string; labelKey: string; valueKey: string };`,
      `  componentProps?: Record<string, any>;`,
      `}`,
      ``,
      `export const ${schema.name}FormFields: FormFieldConfig[] = [`,
    ];

    for (const field of schema.fields) {
      if (field.hidden) continue;
      const comp = getFormComponent(field.type);
      lines.push(`  {`);
      lines.push(`    prop: '${field.name}',`);
      lines.push(`    label: '${field.label}',`);
      lines.push(`    component: '${comp}',`);
      if (field.type === 'password') lines.push(`    type: 'password',`);
      if (field.type === 'textarea') lines.push(`    componentProps: { type: 'textarea', rows: 4 },`);
      if (field.type === 'date') lines.push(`    componentProps: { type: 'date', valueFormat: 'YYYY-MM-DD' },`);
      if (field.type === 'datetime') lines.push(`    componentProps: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },`);
      if (field.readonly) lines.push(`    readonly: true,`);
      if (field.options && field.options.length > 0) {
        const opts = field.options.map(o => `{ value: ${isNaN(o.value) ? `'${o.value}'` : o.value}, label: '${o.label}' }`).join(', ');
        lines.push(`    options: [${opts}],`);
      }
      if (field.remoteOptions) {
        lines.push(`    remoteOptions: { api: '${field.remoteOptions.api}', labelKey: '${field.remoteOptions.labelKey}', valueKey: '${field.remoteOptions.valueKey}' },`);
      }
      lines.push(`  },`);
    }

    lines.push(`];`);
    lines.push(``);
    lines.push(`// ---- 表单校验规则 ----`);
    lines.push(`export const ${schema.name}FormRules: Record<string, FormItemRule[]> = {`);

    for (const field of schema.fields) {
      const v = field.validation;
      const rules = [];

      if (v.required === 'true') {
        rules.push(`{ required: true, message: '${v.message || `请输入${field.label}`}', trigger: ['blur', 'change'] }`);
      }
      if (v.minLength) {
        rules.push(`{ min: ${v.minLength}, message: '最少${v.minLength}个字符', trigger: 'blur' }`);
      }
      if (v.maxLength) {
        rules.push(`{ max: ${v.maxLength}, message: '最多${v.maxLength}个字符', trigger: 'blur' }`);
      }
      if (v.pattern) {
        rules.push(`{ pattern: /${v.pattern}/, message: '${v.message || '格式不正确'}', trigger: 'blur' }`);
      }
      if (field.type === 'email' || v.format === 'email') {
        rules.push(`{ type: 'email', message: '${v.message || '请输入有效的邮箱'}', trigger: 'blur' }`);
      }

      if (rules.length > 0) {
        lines.push(`  ${field.name}: [`);
        for (const r of rules) lines.push(`    ${r},`);
        lines.push(`  ],`);
      }
    }

    lines.push(`};`);
    lines.push(``);
    lines.push(`export default { ${schema.name}FormFields, ${schema.name}FormRules };`);

    return lines.join('\n');
  }

  // ─────────────────────────────────────────────────────
  // 3. 表格列配置
  // ─────────────────────────────────────────────────────
  genTableConfig(schema) {
    const lines = [
      `/**`,
      ` * ${schema.label} 表格列配置`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` */`,
      ``,
      `export interface TableColumnConfig {`,
      `  prop: string;`,
      `  label: string;`,
      `  sortable?: boolean;`,
      `  width?: number | string;`,
      `  minWidth?: number | string;`,
      `  formatter?: string;`,
      `  tag?: boolean;`,
      `  options?: { value: string | number; label: string; type?: string }[];`,
      `}`,
      ``,
      `export const ${schema.name}TableColumns: TableColumnConfig[] = [`,
    ];

    for (const field of schema.fields) {
      if (!field.tableVisible) continue;
      lines.push(`  {`);
      lines.push(`    prop: '${field.name}',`);
      lines.push(`    label: '${field.label}',`);
      if (schema.table.sortable === 'true') lines.push(`    sortable: true,`);
      if (field.type === 'datetime' || field.type === 'date') {
        lines.push(`    formatter: '${field.type}',`);
        lines.push(`    minWidth: 160,`);
      }
      if (field.options && field.options.length > 0) {
        lines.push(`    tag: true,`);
        const opts = field.options.map(o => `{ value: ${isNaN(o.value) ? `'${o.value}'` : o.value}, label: '${o.label}' }`).join(', ');
        lines.push(`    options: [${opts}],`);
      }
      lines.push(`  },`);
    }

    lines.push(`];`);
    lines.push(``);
    lines.push(`// 搜索字段`);
    lines.push(`export const ${schema.name}SearchFields = [`);
    for (const field of schema.fields) {
      if (!field.searchable) continue;
      lines.push(`  { prop: '${field.name}', label: '${field.label}', component: '${getFormComponent(field.type)}' },`);
    }
    lines.push(`];`);
    lines.push(``);
    lines.push(`export default { ${schema.name}TableColumns, ${schema.name}SearchFields };`);

    return lines.join('\n');
  }

  // ─────────────────────────────────────────────────────
  // 4. API Service
  // ─────────────────────────────────────────────────────
  genApiService(schema) {
    const className = toPascalCase(schema.name);
    const prefix = schema.api.prefix;
    const lines = [
      `/**`,
      ` * ${schema.label} API 服务`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` */`,
      ``,
      `import request from '@/utils/request';`,
      `import type { I${className} } from './${schema.name}.model';`,
      ``,
      `const BASE_URL = '${prefix}';`,
      ``,
      `export const ${schema.name}Api = {`,
    ];

    const endpointMap = {};
    for (const ep of schema.api.endpoints) {
      endpointMap[ep.action] = ep;
    }

    if (endpointMap.list) {
      lines.push(`  /** ${endpointMap.list.description || '查询列表'} */`);
      lines.push(`  list(params?: Record<string, any>) {`);
      lines.push(`    return request.get<{ list: I${className}[]; total: number }>(BASE_URL, { params });`);
      lines.push(`  },`);
      lines.push(``);
    }

    if (endpointMap.detail) {
      lines.push(`  /** ${endpointMap.detail.description || '查询详情'} */`);
      lines.push(`  detail(id: number | string) {`);
      lines.push(`    return request.get<I${className}>(\`\${BASE_URL}/\${id}\`);`);
      lines.push(`  },`);
      lines.push(``);
    }

    if (endpointMap.create) {
      lines.push(`  /** ${endpointMap.create.description || '新建'} */`);
      lines.push(`  create(data: Partial<I${className}>) {`);
      lines.push(`    return request.post<I${className}>(BASE_URL, data);`);
      lines.push(`  },`);
      lines.push(``);
    }

    if (endpointMap.update) {
      lines.push(`  /** ${endpointMap.update.description || '更新'} */`);
      lines.push(`  update(id: number | string, data: Partial<I${className}>) {`);
      lines.push(`    return request.put<I${className}>(\`\${BASE_URL}/\${id}\`, data);`);
      lines.push(`  },`);
      lines.push(``);
    }

    if (endpointMap.delete) {
      lines.push(`  /** ${endpointMap.delete.description || '删除'} */`);
      lines.push(`  remove(id: number | string) {`);
      lines.push(`    return request.delete(\`\${BASE_URL}/\${id}\`);`);
      lines.push(`  },`);
    }

    lines.push(`};`);
    lines.push(``);
    lines.push(`export default ${schema.name}Api;`);

    return lines.join('\n');
  }

  // ─────────────────────────────────────────────────────
  // 辅助方法
  // ─────────────────────────────────────────────────────
  _getDefaultValue(field) {
    const v = field.validation;
    if (v && v.default !== undefined) {
      const d = v.default;
      if (field.type === 'number' || field.type === 'integer') return d;
      if (field.type === 'boolean') return d;
      return `'${d}'`;
    }
    switch (field.type) {
      case 'number':
      case 'integer': return '0';
      case 'boolean': return 'false';
      case 'image-list': return '[]';
      default: return "''";
    }
  }
}

module.exports = VueCodeGenerator;
