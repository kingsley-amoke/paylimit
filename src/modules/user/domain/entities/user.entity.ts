import { Address } from './address.entity.js';
import { KycStatus } from './kyc_status.js';
import { UserRole } from './user_role.js';

export class UserEntity {
  constructor(
    private readonly id: string,
    private email: string,
    private passwordHash: string,
    private firstname: string,
    private lastname: string,
    private phone: string,
    private address?: Address,
    private role: UserRole = UserRole.USER,
    private kycStatus: KycStatus = KycStatus.NOT_VERIFIED,

    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date(),
  ) {}

  get fullname(): string {
    return `${this.firstname.charAt(0).toUpperCase() + this.firstname.slice(1).toLowerCase()} ${
      this.lastname.charAt(0).toUpperCase() +
      this.lastname.slice(1).toLowerCase()
    }`;
  }

  get password(): string {
    return this.passwordHash;
  }

  get Id(): string {
    return this.id;
  }

  get Email(): string {
    return this.email;
  }

  get kyc_Status(): KycStatus {
    return this.kycStatus;
  }

  get Role(): UserRole {
    return this.role;
  }

  get Firstname(): string {
    return this.firstname;
  }

  get Lastname(): string {
    return this.lastname;
  }

  get Phone(): string {
    return this.phone;
  }

  get Address(): Address | undefined {
    return this.address;
  }
  get CreatedAt(): Date {
    return this.createdAt;
  }

  get UpdatedAt(): Date {
    return this.updatedAt;
  }

  updateProfile(firstname: string, lastname: string, phone: string) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.phone = phone;
    this.updatedAt = new Date();
  }

  updateRole(role: UserRole) {
    this.role = role;
    this.updatedAt = new Date();
  }

  updateKycStatus(status: KycStatus) {
    this.kycStatus = status;
    this.updatedAt = new Date();
  }
}
