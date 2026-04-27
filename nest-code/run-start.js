// 运行 nest start 并捕获完整错误输出
const { spawn } = require('child_process');
const path = require('path');

const node = 'E:\\softWare\\nodejs\\node.exe';
const nestCli = path.join(__dirname, 'node_modules', '@nestjs', 'cli', 'bin', 'nest.js');

const proc = spawn(node, [nestCli, 'start'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'development' },
});

let stdout = '';
let stderr = '';

proc.stdout.on('data', (data) => {
  process.stdout.write(data);
  stdout += data.toString();
});

proc.stderr.on('data', (data) => {
  process.stderr.write(data);
  stderr += data.toString();
});

proc.on('exit', (code) => {
  if (stderr) {
    require('fs').writeFileSync('start-error.log', stderr);
    console.log('\n=== 错误已保存到 start-error.log ===');
  }
  process.exit(code);
});
