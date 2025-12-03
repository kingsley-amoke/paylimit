import { AddressDto } from './address.dto.js';

export interface ClientDto {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: string;
  address?: Omit<AddressDto, 'userId'>;
  kycStatus: string;
  createdAt: string;
  updatedAt: string;
}
