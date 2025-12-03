import { IUserDBService } from '../../domain/repositories/user.db.service.js';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Address } from '../../domain/entities/address.entity.js';
import { UserEntity } from '../../domain/entities/user.entity.js';
import { UserMapper } from '../../mappers/user.mapper.js';
import { UserDto } from '../../domain/dto/user.dto.js';
import { PrismaDBService } from '../../../../common/utils/prisma.db.js';
import { KycStatus, UserRole } from '../../../../../generated/prisma/enums.js';
import { AddressDto } from '../../domain/dto/address.dto.js';
import * as Role from '../../domain/entities/user_role.js';
import * as Kyc from '../../domain/entities/kyc_status.js';

interface IUserPrisma {
  id: string;
  email: string;
  passwordHash: string;
  phone: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  kycStatus: KycStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface IAddressPrisma {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

const userToPrisma = (user: UserEntity) => {
  return {
    id: user.Id,
    email: user.Email,
    passwordHash: user.password,
    phone: user.Phone,
    firstname: user.Firstname,
    lastname: user.Lastname,
    role: UserRole.USER,
    kycStatus: KycStatus.NOT_VERIFIED,
    updatedAt: user.UpdatedAt,
  };
};

const prismaToUserDto = (user: IUserPrisma): UserDto => {
  return {
    password: user.passwordHash,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    email: user.email,
    firstname: user.firstname,
    id: user.id,

    kycStatus: user.kycStatus,
    lastname: user.lastname,
    phone: user.phone,
    role: user.role,
  };
};

const prismaToAddressDto = (
  address: IAddressPrisma | null,
): AddressDto | null => {
  return {
    userId: address?.userId || '',
    street: address?.street || '',
    city: address?.city || '',
    state: address?.state || '',
    country: address?.country || '',
    zipCode: address?.zipCode || '',
  };
};

const addressToPrisma = (address: Address) => {
  return {
    street: address.getStreet,
    city: address.getCity,
    state: address.getState,
    country: address.getCountry,
    zipCode: address.getZipCode,
  };
};

const mapRole = (role: Role.UserRole): UserRole => {
  switch (role) {
    case Role.UserRole.ADMIN:
      return UserRole.ADMIN;
    case Role.UserRole.USER:
      return UserRole.USER;
    default:
      throw new Error(`Unknown role: ${role}`);
  }
};

const mapKyc = (status: Kyc.KycStatus): KycStatus => {
  switch (status) {
    case Kyc.KycStatus.VERIFIED:
      return KycStatus.VERIFIED;
    case Kyc.KycStatus.NOT_VERIFIED:
      return KycStatus.NOT_VERIFIED;
    case Kyc.KycStatus.PENDING:
      return KycStatus.PENDING;

    default:
      throw new Error(`Unknown role: ${status}`);
  }
};

@Injectable()
export class UserDBService extends PrismaDBService implements IUserDBService {
  private async findUserBy(
    where: { id: string } | { email: string },
  ): Promise<UserEntity | null> {
    const user = await this.client.user.findUnique({
      where,
      include: { address: true },
    });

    if (!user) {
      return null;
    }

    return UserMapper.fromDto(
      prismaToUserDto(user),
      prismaToAddressDto(user.address) || undefined,
    );
  }

  async findById(id: string): Promise<UserEntity | null> {
    try {
      return await this.findUserBy({ id });
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error.message || error}`);
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      return await this.findUserBy({ email });
    } catch (error) {
      throw new Error(
        `Failed to find user by email: ${error.message || error}`,
      );
    }
  }

  async findAll(): Promise<UserEntity[] | null> {
    try {
      const res = await this.client.user.findMany({
        include: {
          address: true,
        },
      });

      if (res.length === 0) {
        return null;
      }

      const users: UserEntity[] = res.map((user) => {
        return UserMapper.fromDto(
          prismaToUserDto(user),
          prismaToAddressDto(user.address) || undefined,
        );
      });

      return users;
    } catch (error) {
      throw new Error(`Failed to find users: ${error}`);
    }
  }
  async create(user: UserEntity): Promise<UserEntity | null> {
    try {
      const data = userToPrisma(user);
      const res = await this.client.user.create({
        data,
      });

      if (!res) {
        throw new Error('Something went wrong');
      }

      await this.client.address.create({
        data: {
          userId: user.Id,
          street: user.Address?.getStreet || '',
          city: user.Address?.getCity || '',
          state: user.Address?.getState || '',
          country: user.Address?.getCountry || '',
          zipCode: user.Address?.getZipCode || '',
        },
      });

      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }
  async update(user: UserEntity): Promise<UserEntity | null> {
    try {
      const data = userToPrisma(user);
      const { email, ...rest } = data;

      const res = await this.client.user.update({
        where: { id: user.Id },
        data: rest,
      });

      return UserMapper.fromDto(prismaToUserDto(res));
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }

      throw new Error(`Unable to update user: ${error.message || error}`);
    }
  }

  async delete(id: string): Promise<UserEntity | null> {
    try {
      const user = await this.client.user.delete({
        where: { id },
        include: { address: true },
      });

      return UserMapper.fromDto(
        prismaToUserDto(user),
        prismaToAddressDto(user.address) || undefined,
      );
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Record not found
      }
      throw new Error(`Failed to delete user: ${error.message || error}`);
    }
  }

  async updateRole(
    id: string,
    role: Role.UserRole,
  ): Promise<UserEntity | null> {
    try {
      const mappedRole = mapRole(role);
      const user = await this.client.user.update({
        where: { id },
        data: { role: mappedRole },
        include: { address: true },
      });

      return UserMapper.fromDto(
        prismaToUserDto(user),
        prismaToAddressDto(user.address) || undefined,
      );
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Record not found
      }
      throw new Error(`Failed to update user role: ${error.message || error}`);
    }
  }

  async updateKycStatus(
    id: string,
    status: Kyc.KycStatus,
  ): Promise<UserEntity | null> {
    try {
      const mappedStatus = mapKyc(status);
      const user = await this.client.user.update({
        where: { id },
        data: { kycStatus: mappedStatus },
        include: { address: true },
      });

      return UserMapper.fromDto(
        prismaToUserDto(user),
        prismaToAddressDto(user.address) || undefined,
      );
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Record not found
      }
      throw new Error(`Failed to update KYC status: ${error.message || error}`);
    }
  }

  async updateAddress(address: AddressDto): Promise<UserEntity | null> {
    try {
      const res = await this.client.address.update({
        where: { userId: address.userId },
        data: address,
        include: { user: true },
      });

      return UserMapper.fromDto(prismaToUserDto(res.user));
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Record not found
      }
      throw new Error(`Failed to update address: ${error.message || error}`);
    }
  }
}
