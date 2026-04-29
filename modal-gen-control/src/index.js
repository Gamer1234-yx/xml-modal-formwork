/**
 * modal-gen-control 核心入口
 * 串联：解析XML → 生成Vue代码 → 生成Nest代码 → 写入文件
 */

const path = require('path');
const XmlParser = require('./parser/XmlParser');
const VueCodeGenerator = require('./generators/VueCodeGenerator');
const NestCodeGenerator = require('./generators/NestCodeGenerator');
const FileWriter = require('./utils/fileWriter');

const ROOT = path.resolve(__dirname, '../../');
const XML_DIR = path.join(ROOT, 'xml-modal');
const VUE_ROOT = path.join(ROOT, 'vue-code');
const NEST_ROOT = path.join(ROOT, 'nest-code');

class ModalGenControl {
  constructor() {
    this.parser = new XmlParser();
    this.vueGen = new VueCodeGenerator();
    this.nestGen = new NestCodeGenerator();
    this.writer = new FileWriter();
  }

  /**
   * 生成单个 XML 文件对应的代码
   * @param {string} xmlFile - XML 文件路径（绝对路径）
   */
  async genOne(xmlFile) {
    console.log(`\n📄 解析: ${path.basename(xmlFile)}`);
    const schema = await this.parser.parse(xmlFile);
    console.log(`   模型: ${schema.label}(${schema.name})  模块: ${schema.module}`);

    // 生成前端代码
    const vueOutput = this.vueGen.generate(schema);
    const vueResult = this.writer.writeVueFiles(schema, vueOutput, VUE_ROOT);
    const vueDir = vueResult.dir;
    console.log(`   ✅ Vue3  → ${path.relative(ROOT, vueDir)}`);
    if (vueResult.apiCreated) {
      console.log(`   📝 已创建自定义 API 文件，可在此写自定义请求逻辑`);
    }

    // 生成后端代码
    const nestOutput = this.nestGen.generate(schema);
    const nestResult = this.writer.writeNestFiles(schema, nestOutput, NEST_ROOT);
    const nestDir = nestResult.dir;
    console.log(`   ✅ NestJS → ${path.relative(ROOT, nestDir)}`);
    if (nestResult.serviceCreated) {
      console.log(`   📝 已创建自定义 Service 文件，可在此写自定义业务逻辑`);
    }
    if (nestResult.controllerCreated) {
      console.log(`   📝 已创建自定义 Controller 文件，可在此扩展接口`);
    }
    if (nestResult.moduleCreated) {
      console.log(`   📝 已创建自定义 Module 文件，可在此自定义模块配置`);
    }

    return { schema, vueDir, nestDir };
  }

  /**
   * 生成 xml-modal 目录下所有 XML 对应的代码
   */
  async genAll() {
    const fs = require('fs');
    const files = fs.readdirSync(XML_DIR)
      .filter(f => f.endsWith('.xml'))
      .map(f => path.join(XML_DIR, f));

    if (files.length === 0) {
      console.log('⚠️  xml-modal 目录下没有找到任何 XML 文件');
      return;
    }

    console.log(`\n🚀 开始生成代码，共 ${files.length} 个 XML 文件...\n`);
    const results = [];
    for (const file of files) {
      const result = await this.genOne(file);
      results.push(result);
    }
    console.log(`\n✨ 全部生成完毕！共处理 ${results.length} 个模型\n`);
    return results;
  }

  /**
   * 监听 xml-modal 目录变化，自动重新生成
   */
  watch() {
    const chokidar = require('chokidar');
    console.log(`\n👀 监听 xml-modal 目录变化...\n`);
    const watcher = chokidar.watch(path.join(XML_DIR, '*.xml'), { ignoreInitial: false });
    watcher.on('add', f => this.genOne(f).catch(console.error));
    watcher.on('change', f => {
      console.log(`\n🔄 文件变化: ${path.basename(f)}`);
      this.genOne(f).catch(console.error);
    });
    watcher.on('unlink', f => console.log(`\n🗑️  文件删除: ${path.basename(f)} (已有代码不会自动删除)`));
  }
}

module.exports = ModalGenControl;
