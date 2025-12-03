import { KycStatus } from '../domain/entities/kyc_status.js';

export class KycStatusMapper {
  static toDomain(value: string | null | undefined): KycStatus {
    if (!value) return KycStatus.NOT_VERIFIED;

    const normalized = value.toUpperCase();

    switch (normalized) {
      case 'VERIFIED':
        return KycStatus.VERIFIED;

      case 'PENDING':
        return KycStatus.PENDING;

      case 'NOT_VERIFIED':
      default:
        return KycStatus.NOT_VERIFIED;
    }
  }

  static toPersistence(status: KycStatus): string {
    return status;
  }

  static toDto(status: KycStatus): string {
    return status;
  }
}
