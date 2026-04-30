/**
 * NestJS 后端代码生成器（generated/ 子目录模式）
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
 *   ├── <name>.module.ts    ← 手写模块配置，仅首次创建，可自定义
 *   └── index.ts
 */
const { toSnakeCase, toPascalCase, toKebabCase } = require('../utils/typeMapper');

class NestCodeGenerator {
  generate(schema) {
    return {
      entity:           this.genEntity(schema),
      createDto:        this.genCreateDto(schema),
      updateDto:        this.genUpdateDto(schema),
      types:            this.genTypes(schema),              // generated/types.ts
      service:          this.genServiceBase(schema),
      serviceCustom:    this.genServiceCustom(schema),
      controller:       this.genControllerBase(schema),
      controllerCustom: this.genControllerCustom(schema),
      module:           this.genModuleBase(schema),       // generated/<name>.module.ts
      moduleCustom:     this.genModuleCustom(schema),     // <name>.module.ts（仅首次创建）
    };
  }

  // ─────────────────────────────────────────────────────
  // 1b. Types（可复用的参数类型 + 返回类型，每次覆盖）
  // ─────────────────────────────────────────────────────
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
    const kebab = toKebabCase(schema.name);
    const lines = [
      `/**`,
      ` * ${schema.label} 可复用的参数类型和返回类型`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` * ⚠️ 此文件每次重新生成都会被覆盖`,
      ` */`,
      ``,
      `import type { ${className}Entity } from './${kebab}.entity';`,
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

  // ─────────────────────────────────────────────────────
  // 1. Entity（每次覆盖，在 generated/ 下）
  // ─────────────────────────────────────────────────────
  genEntity(schema) {
    const className = toPascalCase(schema.name);
    const tableName = toSnakeCase(schema.name);
    const lines = [
      `/**`,
      ` * ${schema.label} 实体`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` * ⚠️ 此文件每次重新生成都会被覆盖，请勿在此写业务逻辑`,
      ` */`,
      ``,
      `import {`,
      `  Entity, PrimaryGeneratedColumn, Column,`,
      `  CreateDateColumn, UpdateDateColumn,`,
      `} from 'typeorm';`,
      ``,
      `@Entity('${tableName}')`,
      `export class ${className}Entity {`,
    ];

    for (const field of schema.fields) {
      if (field.name === 'createdAt' || field.name === 'updatedAt') continue;

      lines.push(`  /** ${field.label} */`);

      if (field.primary) {
        lines.push(`  @PrimaryGeneratedColumn()`);
        lines.push(`  ${field.name}: number;`);
        lines.push(``);
        continue;
      }

      const nullable   = field.validation.required !== 'true';
      const sqliteType = this._getSqliteType(field.type);
      const colOptions = [`type: '${sqliteType}'`];

      if (nullable) colOptions.push(`nullable: true`);
      if (field.validation.default !== undefined) {
        const def = isNaN(field.validation.default)
          ? `'${field.validation.default}'`
          : field.validation.default;
        colOptions.push(`default: ${def}`);
      }

      lines.push(`  @Column(${colOptions.length ? `{ ${colOptions.join(', ')} }` : ''})`);
      lines.push(`  ${field.name}: ${this._getTsType(field.type)};`);
      lines.push(``);
    }

    if (schema.fields.find(f => f.name === 'createdAt')) {
      lines.push(`  /** 创建时间 */`);
      lines.push(`  @CreateDateColumn({ name: 'created_at' })`);
      lines.push(`  createdAt: Date;`);
      lines.push(``);
    }
    if (schema.fields.find(f => f.name === 'updatedAt')) {
      lines.push(`  /** 更新时间 */`);
      lines.push(`  @UpdateDateColumn({ name: 'updated_at' })`);
      lines.push(`  updatedAt: Date;`);
      lines.push(``);
    }

    lines.push(`}`);
    return lines.join('\n');
  }

  // ─────────────────────────────────────────────────────
  // 2. CreateDTO（每次覆盖，在 generated/ 下）
  // ─────────────────────────────────────────────────────
  genCreateDto(schema) {
    const className = toPascalCase(schema.name);
    const decorators = new Set(['IsOptional']);
    const fieldLines = [];

    for (const field of schema.fields) {
      if (field.primary || field.readonly || field.name === 'createdAt' || field.name === 'updatedAt') continue;
      const v = field.validation;
      const decs = [];

      if (v.required === 'true') {
        decs.push(`  @IsNotEmpty({ message: '${v.message || field.label + '不能为空'}' })`);
        decorators.add('IsNotEmpty');
      } else {
        decs.push(`  @IsOptional()`);
      }

      if (['string','password','textarea','richtext'].includes(field.type)) {
        decs.push(`  @IsString()`);
        decorators.add('IsString');
        if (v.minLength) { decs.push(`  @MinLength(${v.minLength})`); decorators.add('MinLength'); }
        if (v.maxLength) { decs.push(`  @MaxLength(${v.maxLength})`); decorators.add('MaxLength'); }
      }
      if (field.type === 'email') {
        decs.push(`  @IsEmail({}, { message: '${v.message || '邮箱格式不正确'}' })`);
        decorators.add('IsEmail');
      }
      if (['number','integer'].includes(field.type)) {
        decs.push(`  @IsNumber()`);
        decorators.add('IsNumber');
        if (v.min !== undefined) { decs.push(`  @Min(${v.min})`); decorators.add('Min'); }
        if (v.max !== undefined) { decs.push(`  @Max(${v.max})`); decorators.add('Max'); }
      }

      fieldLines.push(`  /** ${field.label} */`);
      fieldLines.push(...decs);
      fieldLines.push(`  ${field.name}${v.required === 'true' ? '' : '?'}: ${this._getTsType(field.type)};`);
      fieldLines.push(``);
    }

    const importDecs = [...decorators].join(', ');
    return [
      `/**`,
      ` * ${schema.label} CreateDTO`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` */`,
      ``,
      `import { ${importDecs} } from 'class-validator';`,
      `import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';`,
      ``,
      `export class Create${className}Dto {`,
      ...fieldLines,
      `}`,
    ].join('\n');
  }

  // ─────────────────────────────────────────────────────
  // 3. UpdateDTO（每次覆盖，在 generated/ 下）
  // ─────────────────────────────────────────────────────
  genUpdateDto(schema) {
    const className = toPascalCase(schema.name);
    const kebab = toKebabCase(schema.name);
    return [
      `/**`,
      ` * ${schema.label} UpdateDTO`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` */`,
      ``,
      `import { PartialType } from '@nestjs/swagger';`,
      `import { Create${className}Dto } from './create-${kebab}.dto';`,
      ``,
      `export class Update${className}Dto extends PartialType(Create${className}Dto) {}`,
    ].join('\n');
  }

  // ─────────────────────────────────────────────────────
  // 4. Service（标准实现，每次覆盖，在 generated/ 下）
  // ─────────────────────────────────────────────────────
  genServiceBase(schema) {
    const className = toPascalCase(schema.name);
    const kebab = toKebabCase(schema.name);

    const lines = [
      `/**`,
      ` * ${schema.label} Service（标准实现）`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` * ⚠️ 此文件每次重新生成都会被覆盖，请勿在此写业务逻辑`,
      ` *    自定义逻辑请写在上级目录的 ${kebab}.service.ts 中`,
      ` */`,
      ``,
      `import { Injectable, NotFoundException } from '@nestjs/common';`,
      `import { InjectRepository } from '@nestjs/typeorm';`,
      `import { Repository } from 'typeorm';`,
      `import { ${className}Entity } from './${kebab}.entity';`,
      ``,
      `@Injectable()`,
      `export class ${className}ServiceBase {`,
      `  constructor(`,
      `    @InjectRepository(${className}Entity)`,
      `    protected readonly repo: Repository<${className}Entity>,`,
      `  ) {}`,
      ``,
      `  /** 查询列表 */`,
      `  async findAll(query: any): Promise<any> {`,
      `    const { page = 1, pageSize = 20 } = query || {};`,
      `    const [list, total] = await this.repo.findAndCount({`,
      `      skip: (page - 1) * pageSize,`,
      `      take: pageSize,`,
      `      order: { id: 'DESC' },`,
      `    });`,
      `    return { list, total, page: +page, pageSize: +pageSize };`,
      `  }`,
      ``,
      `  /** 查询单条 */`,
      `  async findOne(id: number): Promise<${className}Entity> {`,
      `    const record = await this.repo.findOne({ where: { id } });`,
      `    if (!record) throw new NotFoundException(\`${schema.label} id=\${id} 不存在\`);`,
      `    return record;`,
      `  }`,
      ``,
      `  /** 新建 */`,
      `  async create(body: Partial<${className}Entity>): Promise<${className}Entity> {`,
      `    const entity = this.repo.create(body);`,
      `    return this.repo.save(entity);`,
      `  }`,
      ``,
      `  /** 更新 */`,
      `  async update(body: Partial<${className}Entity>): Promise<${className}Entity> {`,
      `    await this.findOne(body.id);`,
      `    await this.repo.update(body.id, body);`,
      `    return this.findOne(body.id);`,
      `  }`,
      ``,
      `  /** 删除 */`,
      `  async remove(id: number): Promise<{ message: string }> {`,
      `    await this.findOne(id);`,
      `    await this.repo.delete(id);`,
      `    return { message: '删除成功' };`,
      `  }`,
      ``,
    ];
    const hasUseActionList = ['create', 'update', 'remove', 'findOne', 'findAll'];
    for (const ep of schema.api.endpoints) {
      const action = ep.action;

      let returnType = this._mapReturnsType(ep.returns, className);
      if (returnType.startsWith('{')) {
        // 使用类型别名
        const aliasName = `${className}${this._toPascalCase(action)}Return`;
        returnType = aliasName;
      }
      const returnAnnotation = `Promise<${returnType}>`;

      // 根据 endpoint 的 <param> 定义生成方法签名
      const params = ep.params || [];
      
      // 统一生成方法签名
      let paramDef = 'body: any';
      let callArg = 'body';
      
      if (params.length > 0) {
        // 单个参数：直接使用参数名和类型
        if (params.length === 1) {
          const p = params[0];
          const type = this._mapParamType(p.type, className);
          paramDef = `${p.name}: ${type}`;
          callArg = p.name;
        } else {
          // 多个参数：使用对象类型
          const paramSig = params.map(p => {
            const type = this._mapParamType(p.type, className);
            const isRequired = p.required === 'true';
            return `${p.name}${isRequired ? '' : '?'}: ${type}`;
          }).join(', ');
          paramDef = `body: { ${paramSig} }`;
          callArg = 'body';
        }
      }
      if (!hasUseActionList.includes(action)) {
        lines.push(`  /** ${ep.description || action} */`);
        lines.push(`  async ${action}(${paramDef}): ${returnAnnotation} {`);
        lines.push(`    // TODO: 实现 ${action} 方法的业务逻辑`);
        lines.push(`    return void 0 as ${returnType}`);
        lines.push(`  }`);
      }
    }
    lines.push(`}`);
    return lines.join('\n');
    
  }

  // ─────────────────────────────────────────────────────
  // 4b. Service CUSTOM（仅首次创建，在 generated/ 上级目录）
  // ─────────────────────────────────────────────────────
  genServiceCustom(schema) {
    const className = toPascalCase(schema.name);
    const kebab = toKebabCase(schema.name);

    return [
      `/**`,
      ` * ${schema.label} Service（自定义业务逻辑）`,
      ` * 此文件不会被生成器覆盖，请在此处编写自定义查询逻辑`,
      ` *`,
      ` * 使用方式：`,
      ` *   1. 直接重写基类方法（会完全替换基类逻辑）`,
      ` *   2. 调用 super.xxx() 复用基类逻辑，再追加自定义处理`,
      ` *   3. 新增完全自定义的方法`,
      ` *`,
      ` * 示例：`,
      ` *   async findAll(query?: Record<string, any>) {`,
      ` *     // 自定义：追加权限过滤、联表查询等`,
      ` *     return super.findAll(query);`,
      ` *   }`,
      ` */`,
      ``,
      `import { Injectable } from '@nestjs/common';`,
      `import { ${className}ServiceBase } from './generated/${kebab}.service';`,
      `import { Create${className}Dto } from './generated/dto/create-${kebab}.dto';`,
      `import { Update${className}Dto } from './generated/dto/update-${kebab}.dto';`,
      ``,
      `@Injectable()`,
      `export class ${className}Service extends ${className}ServiceBase {`,
      `  // 可在此处重写或扩展业务逻辑`,
      `  // 示例：自定义查询逻辑`,
      `  // async findAll(query?: Record<string, any>) {`,
      `  //   // 在这里加自定义过滤逻辑`,
      `  //   return super.findAll(query);`,
      `  // }`,
      `}`,
    ].join('\n');
  }

  // ─────────────────────────────────────────────────────
  // 5. Controller（标准接口，每次覆盖，在 generated/ 下）
  // ─────────────────────────────────────────────────────
  genControllerBase(schema) {
    const className = toPascalCase(schema.name);
    const kebab = toKebabCase(schema.name);
    const camel = schema.name.charAt(0).toLowerCase() + schema.name.slice(1);
    const prefix = schema.api.prefix.replace(/^\/api\//, '');

    // 收集所有需要导入的类型名（参数类型 + 返回类型别名）
    const allTypeNames = this._getAllTypeNames(schema);

    const lines = [
      `/**`,
      ` * ${schema.label} Controller（标准接口）`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` * ⚠️ 此文件每次重新生成都会被覆盖，请勿在此写业务逻辑`,
      ` *    自定义接口逻辑请写在上级目录的 ${kebab}.controller.ts 中`,
      ` */`,
      ``,
      `import { Controller, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';`,
      `import { ApiTags, ApiOperation } from '@nestjs/swagger';`,
      `// 注入自定义 Service（位于上级目录），以确保自定义逻辑生效`,
      `import { ${className}Service } from '../${kebab}.service';`,
      `import { ${className}Entity } from './${kebab}.entity';`,
      `import { Create${className}Dto } from './dto/create-${kebab}.dto';`,
      `import { Update${className}Dto } from './dto/update-${kebab}.dto';`,
      `// 导入可复用的参数类型和返回类型`,
      allTypeNames.length > 0 ? `import type { ${allTypeNames.join(', ')} } from './${kebab}.types';` : ``,
      ``,
      `@ApiTags('${schema.label}')`,
      `@Controller('${prefix}')`,
      `export class ${className}ControllerBase {`,
      `  constructor(protected readonly ${camel}Service: ${className}Service) {}`,
      ``,
    ];

    // 遍历所有 endpoint，生成对应路由
    // 规则：
    //   1. 统一使用 POST 方法
    //   2. path 默认为 `/${action}`（如果 XML 未指定 path）
    //   3. 根据 <param> 定义生成方法签名（支持引用类型）
    //   4. 根据 <returns> 定义生成返回类型注解
    for (const ep of schema.api.endpoints) {
      const action = ep.action;
      // path 默认为 `/${action}`
      const path = ep.path || `/${action}`;
      // 去掉前导斜杠，作为路由参数
      const routePath = path.replace(/^\//, '');
      const decArgs = `'${routePath}'`;

      lines.push(`  @ApiOperation({ summary: '${ep.description || action}' })`);
      lines.push(`  @Post(${decArgs})`);

      // 根据 endpoint 的 <returns> 定义生成返回类型
      // 如果使用类型别名（内联对象类型），从 types.ts 导入
      let returnType = this._mapReturnsType(ep.returns, className);
      if (returnType.startsWith('{')) {
        // 使用类型别名
        const aliasName = `${className}${this._toPascalCase(action)}Return`;
        returnType = aliasName;
      }
      const returnAnnotation = `Promise<${returnType}>`;

      // 根据 endpoint 的 <param> 定义生成方法签名
      const params = ep.params || [];
      
      // 统一生成方法签名
      let paramDef = 'body: any';
      let callArg = 'body';
      
      if (params.length > 0) {
        // 单个参数：直接使用参数名和类型
        if (params.length === 1) {
          const p = params[0];
          const type = this._mapParamType(p.type, className);
          paramDef = `${p.name}: ${type}`;
          callArg = p.name;
        } else {
          // 多个参数：使用对象类型
          const paramSig = params.map(p => {
            const type = this._mapParamType(p.type, className);
            const isRequired = p.required === 'true';
            return `${p.name}${isRequired ? '' : '?'}: ${type}`;
          }).join(', ');
          paramDef = `body: { ${paramSig} }`;
          callArg = 'body';
        }
      }
      
      lines.push(`  async ${action}(@Body() ${paramDef}): ${returnAnnotation} {`);
      lines.push(`    return this.${camel}Service.${action}(${callArg});`);
      lines.push(`  }`);
      lines.push(``);
    }

    lines.push(`}`);
    return lines.join('\n');
  }

  // ─────────────────────────────────────────────────────
  // 5b. Controller CUSTOM（仅首次创建，在 generated/ 上级目录）
  // ─────────────────────────────────────────────────────
  genControllerCustom(schema) {
    const className = toPascalCase(schema.name);
    const kebab = toKebabCase(schema.name);
    const prefix = schema.api.prefix.replace(/^\/api\//, '');

    return [
      `/**`,
      ` * ${schema.label} Controller（自定义接口逻辑）`,
      ` * 此文件不会被生成器覆盖，请在此处编写自定义接口逻辑`,
      ` *`,
      ` * 使用方式：`,
      ` *   1. 直接重写基类接口方法`,
      ` *   2. 新增自定义接口（记得加 @Get/@Post 等装饰器）`,
      ` */`,
      ``,
      `import { Controller, ParseIntPipe } from '@nestjs/common';`,
      `import { ApiTags } from '@nestjs/swagger';`,
      `import { ${className}ControllerBase } from './generated/${kebab}.controller';`,
      `import { Create${className}Dto } from './generated/dto/create-${kebab}.dto';`,
      `import { Update${className}Dto } from './generated/dto/update-${kebab}.dto';`,
      ``,
      `@ApiTags('${schema.label}')`,
      `@Controller('${prefix}')`,
      `export class ${className}Controller extends ${className}ControllerBase {`,
      `  // 可在此处重写接口逻辑，或新增自定义接口`,
      `}`,
    ].join('\n');
  }

  // ─────────────────────────────────────────────────────
  // 6. Module BASE（每次覆盖，在 generated/ 下）
  //    导出 MODULE_BASE_CONFIG 供自定义模块使用
  // ─────────────────────────────────────────────────────
  genModuleBase(schema) {
    const className = toPascalCase(schema.name);
    const kebab = toKebabCase(schema.name);
    const constName = `${className.toUpperCase()}_MODULE_BASE_CONFIG`;

    return [
      `/**`,
      ` * ${schema.label} Module（标准实现）`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` * ⚠️ 此文件每次重新生成都会被覆盖`,
      ` *    自定义模块配置请修改上级目录的 ${kebab}.module.ts`,
      ` */`,
      ``,
      `import { Module } from '@nestjs/common';`,
      `import { TypeOrmModule } from '@nestjs/typeorm';`,
      `import { ${className}Entity } from './${kebab}.entity';`,
      `import { ${className}Service } from '../${kebab}.service';`,
      `import { ${className}Controller } from '../${kebab}.controller';`,
      ``,
      `export const ${constName} = {`,
      `  imports: [TypeOrmModule.forFeature([${className}Entity])],`,
      `  controllers: [${className}Controller],`,
      `  providers: [${className}Service],`,
      `  exports: [${className}Service],`,
      `};`,
      ``,
      `@Module(${constName})`,
      `export class ${className}ModuleBase {}`,
    ].join('\n');
  }

  // ─────────────────────────────────────────────────────
  // 6b. Module CUSTOM（仅首次创建，在 generated/ 上级目录）
  // ─────────────────────────────────────────────────────
  genModuleCustom(schema) {
    const className = toPascalCase(schema.name);
    const kebab = toKebabCase(schema.name);
    const constName = `${className.toUpperCase()}_MODULE_BASE_CONFIG`;

    return [
      `/**`,
      ` * ${schema.label} Module（自定义模块配置）`,
      ` * 此文件不会被生成器覆盖，请在此处自定义模块注册`,
      ` *`,
      ` * 使用方式：`,
      ` *   1. 在 config 中添加 imports / providers / controllers / exports`,
      ` *   2. 导入其他模块`,
      ` *   3. 注册自定义 Provider`,
      ` */`,
      ``,
      `import { Module } from '@nestjs/common';`,
      `import { ${constName}, ${className}ModuleBase } from './generated/${kebab}.module';`,
      ``,
      `// 自定义：可在此处添加更多 imports / providers`,
      `const config = { ...${constName} };`,
      ``,
      `@Module(config)`,
      `export class ${className}Module {}`,
    ].join('\n');
  }

  // ─────────────────────────────────────────────────────
  // 工具方法
  // ─────────────────────────────────────────────────────

  /**
   * 将 XML param 的 type 映射为 TypeScript 类型
   * 支持基础类型、数组类型、复杂类型（如 CreateDto、UpdateDto）、自定义类型
   */
  _mapParamType(paramType, className) {
    if (!paramType) return 'any';
    
    // 数组类型：number[]、string[] 等
    if (paramType.endsWith('[]')) {
      const baseType = paramType.slice(0, -2);
      const tsBase = this._mapSimpleType(baseType);
      return `${tsBase}[]`;
    }

    // 复杂类型：CreateDto、UpdateDto、Entity、或 modelName
    if (paramType === 'CreateDto') return `Create${className}Dto`;
    if (paramType === 'UpdateDto') return `Update${className}Dto`;
    if (paramType === 'Entity')   return `${className}Entity`;
    if (paramType === 'modelName') return `Partial<${className}Entity>`;

    // 自定义类型：ListQuery、DetailQuery 等（首字母大写的类型名）
    if (/^[A-Z]/.test(paramType)) return paramType;

    // 基础类型
    return this._mapSimpleType(paramType);
  }

  /**
   * 将 XML returns 的 type 映射为 TypeScript 返回类型
   * 支持：
   *   - Entity → UserEntity
   *   - Entity[] → UserEntity[]
   *   - CreateDto → CreateUserDto
   *   - 基础类型 → string, number, boolean
   *   - 自定义类型 → ListResult 等
   *   - 内联对象 → { list: UserEntity[]; total: number }
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

    // 特殊类型映射
    // modelName 关键字：类型名等于 className 时，映射为 UserEntity
    if (returnType === className) {
      return `${className}Entity`;
    }
    if (returnType === `${className}[]`) {
      return `${className}Entity[]`;
    }
    // 如果类型名以 I 开头（如 IUser），则映射为 UserEntity
    if (/^I[A-Z]/.test(returnType)) {
      const entityName = returnType.slice(1);
      return `${entityName}Entity`;
    }
    if (returnType === 'CreateDto') return `Create${className}Dto`;
    if (returnType === 'UpdateDto') return `Update${className}Dto`;
    
    // 自定义类型或基础类型
    if (/^[A-Z]/.test(returnType)) return returnType;
    
    return this._mapSimpleType(returnType);
  }

  /**
   * 从 schema.api.types 中提取所有类型名，生成 import 语句
   * 例如： "ListQuery, DetailQuery, DeleteQuery"
   */
  _getTypeNames(schema) {
    const types = schema.api.types || [];
    if (types.length === 0) return '';
    
    return types.map(t => {
      const typeName = t.name || 'UnnamedType';
      return toPascalCase(typeName);
    }).join(', ');
  }

  /**
   * 收集所有需要导入的类型名（参数类型 + 返回类型别名）
   * 用于 Controller 和 Service 的 import 语句
   */
  _getAllTypeNames(schema) {
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

  _mapSimpleType(type) {
    const map = {
      'string': 'string',
      'number': 'number',
      'integer': 'number',
      'boolean': 'boolean',
      'object': 'Record<string, any>',
      'any': 'any',
    };
    return map[type] || 'any';
  }

  /**
   * 辅助：将字符串转为 PascalCase
   */
  _toPascalCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  _getSqliteType(xmlType) {
    const map = {
      string: 'text', number: 'real', integer: 'integer',
      boolean: 'integer', email: 'text', password: 'text',
      date: 'text', datetime: 'text', select: 'text',
      textarea: 'text', richtext: 'text', image: 'text',
      'image-list': 'text', file: 'text',
    };
    return map[xmlType] || 'text';
  }

  _getTsType(xmlType) {
    const map = {
      string: 'string', number: 'number', integer: 'number',
      boolean: 'boolean', email: 'string', password: 'string',
      date: 'string', datetime: 'string', select: 'string',
      textarea: 'string', richtext: 'string', image: 'string',
      'image-list': 'string', file: 'string',
    };
    return map[xmlType] || 'string';
  }
}

module.exports = NestCodeGenerator;
