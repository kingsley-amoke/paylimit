export interface CreateUserDto {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  password: string; // raw password, to be hashed in use-case
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
