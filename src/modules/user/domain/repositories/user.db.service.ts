import { AddressDto } from '../dto/address.dto.js';
import { Address } from '../entities/address.entity.js';
import { UserEntity } from '../entities/user.entity.js';

export interface IUserDBService {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<UserEntity | null>;
  update(user: UserEntity): Promise<UserEntity | null>;
  delete(id: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[] | null>;
  updateRole(id: string, role: string): Promise<UserEntity | null>;
  updateKycStatus(id: string, status: string): Promise<UserEntity | null>;
  updateAddress(address: AddressDto): Promise<UserEntity | null>;
}
