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
 * @property {boolean} hidden - 是否隐藏
 * @property {boolean} tableVisible - 表格中是否显示
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
      if (apiNode.endpoint) {
        schema.api.endpoints = apiNode.endpoint.map(e => this._attr(e));
      }
    }

    return schema;
  }

  _parseField(fieldNode) {
    const attr = this._attr(fieldNode);
    const field = {
      name: attr.name || '',
      label: attr.label || '',
      type: attr.type || 'string',
      primary: attr.primary === 'true',
      hidden: attr.hidden === 'true',
      tableVisible: attr.tableVisible === 'true',
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
