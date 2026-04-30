#!/usr/bin/env node
/**
 * modal-gen CLI 入口
 * 用法:
 *   node src/cli.js                   # 生成所有 XML
 *   node src/cli.js --file user.xml   # 生成指定 XML
 *   node src/cli.js --watch           # 监听模式
 */

const { program } = require('commander');
const path = require('path');
const ModalGenControl = require('./index');

program
  .name('modal-gen')
  .description('XML驱动的业务模型代码生成器')
  .version('1.0.0');

program
  .option('-f, --file <filename>', '指定生成的XML文件名（相对于xml-modal目录）')
  .option('-w, --watch', '监听模式，自动检测XML变化并重新生成')
  .option('-a, --all', '生成所有XML文件（默认行为）')
  .option('--vue', '仅生成前端 Vue 代码')
  .option('--nest', '仅生成后端 NestJS 代码')
  .action(async (options) => {
    const gen = new ModalGenControl();

    if (options.watch) {
      gen.watch();
      return;
    }

    const ROOT = path.resolve(__dirname, '../../');

    if (options.file) {
      const xmlFile = path.join(ROOT, 'xml-modal', options.file);
      try {
        if (options.vue) {
          await gen.genVueOnly(xmlFile);
        } else if (options.nest) {
          await gen.genNestOnly(xmlFile);
        } else {
          await gen.genOne(xmlFile);
        }
      } catch (e) {
        console.error(`❌ 生成失败: ${e.message}`);
        process.exit(1);
      }
    } else {
      // 默认生成所有
      try {
        if (options.vue) {
          await gen.genAllVue();
        } else if (options.nest) {
          await gen.genAllNest();
        } else {
          await gen.genAll();
        }
      } catch (e) {
        console.error(`❌ 生成失败: ${e.message}`);
        process.exit(1);
      }
    }
  });

program.parse(process.argv);
