import { AddressDto } from '../domain/dto/address.dto.js';
import { Address } from '../domain/entities/address.entity.js';

export class AddressMapper {
  static toDto(address: Address): AddressDto {
    return {
      userId: address.getUserId,
      street: address.getStreet,
      city: address.getCity,
      state: address.getState,
      zipCode: address.getZipCode,
      country: address.getCountry,
    };
  }

  static fromDto(dto: AddressDto): Address {
    return new Address(
      dto.userId,
      dto.street,
      dto.city,
      dto.state,
      dto.zipCode,
      dto.country,
    );
  }

  static toClient(address: Address): Omit<AddressDto, 'userId'> {
    const data = this.toDto(address);
    const { userId, ...rest } = data;

    return rest;
  }
}
