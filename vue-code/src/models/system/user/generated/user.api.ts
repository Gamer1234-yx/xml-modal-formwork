/**
 * 用户 API 服务（标准实现）
 * 自动生成 - 来源：user.xml
 * ⚠️ 此文件每次重新生成都会被覆盖
 *    自定义请求逻辑请写在同目录的 user.api.ts 中
 */

import request from '@/utils/request';
import type { ApiResponse } from '@/utils/request';
import type { IUser } from './user.model';
import type { ListQuery, UserFindAllReturn, UserRemoveReturn } from './user.types';

const BASE_URL = '/system/user';

export class UserApiBase {
  /** 查询列表 */
  findAll(query: ListQuery): Promise<ApiResponse<UserFindAllReturn>> {
    return request.post<ApiResponse<UserFindAllReturn>>(`${BASE_URL}/list`, query);
  }

  /** 查询详情 */
  findOne(id: number): Promise<ApiResponse<IUser>> {
    return request.post<ApiResponse<IUser>>(`${BASE_URL}/detail`, id);
  }

  /** 新建 */
  create(body: Partial<IUser>): Promise<ApiResponse<IUser>> {
    return request.post<ApiResponse<IUser>>(`${BASE_URL}/create`, body);
  }

  /** 更新 */
  update(body: Partial<IUser>): Promise<ApiResponse<IUser>> {
    return request.post<ApiResponse<IUser>>(`${BASE_URL}/update`, body);
  }

  /** 删除 */
  remove(id: number): Promise<ApiResponse<UserRemoveReturn>> {
    return request.post<ApiResponse<UserRemoveReturn>>(`${BASE_URL}/delete`, id);
  }

  /** 自定义方法 */
  customUpdate(body: Partial<IUser>): Promise<ApiResponse<IUser>> {
    return request.post<ApiResponse<IUser>>(`${BASE_URL}/customUpdate`, body);
  }

}

export default UserApiBase;