// 启动 NestJS 开发模式
const { spawn } = require('child_process');
const path = require('path');

const node = 'E:\\softWare\\nodejs\\node.exe';
const nestCli = path.join(__dirname, 'node_modules', '@nestjs', 'cli', 'bin', 'nest.js');

const proc = spawn(node, [nestCli, 'start', '--watch'], {
  stdio: 'inherit',
  shell: false,
  env: { ...process.env, NODE_ENV: 'development' },
});

proc.on('exit', (code) => {
  console.log(`进程退出，code=${code}`);
});
