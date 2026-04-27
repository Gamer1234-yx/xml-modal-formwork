/**
 * 类型映射工具
 * XML类型 → TypeScript类型 / Vue表单组件 / NestJS装饰器
 */

const TYPE_MAP = {
  // XML type → { ts, java, formComponent, dbColumn }
  string:     { ts: 'string',   java: 'String',         formComp: 'ElInput',         db: 'VARCHAR(255)' },
  number:     { ts: 'number',   java: 'BigDecimal',      formComp: 'ElInputNumber',   db: 'DECIMAL(18,4)' },
  integer:    { ts: 'number',   java: 'Integer',         formComp: 'ElInputNumber',   db: 'INT' },
  boolean:    { ts: 'boolean',  java: 'Boolean',         formComp: 'ElSwitch',        db: 'TINYINT(1)' },
  email:      { ts: 'string',   java: 'String',          formComp: 'ElInput',         db: 'VARCHAR(255)' },
  password:   { ts: 'string',   java: 'String',          formComp: 'ElInput',         db: 'VARCHAR(255)' },
  date:       { ts: 'string',   java: 'LocalDate',       formComp: 'ElDatePicker',    db: 'DATE' },
  datetime:   { ts: 'string',   java: 'LocalDateTime',   formComp: 'ElDatePicker',    db: 'DATETIME' },
  select:     { ts: 'string | number', java: 'Object',  formComp: 'ElSelect',        db: 'VARCHAR(64)' },
  textarea:   { ts: 'string',   java: 'String',          formComp: 'ElInput',         db: 'TEXT' },
  richtext:   { ts: 'string',   java: 'String',          formComp: 'RichTextEditor',  db: 'LONGTEXT' },
  image:      { ts: 'string',   java: 'String',          formComp: 'ImageUpload',     db: 'VARCHAR(512)' },
  'image-list': { ts: 'string[]', java: 'List<String>', formComp: 'ImageListUpload', db: 'JSON' },
  file:       { ts: 'string',   java: 'String',          formComp: 'FileUpload',      db: 'VARCHAR(512)' },
};

/**
 * 根据 XML type 获取 TypeScript 类型
 */
function getTsType(xmlType) {
  return (TYPE_MAP[xmlType] || TYPE_MAP.string).ts;
}

/**
 * 根据 XML type 获取 Java/NestJS 类型
 */
function getJavaType(xmlType) {
  return (TYPE_MAP[xmlType] || TYPE_MAP.string).java;
}

/**
 * 根据 XML type 获取 Vue 表单组件名
 */
function getFormComponent(xmlType) {
  return (TYPE_MAP[xmlType] || TYPE_MAP.string).formComp;
}

/**
 * 根据 XML type 获取数据库列类型
 */
function getDbColumnType(xmlType) {
  return (TYPE_MAP[xmlType] || TYPE_MAP.string).db;
}

/**
 * 将 camelCase 字段名转为 snake_case（数据库列名）
 */
function toSnakeCase(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

/**
 * 将 camelCase 转为 PascalCase（类名）
 */
function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 将 PascalCase 转为 kebab-case（URL路径）
 */
function toKebabCase(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
}

module.exports = { getTsType, getJavaType, getFormComponent, getDbColumnType, toSnakeCase, toPascalCase, toKebabCase, TYPE_MAP };
