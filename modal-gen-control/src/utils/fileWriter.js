/**
 * 文件写入工具
 * 负责将生成的代码写入到目标目录
 */

const fs = require('fs');
const path = require('path');

class FileWriter {
  /**
   * 写入文件，自动创建目录
   */
  write(filePath, content) {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * 写入前端生成物
   * vue-code/src/models/<module>/<name>/
   *   ├── <name>.model.ts
   *   ├── <name>.form.ts
   *   ├── <name>.table.ts
   *   └── <name>.api.ts
   */
  writeVueFiles(schema, vueOutput, vueRoot) {
    const { toKebabCase } = require('../utils/typeMapper');
    const kebab = toKebabCase(schema.name);
    const dir = path.join(vueRoot, 'src', 'models', schema.module, kebab);

    this.write(path.join(dir, `${kebab}.model.ts`), vueOutput.modelClass);
    this.write(path.join(dir, `${kebab}.form.ts`), vueOutput.formConfig);
    this.write(path.join(dir, `${kebab}.table.ts`), vueOutput.tableConfig);
    this.write(path.join(dir, `${kebab}.api.ts`), vueOutput.apiService);

    // 生成 index.ts 统一导出
    const indexContent = [
      `export * from './${kebab}.model';`,
      `export * from './${kebab}.form';`,
      `export * from './${kebab}.table';`,
      `export { default as ${schema.name}Api } from './${kebab}.api';`,
    ].join('\n');
    this.write(path.join(dir, 'index.ts'), indexContent);

    return dir;
  }

  /**
   * 写入后端生成物
   * nest-code/src/<module>/<name>/
   *   ├── <name>.entity.ts
   *   ├── <name>.service.ts
   *   ├── <name>.controller.ts
   *   ├── <name>.module.ts
   *   └── dto/
   *       ├── create-<name>.dto.ts
   *       └── update-<name>.dto.ts
   */
  writeNestFiles(schema, nestOutput, nestRoot) {
    const { toKebabCase } = require('../utils/typeMapper');
    const kebab = toKebabCase(schema.name);
    const dir = path.join(nestRoot, 'src', schema.module, kebab);

    this.write(path.join(dir, `${kebab}.entity.ts`), nestOutput.entity);
    this.write(path.join(dir, `${kebab}.service.ts`), nestOutput.service);
    this.write(path.join(dir, `${kebab}.controller.ts`), nestOutput.controller);
    this.write(path.join(dir, `${kebab}.module.ts`), nestOutput.module);
    this.write(path.join(dir, 'dto', `create-${kebab}.dto.ts`), nestOutput.createDto);
    this.write(path.join(dir, 'dto', `update-${kebab}.dto.ts`), nestOutput.updateDto);

    // 生成 index.ts
    const { toPascalCase } = require('../utils/typeMapper');
    const pascal = toPascalCase(schema.name);
    const indexContent = [
      `export * from './${kebab}.entity';`,
      `export * from './${kebab}.service';`,
      `export * from './${kebab}.controller';`,
      `export { ${pascal}Module } from './${kebab}.module';`,
    ].join('\n');
    this.write(path.join(dir, 'index.ts'), indexContent);

    return dir;
  }
}

module.exports = FileWriter;
