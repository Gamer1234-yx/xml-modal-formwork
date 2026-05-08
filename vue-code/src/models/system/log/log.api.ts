/**
 * 日志 API Service（自定义请求逻辑）
 * 此文件不会被生成器覆盖，请在此处编写自定义请求逻辑
 *
 * 使用方式：
 *   1. 重写方法：完全替换默认请求逻辑
 *   2. 调用 super.xxx()：复用默认逻辑，再追加处理
 *   3. 新增方法：添加完全自定义的接口调用
 */

import { LogApiBase } from './generated/log.api';
import type { ILog } from './generated/log.model';

class LogApi extends LogApiBase {
  // 可在此处重写或扩展接口调用逻辑
  // 示例：
  // async list(params?: Record<string, any>) {
  //   // 自定义请求逻辑
  //   return super.list(params);
  // }
}

const logApi = new LogApi();
export default logApi;