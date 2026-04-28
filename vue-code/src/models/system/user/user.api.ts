/**
 * 用户 API 服务
 * 自动生成 - 来源：user.xml
 */

import request from '@/utils/request';
import type { IUser } from './User.model';

const BASE_URL = '/api/system/user';

export const UserApi = {
  /** 查询列表 */
  list(params?: Record<string, any>) {
    return request.post<{ list: IUser[]; total: number }>(BASE_URL, params);
  },

  /** 查询详情 */
  detail(id: number | string, data?: any) {
    return request.post<IUser>(`${BASE_URL}/${id}`, data);
  },

  /** 新建 */
  create(data: Partial<IUser>) {
    return request.post<IUser>(BASE_URL, data);
  },

  /** 更新 */
  update(id: number | string, data: Partial<IUser>) {
    return request.post<IUser>(`${BASE_URL}/${id}`, data);
  },

  /** 删除 */
  remove(id: number | string, data?: any) {
    return request.post(`${BASE_URL}/${id}`, data);
  },
};

export default UserApi;