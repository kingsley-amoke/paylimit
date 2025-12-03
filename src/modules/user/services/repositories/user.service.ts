import { Injectable } from '@nestjs/common';
import { IUserService } from '../../domain/repositories/user.service.js';
import { UserEntity } from '../../domain/entities/user.entity.js';
import { UserDBService } from '../database/db.service.js';
import { UserRole } from '../../domain/entities/user_role.js';
import { KycStatus } from '../../domain/entities/kyc_status.js';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly db: UserDBService) {}
  async create(user: UserEntity): Promise<UserEntity | null> {
    return await this.db.create(user);
  }
  async findById(id: string): Promise<UserEntity | null> {
    return this.db.findById(id);
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.db.findByEmail(email);
  }
  async update(user: UserEntity): Promise<UserEntity | null> {
    return await this.db.update(user);
  }
  async delete(id: string): Promise<UserEntity | null> {
    return await this.db.delete(id);
  }
  async findAll(): Promise<UserEntity[] | null> {
    return await this.db.findAll();
  }
  async updateRole(id: string, role: UserRole): Promise<UserEntity | null> {
    return await this.db.updateRole(id, role);
  }
  async updateKycStatus(
    id: string,
    status: KycStatus,
  ): Promise<UserEntity | null> {
    return await this.db.updateKycStatus(id, status);
  }
}
