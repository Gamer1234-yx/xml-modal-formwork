/**
 * XML Modal 解析器
 * 将 XML 定义解析为标准 ModalSchema 对象
 */

const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

/**
 * @typedef {Object} FieldSchema
 * @property {string} name - 字段名
 * @property {string} label - 中文标签
 * @property {string} type - 字段类型
 * @property {boolean} primary - 是否主键
 * @property {boolean} visible - 是否显示（默认 true，设置 visible="false" 可隐藏）
 * @property {boolean} searchable - 是否可搜索
 * @property {boolean} readonly - 是否只读
 * @property {Object} validation - 校验规则
 * @property {Array}  options - 选项列表（select类型）
 * @property {Object} remoteOptions - 远程选项配置
 */

/**
 * @typedef {Object} ModalSchema
 * @property {string} name
 * @property {string} label
 * @property {string} type  - 'form' | 'table' | 'both'
 * @property {string} module
 * @property {string} description
 * @property {FieldSchema[]} fields
 * @property {Object} table
 * @property {Object} form
 * @property {Object} api
 */

class XmlParser {
  /**
   * 解析单个 XML 文件
   * @param {string} xmlFilePath
   * @returns {Promise<ModalSchema>}
   */
  async parse(xmlFilePath) {
    const content = fs.readFileSync(xmlFilePath, 'utf-8');
    const parser = new xml2js.Parser({ explicitArray: true, mergeAttrs: false });
    const raw = await parser.parseStringPromise(content);
    return this._transform(raw.modal, xmlFilePath);
  }

  /**
   * 批量解析目录下所有 XML
   * @param {string} xmlDir
   * @returns {Promise<ModalSchema[]>}
   */
  async parseDir(xmlDir) {
    const files = fs.readdirSync(xmlDir).filter(f => f.endsWith('.xml'));
    const results = [];
    for (const file of files) {
      const schema = await this.parse(path.join(xmlDir, file));
      results.push(schema);
    }
    return results;
  }

  _attr(node) {
    return (node && node.$) ? node.$ : {};
  }

  _text(node) {
    if (!node) return '';
    if (Array.isArray(node)) return this._text(node[0]);
    if (typeof node === 'string') return node;
    if (node._) return node._;
    return '';
  }

  _transform(raw, filePath) {
    const rootAttr = this._attr(raw);

    const schema = {
      name: rootAttr.name || '',
      label: rootAttr.label || '',
      type: rootAttr.type || 'form',
      module: rootAttr.module || 'common',
      description: this._text(raw.description),
      fields: [],
      table: {},
      form: {},
      api: { prefix: '', endpoints: [] },
      sourceFile: path.basename(filePath),
    };

    // 解析 fields
    if (raw.fields && raw.fields[0] && raw.fields[0].field) {
      schema.fields = raw.fields[0].field.map(f => this._parseField(f));
    }

    // 解析 table
    if (raw.table && raw.table[0]) {
      schema.table = this._attr(raw.table[0]);
    }

    // 解析 form
    if (raw.form && raw.form[0]) {
      schema.form = this._attr(raw.form[0]);
    }

    // 解析 api
    if (raw.api && raw.api[0]) {
      const apiNode = raw.api[0];
      schema.api.prefix = this._attr(apiNode).prefix || '';
      
      // 解析 <type> 定义（可复用的参数类型）
      schema.api.types = [];
      if (apiNode.type) {
        schema.api.types = apiNode.type.map(t => {
          const typeDef = this._attr(t);
          typeDef.params = [];
          if (t.param) {
            typeDef.params = t.param.map(p => this._attr(p));
          }
          return typeDef;
        });
      }
      
      // 解析 <endpoint> 定义
      if (apiNode.endpoint) {
        schema.api.endpoints = apiNode.endpoint.map(e => {
          const endpoint = this._attr(e);
          // 解析 endpoint 下的 <param> 标签（请求参数）
          endpoint.params = [];
          if (e.param) {
            endpoint.params = e.param.map(p => this._attr(p));
          }
          
          // 解析 endpoint 的 returns 属性（简单返回类型）
          // 例如：<endpoint action="list" returns="IUser[]" ... />
          endpoint.returns = endpoint.returns || null;

          // 解析 endpoint 下的 <returns> 标签（复杂返回类型定义）
          // 支持两种方式：
          //   1. <returns type="IUser[]" />  - 引用类型
          //   2. <returns> <field name="list" type="IUser[]" /> ... </returns> - 内联定义
          //   3. 关键字：returnType → 引用 schema.returnType（如 IUser）
          //              returnType[] → 数组形式（如 IUser[]）
          if (e.returns) {
            const returnsNode = e.returns[0];
            const returnsAttr = this._attr(returnsNode);

            let rawType = null;
            if (returnsAttr.type) {
              // 方式1：<returns type="..." />
              rawType = returnsAttr.type;
            } else if (returnsNode.field) {
              // 方式2：内联定义返回结构
              const fields = returnsNode.field.map(f => this._attr(f));
              // 将字段中的 modelName / modelName[] 替换为实际类型（schema.name）
              fields.forEach(f => {
                if (f.type === 'modelName') f.type = schema.name;
                else if (f.type === 'modelName[]') f.type = `${schema.name}[]`;
              });
              endpoint.returns = { type: 'object', fields };
            } else {
              // 如果没有 type 也没有 field，可能是简单文本
              rawType = this._text(returnsNode) || endpoint.returns;
            }

            // 替换关键字 modelName / modelName[]
            if (rawType === 'modelName') {
              endpoint.returns = schema.name;
            } else if (rawType === 'modelName[]') {
              endpoint.returns = `${schema.name}[]`;
            } else if (rawType) {
              endpoint.returns = rawType;
            }
          }
          
          return endpoint;
        });
      }
    }

    return schema;
  }

  _parseField(fieldNode) {
    const attr = this._attr(fieldNode);
    // 使用 visible 字段表示是否显示，默认显示（visible="true"）
    const field = {
      name: attr.name || '',
      label: attr.label || '',
      type: attr.type || 'string',
      default: attr.default,
      primary: attr.primary === 'true',
      visible: attr.visible !== 'false',
      searchable: attr.searchable === 'true',
      readonly: attr.readonly === 'true',
      validation: {},
      options: [],
      remoteOptions: null,
    };

    // 解析 validation
    if (fieldNode.validation && fieldNode.validation[0]) {
      field.validation = this._attr(fieldNode.validation[0]);
    }

    // 解析静态 options
    if (fieldNode.options && fieldNode.options[0] && fieldNode.options[0].option) {
      field.options = fieldNode.options[0].option.map(o => this._attr(o));
    }

    // 解析远程 options
    if (fieldNode.remoteOptions && fieldNode.remoteOptions[0]) {
      field.remoteOptions = this._attr(fieldNode.remoteOptions[0]);
    }

    return field;
  }
}

module.exports = XmlParser;
