import { UserRole } from '../domain/entities/user_role.js';

export class UserRoleMapper {
  static toDomain(value: string | null | undefined): UserRole {
    if (!value) return UserRole.USER;

    const normalized = value.toUpperCase();

    switch (normalized) {
      case 'ADMIN':
        return UserRole.ADMIN;

      case 'SUPER_ADMIN':
        return UserRole.SUPER_ADMIN;

      case 'USER':
      default:
        return UserRole.USER;
    }
  }

  static toPersistence(role: UserRole): string {
    return role;
  }

  static toDto(role: UserRole): string {
    return role;
  }
}
