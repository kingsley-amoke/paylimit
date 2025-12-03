import { UserEntity } from '../entities/user.entity.js';

export interface IUserService {
  create(user: UserEntity): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  update(user: UserEntity): Promise<UserEntity | null>;
  delete(id: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[] | null>;
  updateRole(id: string, role: string): Promise<UserEntity | null>;
  updateKycStatus(id: string, status: string): Promise<UserEntity | null>;
}
