export class Address {
  constructor(
    private readonly userId: string,
    private readonly street: string,
    private readonly city: string,
    private readonly state: string,
    private readonly zipCode: string,
    private readonly country: string,
  ) {}

  get fullAddress() {
    return `${this.street}, ${this.city}, ${this.state}, ${this.country}`;
  }

  get getUserId(): string {
    return this.userId;
  }

  get getStreet(): string {
    return this.street;
  }

  get getCity(): string {
    return this.city;
  }

  get getState(): string {
    return this.state;
  }

  get getZipCode(): string {
    return this.zipCode;
  }

  get getCountry(): string {
    return this.country;
  }
}
