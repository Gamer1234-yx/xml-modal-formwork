/**
 * NestJS 后端代码生成器
 * 根据 ModalSchema 生成：
 *   1. Entity (TypeORM)
 *   2. DTO (class-validator)
 *   3. Service
 *   4. Controller
 *   5. Module
 */

const { toSnakeCase, toPascalCase, toKebabCase } = require('../utils/typeMapper');

class NestCodeGenerator {
  generate(schema) {
    return {
      entity: this.genEntity(schema),
      createDto: this.genCreateDto(schema),
      updateDto: this.genUpdateDto(schema),
      service: this.genService(schema),
      controller: this.genController(schema),
      module: this.genModule(schema),
    };
  }

  // ─────────────────────────────────────────────────────
  // 1. Entity
  // ─────────────────────────────────────────────────────
  genEntity(schema) {
    const className = toPascalCase(schema.name);
    const tableName = toSnakeCase(schema.name);
    const lines = [
      `/**`,
      ` * ${schema.label} 实体`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
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

      const nullable = field.validation.required !== 'true';
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

    // createdAt / updatedAt
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
  // 2. CreateDTO
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

      if (field.type === 'string' || field.type === 'password' || field.type === 'textarea' || field.type === 'richtext') {
        decs.push(`  @IsString()`);
        decorators.add('IsString');
        if (v.minLength) { decs.push(`  @MinLength(${v.minLength})`); decorators.add('MinLength'); }
        if (v.maxLength) { decs.push(`  @MaxLength(${v.maxLength})`); decorators.add('MaxLength'); }
      }
      if (field.type === 'email') {
        decs.push(`  @IsEmail({}, { message: '${v.message || '邮箱格式不正确'}' })`);
        decorators.add('IsEmail');
      }
      if (field.type === 'number' || field.type === 'integer') {
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
    const lines = [
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
    ];
    return lines.join('\n');
  }

  // ─────────────────────────────────────────────────────
  // 3. UpdateDTO
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
  // 4. Service
  // ─────────────────────────────────────────────────────
  genService(schema) {
    const className = toPascalCase(schema.name);
    const kebab = toKebabCase(schema.name);
    const camel = schema.name.charAt(0).toLowerCase() + schema.name.slice(1);

    return [
      `/**`,
      ` * ${schema.label} Service`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` */`,
      ``,
      `import { Injectable, NotFoundException } from '@nestjs/common';`,
      `import { InjectRepository } from '@nestjs/typeorm';`,
      `import { Repository, Like } from 'typeorm';`,
      `import { ${className}Entity } from './${kebab}.entity';`,
      `import { Create${className}Dto } from './dto/create-${kebab}.dto';`,
      `import { Update${className}Dto } from './dto/update-${kebab}.dto';`,
      ``,
      `@Injectable()`,
      `export class ${className}Service {`,
      `  constructor(`,
      `    @InjectRepository(${className}Entity)`,
      `    private readonly repo: Repository<${className}Entity>,`,
      `  ) {}`,
      ``,
      `  async findAll(query: Record<string, any> = {}) {`,
      `    const { page = 1, pageSize = 20, ...filters } = query;`,
      `    const where: any = {};`,
      ...schema.fields.filter(f => f.searchable).map(f =>
        `    if (filters.${f.name} !== undefined) where.${f.name} = Like(\`%\${filters.${f.name}}%\`);`
      ),
      `    const [list, total] = await this.repo.findAndCount({`,
      `      where,`,
      `      skip: (page - 1) * pageSize,`,
      `      take: pageSize,`,
      `      order: { id: 'DESC' },`,
      `    });`,
      `    return { list, total, page: +page, pageSize: +pageSize };`,
      `  }`,
      ``,
      `  async findOne(id: number) {`,
      `    const record = await this.repo.findOne({ where: { id } });`,
      `    if (!record) throw new NotFoundException(\`${schema.label} id=\${id} 不存在\`);`,
      `    return record;`,
      `  }`,
      ``,
      `  async create(dto: Create${className}Dto) {`,
      `    const entity = this.repo.create(dto);`,
      `    return this.repo.save(entity);`,
      `  }`,
      ``,
      `  async update(id: number, dto: Update${className}Dto) {`,
      `    await this.findOne(id);`,
      `    await this.repo.update(id, dto as any);`,
      `    return this.findOne(id);`,
      `  }`,
      ``,
      `  async remove(id: number) {`,
      `    await this.findOne(id);`,
      `    await this.repo.delete(id);`,
      `    return { message: '删除成功' };`,
      `  }`,
      `}`,
    ].join('\n');
  }

  // ─────────────────────────────────────────────────────
  // 5. Controller（修复：读取 endpoint.method）
  // ─────────────────────────────────────────────────────
  genController(schema) {
    const className = toPascalCase(schema.name);
    const kebab = toKebabCase(schema.name);
    const camel = schema.name.charAt(0).toLowerCase() + schema.name.slice(1);
    const prefix = schema.api.prefix.replace(/^\/api\//, '');

    const endpointMap = {};
    for (const ep of schema.api.endpoints) {
      endpointMap[ep.action] = ep;
    }

    const toDec = (method) => {
      const m = (method || 'GET').toUpperCase();
      switch (m) {
        case 'GET': return 'Get';
        case 'POST': return 'Post';
        case 'PUT': return 'Put';
        case 'DELETE': return 'Delete';
        default: return 'Get';
      }
    };

    const lines = [
      `/**`,
      ` * ${schema.label} Controller`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` */`,
      ``,
      `import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';`,
      `import { ApiTags, ApiOperation } from '@nestjs/swagger';`,
      `import { ${className}Service } from './${kebab}.service';`,
      `import { Create${className}Dto } from './dto/create-${kebab}.dto';`,
      `import { Update${className}Dto } from './dto/update-${kebab}.dto';`,
      ``,
      `@ApiTags('${schema.label}')`,
      `@Controller('${prefix}')`,
      `export class ${className}Controller {`,
      `  constructor(private readonly ${camel}Service: ${className}Service) {}`,
      ``,
    ];

    if (endpointMap.list) {
      const dec = toDec(endpointMap.list.method);
      lines.push(`  @ApiOperation({ summary: '查询${schema.label}列表' })`);
      lines.push(`  @${dec}()`);
      lines.push(`  findAll(@Query() query: Record<string, any>) {`);
      lines.push(`    return this.${camel}Service.findAll(query);`);
      lines.push(`  }`);
      lines.push(``);
    }

    if (endpointMap.detail) {
      const dec = toDec(endpointMap.detail.method);
      lines.push(`  @ApiOperation({ summary: '查询${schema.label}详情' })`);
      lines.push(`  @${dec}(':id')`);
      lines.push(`  findOne(@Param('id', ParseIntPipe) id: number) {`);
      lines.push(`    return this.${camel}Service.findOne(id);`);
      lines.push(`  }`);
      lines.push(``);
    }

    if (endpointMap.create) {
      const dec = toDec(endpointMap.create.method);
      lines.push(`  @ApiOperation({ summary: '新建${schema.label}' })`);
      lines.push(`  @${dec}()`);
      lines.push(`  create(@Body() dto: Create${className}Dto) {`);
      lines.push(`    return this.${camel}Service.create(dto);`);
      lines.push(`  }`);
      lines.push(``);
    }

    if (endpointMap.update) {
      const dec = toDec(endpointMap.update.method);
      lines.push(`  @ApiOperation({ summary: '更新${schema.label}' })`);
      lines.push(`  @${dec}(':id')`);
      lines.push(`  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Update${className}Dto) {`);
      lines.push(`    return this.${camel}Service.update(id, dto);`);
      lines.push(`  }`);
      lines.push(``);
    }

    if (endpointMap.delete) {
      const dec = toDec(endpointMap.delete.method);
      lines.push(`  @ApiOperation({ summary: '删除${schema.label}' })`);
      lines.push(`  @${dec}(':id')`);
      lines.push(`  remove(@Param('id', ParseIntPipe) id: number) {`);
      lines.push(`    return this.${camel}Service.remove(id);`);
      lines.push(`  }`);
      lines.push(``);
    }

    lines.push(`}`);
    return lines.join('\n');
  }

  // ─────────────────────────────────────────────────────
  // 6. Module
  // ─────────────────────────────────────────────────────
  genModule(schema) {
    const className = toPascalCase(schema.name);
    const kebab = toKebabCase(schema.name);
    return [
      `/**`,
      ` * ${schema.label} Module`,
      ` * 自动生成 - 来源：${schema.sourceFile}`,
      ` */`,
      ``,
      `import { Module } from '@nestjs/common';`,
      `import { TypeOrmModule } from '@nestjs/typeorm';`,
      `import { ${className}Entity } from './${kebab}.entity';`,
      `import { ${className}Service } from './${kebab}.service';`,
      `import { ${className}Controller } from './${kebab}.controller';`,
      ``,
      `@Module({`,
      `  imports: [TypeOrmModule.forFeature([${className}Entity])],`,
      `  controllers: [${className}Controller],`,
      `  providers: [${className}Service],`,
      `  exports: [${className}Service],`,
      `})`,
      `export class ${className}Module {}`,
    ].join('\n');
  }

  /**
   * 获取 SQLite 列类型（用于 @Column({ type: '...' })）
   */
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
    // 不用联合类型，避免 TypeORM 推断为 "Object"
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
