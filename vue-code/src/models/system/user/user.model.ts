/**
 * 用户 数据模型
 * 自动生成 - 来源：user.xml
 * 请勿手动修改，重新生成会覆盖此文件
 */

export interface IUser {
  /** ID */
  id?: number;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname?: string;
  /** 邮箱 */
  email: string;
  /** 手机号 */
  phone?: string;
  /** 密码 */
  password: string;
  /** 性别 */
  gender?: string | number;
  /** 生日 */
  birthday?: string;
  /** 头像 */
  avatar?: string;
  /** 状态 */
  status: string | number;
  /** 备注 */
  remark?: string;
  /** 创建时间 */
  createdAt?: string;
  /** 更新时间 */
  updatedAt?: string;
}

export class UserModel implements IUser {
  /** ID */
  id: number = 0;
  /** 用户名 */
  username: string = '';
  /** 昵称 */
  nickname: string = '';
  /** 邮箱 */
  email: string = '';
  /** 手机号 */
  phone: string = '';
  /** 密码 */
  password: string = '';
  /** 性别 */
  gender: string | number = '';
  /** 生日 */
  birthday: string = '';
  /** 头像 */
  avatar: string = '';
  /** 状态 */
  status: string | number = '1';
  /** 备注 */
  remark: string = '';
  /** 创建时间 */
  createdAt: string = '';
  /** 更新时间 */
  updatedAt: string = '';

  constructor(data?: Partial<IUser>) {
    if (data) Object.assign(this, data);
  }

  /** 转为纯 JSON 对象 */
  toJSON(): IUser {
    return { ...this };
  }
}

export default UserModel;