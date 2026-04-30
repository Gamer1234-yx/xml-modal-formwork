/**
 * 文件写入工具（generated/ 子目录模式）
 *
 * 文件结构：
 *   <module>/<name>/
 *   ├── generated/          ← 自动生成，每次覆盖
 *   │   ├── <name>.entity.ts
 *   │   ├── <name>.service.ts      (类名 <Name>ServiceBase)
 *   │   ├── <name>.controller.ts   (类名 <Name>ControllerBase)
 *   │   ├── <name>.module.ts       (类名 <Name>ModuleBase，导出 MODULE_BASE_CONFIG)
 *   │   └── dto/
 *   ├── <name>.service.ts   ← 手写业务代码，仅首次创建，继承 <Name>ServiceBase
 *   ├── <name>.controller.ts ← 手写接口逻辑，仅首次创建，继承 <Name>ControllerBase
 *   ├── <name>.module.ts    ← 手写模块配置，仅首次创建
 *   └── index.ts
 */
const fs   = require('fs');
const path = require('path');

class FileWriter {
  /**
   * 通用：写入文件，自动创建目录
   */
  write(filePath, content) {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content, 'utf-8');
  }

  /**
   * 仅当文件不存在时才写入（用于用户自定义文件）
   */
  writeIfNotExists(filePath, content) {
    if (fs.existsSync(filePath)) {
      return false; // 已存在，跳过
    }
    this.write(filePath, content);
    return true; // 新创建
  }

  // ─────────────────────────────────────────────
  // 前端：写入 Vue3 生成物
  // ─────────────────────────────────────────────
  writeVueFiles(schema, vueOutput, vueRoot) {
    const { toKebabCase } = require('../utils/typeMapper');
    const kebab = toKebabCase(schema.name);
    const baseDir = path.join(vueRoot, 'src', 'models', schema.module, kebab, 'generated');

    // 每次覆盖：generated/ 下所有文件（文件名无 .base 后缀）
    this.write(path.join(baseDir, `${kebab}.model.ts`),  vueOutput.modelClass);
    this.write(path.join(baseDir, `${kebab}.form.ts`),    vueOutput.formConfig);
    this.write(path.join(baseDir, `${kebab}.table.ts`),   vueOutput.tableConfig);
    this.write(path.join(baseDir, `${kebab}.api.ts`),     vueOutput.apiService);

    // 有类型定义时才写入 types.ts
    if (vueOutput.types && vueOutput.types.trim()) {
      this.write(path.join(baseDir, `${kebab}.types.ts`), vueOutput.types);
    }

    // 仅首次创建：用户自定义 api 文件（在 generated/ 的上级目录）
    const customDir   = path.dirname(baseDir);
    const apiCreated    = this.writeIfNotExists(
      path.join(customDir, `${kebab}.api.ts`),
      this._genVueApiCustom(schema)
    );

    // index.ts：每次覆盖，放在 generated/ 上级目录，统一导出
    const indexContent = [
      `export * from './generated/${kebab}.model';`,
      `export * from './generated/${kebab}.form';`,
      `export * from './generated/${kebab}.table';`,
      `export { default as ${schema.name}Api } from './${kebab}.api';`,
    ].join('\n');
    this.write(path.join(customDir, 'index.ts'), indexContent);

    return { dir: customDir, apiCreated };
  }

  /**
   * 生成 Vue 用户自定义 API 文件内容（导入 generated/ 下的 base）
   */
  _genVueApiCustom(schema) {
    const { toPascalCase, toKebabCase } = require('../utils/typeMapper');
    const className = toPascalCase(schema.name);
    const kebab = toKebabCase(schema.name);

    return [
      `/**`,
      ` * ${schema.label} API Service（自定义请求逻辑）`,
      ` * 此文件不会被生成器覆盖，请在此处编写自定义请求逻辑`,
      ` *`,
      ` * 使用方式：`,
      ` *   1. 重写方法：完全替换默认请求逻辑`,
      ` *   2. 调用 super.xxx()：复用默认逻辑，再追加处理`,
      ` *   3. 新增方法：添加完全自定义的接口调用`,
      ` */`,
      ``,
      `import { ${className}ApiBase } from './generated/${kebab}.api';`,
      `import type { I${className} } from './generated/${kebab}.model';`,
      ``,
      `class ${className}Api extends ${className}ApiBase {`,
      `  // 可在此处重写或扩展接口调用逻辑`,
      `  // 示例：`,
      `  // async list(params?: Record<string, any>) {`,
      `  //   // 自定义请求逻辑`,
      `  //   return super.list(params);`,
      `  // }`,
      `}`,
      ``,
      `const ${kebab}Api = new ${className}Api();`,
      `export default ${kebab}Api;`,
    ].join('\n');
  }

  // ─────────────────────────────────────────────
  // 后端：写入 NestJS 生成物
  // ─────────────────────────────────────────────
  writeNestFiles(schema, nestOutput, nestRoot) {
    const { toKebabCase, toPascalCase } = require('../utils/typeMapper');
    const kebab  = toKebabCase(schema.name);
    const pascal = toPascalCase(schema.name);
    const baseDir = path.join(nestRoot, 'src', schema.module, kebab, 'generated');
    const customDir = path.dirname(baseDir);

    // ── generated/ 下：每次覆盖 ──
    this.write(path.join(baseDir, `${kebab}.entity.ts`), nestOutput.entity);
    this.write(path.join(baseDir, 'dto', `create-${kebab}.dto.ts`), nestOutput.createDto);
    this.write(path.join(baseDir, 'dto', `update-${kebab}.dto.ts`), nestOutput.updateDto);
    this.write(path.join(baseDir, `${kebab}.service.ts`), nestOutput.service);
    this.write(path.join(baseDir, `${kebab}.controller.ts`), nestOutput.controller);
    this.write(path.join(baseDir, `${kebab}.module.ts`), nestOutput.module); // ModuleBase
    
    // 有类型定义时才写入 types.ts
    if (nestOutput.types && nestOutput.types.trim()) {
      this.write(path.join(baseDir, `${kebab}.types.ts`), nestOutput.types);
    }

    // ── 上级目录：仅首次创建，但会更新导入语句 ──
    const serviceFilePath = path.join(customDir, `${kebab}.service.ts`);
    let serviceCreated = false;
    if (fs.existsSync(serviceFilePath)) {
      // 文件已存在，更新导入语句
      const existingContent = fs.readFileSync(serviceFilePath, 'utf-8');
      const newContent = nestOutput.serviceCustom;
      
      // 构建类型导入的正则表达式（使用字符串模板）
      const typeImportRegex = new RegExp(`import type \\{ ([^}]+) \\} from './generated/${kebab}\\.types';`);
      
      // 提取新生成的类型导入语句
      const typeImportMatch = newContent.match(typeImportRegex);
      if (typeImportMatch) {
        const newTypeNames = typeImportMatch[1].split(',').map(n => n.trim());
        
        // 检查现有文件是否已经有类型导入
        const existingTypeImportMatch = existingContent.match(typeImportRegex);
        if (existingTypeImportMatch) {
          // 已有类型导入，检查是否需要添加新类型
          const existingTypeNames = existingTypeImportMatch[1].split(',').map(n => n.trim());
          const missingTypes = newTypeNames.filter(t => !existingTypeNames.includes(t));
          
          if (missingTypes.length > 0) {
            // 添加缺失的类型
            const updatedTypeNames = [...existingTypeNames, ...missingTypes].join(', ');
            const updatedContent = existingContent.replace(
              typeImportRegex,
              `import type { ${updatedTypeNames} } from './generated/${kebab}.types';`
            );
            if (updatedContent !== existingContent) {
              this.write(serviceFilePath, updatedContent);
            }
          }
        } else {
          // 没有类型导入，需要添加
          // 找到最后一个 import 语句的位置
          const importStatements = existingContent.match(/^(import .+;)$/gm);
          if (importStatements && importStatements.length > 0) {
            const lastImportIndex = existingContent.lastIndexOf(importStatements[importStatements.length - 1]);
            const lastImportEnd = lastImportIndex + importStatements[importStatements.length - 1].length;
            // 在最后一个 import 后面添加新的类型导入
            const updatedContent = existingContent.slice(0, lastImportEnd) + `\n// 导入可复用的参数类型和返回类型\nimport type { ${newTypeNames.join(', ')} } from './generated/${kebab}.types';` + existingContent.slice(lastImportEnd);
            if (updatedContent !== existingContent) {
              this.write(serviceFilePath, updatedContent);
            }
          }
        }
      }
    } else {
      // 文件不存在，创建新文件
      serviceCreated = this.writeIfNotExists(serviceFilePath, nestOutput.serviceCustom);
    }
    const controllerCreated = this.writeIfNotExists(
      path.join(customDir, `${kebab}.controller.ts`),
      nestOutput.controllerCustom,
    );
    const moduleCreated    = this.writeIfNotExists(
      path.join(customDir, `${kebab}.module.ts`),
      nestOutput.moduleCustom,
    );

    // index.ts：每次覆盖
    const indexLines = [];
    // 只有当 Entity 存在时才导出
    if (nestOutput.entity && nestOutput.entity.trim()) {
      indexLines.push(`export * from './generated/${kebab}.entity';`);
    }
    indexLines.push(`export * from './${kebab}.service';`);
    indexLines.push(`export * from './${kebab}.controller';`);
    indexLines.push(`export { ${pascal}Module } from './${kebab}.module';`);
    const indexContent = indexLines.join('\n');
    this.write(path.join(customDir, 'index.ts'), indexContent);

    return {
      dir: customDir,
      serviceCreated,
      controllerCreated,
      moduleCreated,
    };
  }
}

module.exports = FileWriter;
