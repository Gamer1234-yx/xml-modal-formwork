/**
 * 用户 API 服务（标准实现）
 * 自动生成 - 来源：user.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 *    自定义请求逻辑请写在同目录的 user.api.ts 中
 */

import request from '@/utils/request';
import type { IUser } from './user.model';
import type { ListQuery, DetailQuery, DeleteQuery, UserListReturn, UserDeleteReturn } from './user.types';

const BASE_URL = '/api/system/user';

export class UserApiBase {
  /** 查询列表 */
  list(query: ListQuery): Promise<UserListReturn> {
    return request.post<UserListReturn>(BASE_URL, query);
  }

  /** 查询详情 */
  detail(query: DetailQuery): Promise<IUser> {
    return request.post<IUser>(BASE_URL, query);
  }

  /** 新建 */
  create(body: Partial<IUser>): Promise<IUser> {
    return request.post<IUser>(BASE_URL, body);
  }

  /** 更新 */
  update(data: { id: number, body: Partial<IUser> }): Promise<IUser> {
    return request.post<IUser>(BASE_URL, data);
  }

  /** 删除 */
  remove(query: DeleteQuery): Promise<UserDeleteReturn> {
    return request.post<UserDeleteReturn>(BASE_URL, query);
  }

}

export default UserApiBase;