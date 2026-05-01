/**
 * Vue3前端代码生成器（generated/ 子目录模式）
 *  - generated/<name>.api.ts  → 每次覆盖（标准请求实现，类名 <Name>ApiBase）
 *  - <name>.api.ts             → 仅首次创建（继承 <Name>ApiBase，自定义请求逻辑写这里）
 */
const { getTsType, getFormComponent, toPascalCase, toKebabCase } = require('../utils/typeMapper');

class VueCodeGenerator {
  /**
   * 生成前端模型相关代码
   * @returns {{ modelClass: string, formConfig: string, tableConfig: string, apiService: string }}
   */
  generate(schema) {
    return {
      modelClass:    this.genModelClass(schema),
      formConfig:    this.genFormConfig(schema),
      tableConfig:   this.genTableConfig(schema),
      apiService:    this.genApiServiceBase(schema),  // 输出文件名：<name>.api.ts（无 .base）
      types:         this.genTypes(schema),              // generated/<name>.types.ts
    };
  }

  // ────────────────────────────────────────────
  // 1. Model Class（每次覆盖）
  // ────────────────────────────────────────────
  genModelClass(schema) {
    const className = toPascalCase(schema.name);
    const lines = [
      `/**`,
      ` * ${schema.label} 数据模型`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` * ⚠️ 此文件每次重新生成都会被覆盖`,
      ` */`,
      ``,
      `import type { FieldConfig } from '@/models/common/types';`,
      ``,
      `export interface I${className} {`,
    ];

    for (const field of schema.fields) {
      const optional = field.validation?.required === 'true' ? '' : '?';
      lines.push(`  /** ${field.label} */`);
      lines.push(`  ${field.name}${optional}: FieldConfig;`);
    }

    lines.push(`}`);
    lines.push(``);
    lines.push(`export class ${className}Model implements I${className} {`);

    for (const field of schema.fields) {
      const def = this._getDefaultValue(field);
      const optionsStr = field.options && field.options.length > 0
        ? `, options: [${field.options.map(o => `{ value: ${o.value === 'true' || o.value === 'false' || !isNaN(o.value) ? o.value : `'${o.value}'`}, label: '${o.label}' }`).join(', ')}]`
        : '';
      const conditionsStr = field.conditions && field.conditions.length > 0
        ? `, conditions: [${field.conditions.map(c => `{ name: '${c.name}', value: '${c.value}', operator: '${c.operator || 'eq'}'${c.logic ? `, logic: '${c.logic}'` : ''} }`).join(', ')}]`
        : '';
      
      lines.push(`  /** ${field.label} */`);
      lines.push(`  ${field.name}: FieldConfig = {`);
      lines.push(`    name: '${field.name}',`);
      lines.push(`    label: '${field.label}',`);
      lines.push(`    type: '${field.type}',`);
      lines.push(`    value: ${def},`);
      lines.push(`    default: ${def},`);
      lines.push(`    primary: ${field.primary},`);
      lines.push(`    visible: ${field.visible},`);
      lines.push(`    searchable: ${field.searchable},`);
      lines.push(`    readonly: ${field.readonly},`);
      if (optionsStr) lines.push(`    ${optionsStr.slice(2)}`);
      if (conditionsStr) lines.push(`    ${conditionsStr.slice(2)}`);
      lines.push(`  };`);
    }

    lines.push(``);
    lines.push(`  constructor(data?: Partial<I${className}>) {`);
    lines.push(`    if (data) {`);
    lines.push(`      for (const key in data) {`);
    lines.push(`        const k = key as keyof I${className};`);
    lines.push(`        if (this[k] && data[k]) {`);
    lines.push(`          this[k].value = data[k]!.value !== undefined ? data[k]!.value : data[k];`);
    lines.push(`        }`);
    lines.push(`      }`);
    lines.push(`    }`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  toJSON(): Record<string, any> {`);
    lines.push(`    const result: Record<string, any> = {};`);
    lines.push(`    const keys = Object.keys(this) as (keyof I${className})[];`);
    lines.push(`    for (const key of keys) {`);
    lines.push(`      if (this[key] && typeof this[key] === 'object' && 'value' in this[key]) {`);
    lines.push(`        result[key] = this[key].value;`);
    lines.push(`      }`);
    lines.push(`    }`);
    lines.push(`    return result;`);
    lines.push(`  }`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`export default ${className}Model;`);

    return lines.join('\n');
  }

  // ────────────────────────────────────────────
  // 2. 表单字段配置 + 校验规则（每次覆盖）
  // ────────────────────────────────────────────
  genFormConfig(schema) {
    const className = toPascalCase(schema.name);
    const lines = [
      `/**`,
      ` * ${schema.label} 表单配置`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` */`,
      ``,
      `import type { FormFieldConfig, FormItemRule } from '@/models/common/types';`,
      ``,
      `export const ${schema.name}FormFields: FormFieldConfig[] = [`,
    ];

    for (const field of schema.fields) {
      if (!field.visible) continue;
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
        const opts = field.options.map(o =>
          `{ value: '${o.value}', label: '${o.label}' }`
          // `{ value: ${isNaN(o.value) ? `'${o.value}'` : o.value}, label: '${o.label}' }`
        ).join(', ');
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
        rules.push(`{ type: 'email', message: '请输入有效的邮箱', trigger: 'blur' }`);
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

  // ────────────────────────────────────────────
  // 3. 表格列配置（每次覆盖）
  // ────────────────────────────────────────────
  genTableConfig(schema) {
    const lines = [
      `/**`,
      ` * ${schema.label} 表格列配置`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` */`,
      ``,
      `import type { TableColumnConfig } from '@/models/common/types';`,
      ``,
      `export const ${schema.name}TableColumns: TableColumnConfig[] = [`,
    ];

    for (const field of schema.fields) {
      lines.push(`  {`);
      lines.push(`    prop: '${field.name}',`);
      lines.push(`    label: '${field.label}',`);
      lines.push(`    visible: ${field.visible},`);
      if (schema.table.sortable === 'true') lines.push(`    sortable: true,`);
      if (['datetime', 'date'].includes(field.type)) {
        lines.push(`    formatter: '${field.type}',`);
        lines.push(`    minWidth: 160,`);
      }
      if (field.options && field.options.length > 0) {
        lines.push(`    tag: true,`);
        const opts = field.options.map(o =>
          `{ value: '${o.value}', label: '${o.label}' }`
          // `{ value: ${isNaN(o.value) ? `'${o.value}'` : o.value}, label: '${o.label}' }`
        ).join(', ');
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

  // ────────────────────────────────────────────
  // 3b. Types（可复用的参数类型 + 返回类型，每次覆盖，在 generated/ 下）
  //    文件名：<name>.types.ts
  // ────────────────────────────────────────────
  genTypes(schema) {
    const types = schema.api.types || [];
    const endpoints = schema.api.endpoints || [];
    
    // 收集所有需要生成的返回类型（内联对象类型）
    const returnTypeAliases = {};
    
    for (const ep of endpoints) {
      const returnType = this._mapReturnsType(ep.returns, toPascalCase(schema.name));
      // 如果是内联对象类型（以 { 开头），需要生成类型别名
      if (returnType.startsWith('{')) {
        const aliasName = `${toPascalCase(schema.name)}${this._toPascalCase(ep.action)}Return`;
        if (!returnTypeAliases[returnType]) {
          returnTypeAliases[returnType] = aliasName;
        }
      }
    }

    // 如果没有类型定义和返回类型，不生成文件
    if (types.length === 0 && Object.keys(returnTypeAliases).length === 0) return '';

    const className = toPascalCase(schema.name);
    const lines = [
      `/**`,
      ` * ${schema.label} 可复用的参数类型和返回类型（Vue 端）`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` * ⚠️ 此文件每次重新生成都会被覆盖`,
      ` */`,
      ``,
      `import type { I${className} } from './${toKebabCase(schema.name)}.model';`,
      ``,
    ];

    // 生成参数类型
    for (const typeDef of types) {
      const typeName = typeDef.name || 'UnnamedType';
      const pascalName = toPascalCase(typeName);

      lines.push(`export interface ${pascalName} {`);
      for (const param of typeDef.params || []) {
        const isRequired = param.required === 'true';
        const tsType = this._mapParamType(param.type, className);
        lines.push(`  ${param.name}${isRequired ? '' : '?'}: ${tsType};`);
      }
      lines.push(`}`);
      lines.push(``);
    }

    // 生成返回类型别名
    for (const [typeStr, alias] of Object.entries(returnTypeAliases)) {
      // typeStr 是多行格式，需要转为单行
      const singleLine = typeStr.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      lines.push(`export type ${alias} = ${singleLine};`);
    }
    if (Object.keys(returnTypeAliases).length > 0) {
      lines.push(``);
    }

    return lines.join('\n');
  }

  // ────────────────────────────────────────────
  // 4. API Service（标准请求实现，每次覆盖，在 generated/ 下）
  //    文件名：<name>.api.ts（无 .base 后缀）
  //    类名：<Name>ApiBase（保留 Base 后缀，与自定义文件区分）
  // ────────────────────────────────────────────
  genApiServiceBase(schema) {
    const className = toPascalCase(schema.name);
    const kebab = toKebabCase(schema.name);
    const prefix = schema.api.prefix;
    
    // 收集所有需要导入的类型名（参数类型 + 返回类型别名）
    const allTypeNames = this._getAllTypeNamesVue(schema);
    
    const lines = [
      `/**`,
      ` * ${schema.label} API 服务（标准实现）`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` * ⚠️ 此文件每次重新生成都会被覆盖`,
      ` *    自定义请求逻辑请写在同目录的 ${kebab}.api.ts 中`,
      ` */`,
      ``,
      `import request from '@/utils/request';`,
      `import type { ApiResponse } from '@/utils/request';`,
      `import type { I${className} } from './${kebab}.model';`,
      allTypeNames.length > 0
        ? `import type { ${allTypeNames.join(', ')} } from './${kebab}.types';`
        : ``,
      ``,
      `const BASE_URL = '${prefix.replace(/^\/api/, '')}';`,
      ``,
      `export class ${className}ApiBase {`,
    ];

    // 第二遍：生成方法
    const methodFn = (m) => (m || 'POST').toLowerCase();

    for (const ep of schema.api.endpoints) {
      const action = ep.action;
      const m = methodFn(ep.method);
      const description = ep.description || action;

      // 根据 <returns> 定义生成返回类型
      // 如果使用类型别名（内联对象类型），从 types.ts 导入
      let returnType = this._mapReturnsType(ep.returns, className);
      if (returnType.startsWith('{')) {
        // 使用类型别名（已在 types.ts 中定义）
        const aliasName = `${className}${this._toPascalCase(action)}Return`;
        returnType = aliasName;
      }

      // 根据 <param> 定义生成方法参数签名
      const params = ep.params || [];
      let methodSig, bodyArg;

      if (params.length === 0) {
        methodSig = 'params?: Record<string, any>';
        bodyArg = 'params';
      } else if (params.length === 1) {
        const p = params[0];
        const pType = this._mapParamType(p.type, className);
        const opt = p.required === 'true' ? '' : '?';
        methodSig = `${p.name}${opt}: ${pType}`;
        bodyArg = p.name;
      } else {
        const s = params.map(p => {
          const t = this._mapParamType(p.type, className);
          const opt = p.required === 'true' ? '' : '?';
          return `${p.name}${opt}: ${t}`;
        }).join(', ');
        methodSig = `data: { ${s} }`;
        bodyArg = 'data';
      }

      // 方法名映射（delete → remove，保持向后兼容）
      const methodName = action;
      const path = ep.path || action;

      lines.push(`  /** ${description} */`);
      lines.push(`  ${methodName}(${methodSig}): Promise<ApiResponse<${returnType}>> {`);
      lines.push(`    return request.${m}<ApiResponse<${returnType}>>(\`\${BASE_URL}${path}\`, ${bodyArg});`);
      lines.push(`  }`);
      lines.push(``);
    }

    lines.push(`}`);
    lines.push(``);
    lines.push(`export default ${className}ApiBase;`);

    return lines.join('\n');
  }

  /**
   * 辅助：将字符串转为 PascalCase
   */
  _toPascalCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * 收集所有需要导入的类型名（参数类型 + 返回类型别名）
   * 用于 API Service 的 import 语句（Vue 端）
   */
  _getAllTypeNamesVue(schema) {
    const typeNames = [];
    
    // 1. 添加参数类型
    const types = schema.api.types || [];
    for (const t of types) {
      const typeName = t.name || 'UnnamedType';
      typeNames.push(toPascalCase(typeName));
    }
    
    // 2. 添加返回类型别名
    const endpoints = schema.api.endpoints || [];
    const returnTypeAliases = {};
    
    for (const ep of endpoints) {
      const returnType = this._mapReturnsType(ep.returns, toPascalCase(schema.name));
      // 如果是内联对象类型（以 { 开头），需要生成类型别名
      if (returnType.startsWith('{')) {
        const aliasName = `${toPascalCase(schema.name)}${this._toPascalCase(ep.action)}Return`;
        if (!returnTypeAliases[returnType]) {
          returnTypeAliases[returnType] = aliasName;
        }
      }
    }
    
    // 添加返回类型别名到类型名列表
    for (const alias of Object.values(returnTypeAliases)) {
      typeNames.push(alias);
    }
    
    return typeNames;
  }

  // ────────────────────────────────────────────
  // 辅助方法
  // ────────────────────────────────────────────

  /**
   * 将 XML returns 的 type 映射为 TypeScript 返回类型（Vue 端）
   * Vue 端使用 I${className} 作为实体接口（如 IUser）
   * 支持：
   *   - Entity → IUser
   *   - Entity[] → IUser[]
   *   - 基础类型 → string, number, boolean
   *   - 内联对象 → { list: IUser[]; total: number }
   */
  _mapReturnsType(returns, className) {
    if (!returns) return 'any';

    // 如果是对象（内联定义的返回结构）
    if (typeof returns === 'object' && returns.fields) {
      const fieldTypes = returns.fields.map(f => {
        const fieldType = this._mapReturnsType(f.type, className);
        return `  ${f.name}: ${fieldType};`;
      });
      return `{\n${fieldTypes.join('\n')}\n}`;
    }

    // 如果是字符串类型定义
    const returnType = returns;

    // 数组类型：Entity[]、string[] 等
    if (returnType.endsWith('[]')) {
      const baseType = returnType.slice(0, -2);
      const tsBase = this._mapReturnsType(baseType, className);
      return `${tsBase}[]`;
    }

    // 特殊类型映射（Vue 端使用 I 前缀的接口）
    // modelName 关键字：类型名等于 className 时，映射为 IUser
    if (returnType === className) return `I${className}`;
    if (returnType === `${className}[]`) return `I${className}[]`;

    // 基础类型
    const baseTypeMap = {
      'string': 'string',
      'number': 'number',
      'integer': 'number',
      'boolean': 'boolean',
      'object': 'Record<string, any>',
      'any': 'any',
    };
    if (baseTypeMap[returnType]) return baseTypeMap[returnType];

    // 自定义类型或未知类型，保持原样
    return returnType;
  }

  /**
   * 将 XML param 的 type 映射为 TypeScript 类型（Vue 端）
   */
  _mapParamType(paramType, className) {
    if (!paramType) return 'any';

    // 数组类型
    if (paramType.endsWith('[]')) {
      const baseType = paramType.slice(0, -2);
      const tsBase = this._mapParamType(baseType, className);
      return `${tsBase}[]`;
    }

    // 特殊类型映射（Vue 端）
    if (paramType === 'modelName') return `Partial<I${className}>`;

    // 自定义类型（如 ListQuery, DetailQuery）- 保持原样
    if (/^[A-Z]/.test(paramType)) return paramType;

    // 基础类型
    const baseTypeMap = {
      'string': 'string',
      'number': 'number',
      'integer': 'number',
      'boolean': 'boolean',
      'object': 'Record<string, any>',
      'any': 'any',
    };
    return baseTypeMap[paramType] || 'any';
  }

  _getDefaultValue(field) {
    // 支持 field.default 和 field.validation.default 两种写法
    const defaultValue = field.default !== undefined ? field.default : (field.validation?.default);
    if (defaultValue !== undefined && defaultValue !== '') {
      const d = defaultValue;
      // 判断是否为数组或对象（以 [ 或 { 开头）
      if (d.startsWith('[') || d.startsWith('{')) {
        return d;
      }
      if (['number', 'integer'].includes(field.type)) return d;
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
