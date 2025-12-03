import { AddressDto } from '../domain/dto/address.dto.js';
import { ClientDto } from '../domain/dto/client.dto.js';
import { UserDto } from '../domain/dto/user.dto.js';
import { UserEntity } from '../domain/entities/user.entity.js';
import { AddressMapper } from './address.mapper.js';
import { KycStatusMapper } from './kyc_status.mapper.js';
import { UserRoleMapper } from './user_role.mapper.js';

export class UserMapper {
  static toDto(user: UserEntity): UserDto {
    return {
      id: user.Id,
      email: user.Email,
      password: user.password,
      firstname: user.Firstname,
      lastname: user.Lastname,
      phone: user.Phone,
      role: UserRoleMapper.toDto(user.Role),
      kycStatus: KycStatusMapper.toDto(user.kyc_Status),
      createdAt: user.CreatedAt.toISOString(),
      updatedAt: user.UpdatedAt.toISOString(),
    };
  }

  static fromDto(dto: UserDto, address?: AddressDto): UserEntity {
    const user = new UserEntity(
      dto.id,
      dto.email,
      dto.password,
      dto.firstname,
      dto.lastname,
      dto.phone,
      address ? AddressMapper.fromDto(address) : undefined,
      UserRoleMapper.toDomain(dto.role),
      KycStatusMapper.toDomain(dto.kycStatus),
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
    );

    return user;
  }

  static fromDtoList(dtos: UserDto[], addresses?: AddressDto[]): UserEntity[] {
    return dtos.map((dto) => {
      const address = addresses?.find((a) => a.userId === dto.id);
      return this.fromDto(dto, address);
    });
  }

  static toClient(user: UserEntity): ClientDto {
    return {
      id: user.Id,
      email: user.Email,
      firstname: user.Firstname,
      lastname: user.Lastname,
      phone: user.Phone,
      role: UserRoleMapper.toDto(user.Role),
      kycStatus: KycStatusMapper.toDto(user.kyc_Status),
      address: user.Address ? AddressMapper.toClient(user.Address) : undefined,
      createdAt: user.CreatedAt.toISOString(),
      updatedAt: user.UpdatedAt.toISOString(),
    };
  }

  static toClientList(
    users: UserEntity[],
    addresses?: AddressDto[],
  ): ClientDto[] {
    return users.map((user) => {
      return this.toClient(user);
    });
  }
}
