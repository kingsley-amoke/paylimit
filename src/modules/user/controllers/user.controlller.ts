import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
  InternalServerErrorException,
  HttpCode,
  HttpStatus,
  ConflictException,
  Req,
} from '@nestjs/common';
import { UserService } from '../services/repositories/user.service.js';
import type { UpdateUserDto } from '../domain/dto/update_user.dto.js';
import type { UpdateRoleDto } from '../domain/dto/update_role.dto.js';
import type { UpdateKycStatusDto } from '../domain/dto/update_kyc.dto.js';
import type { CreateUserDto } from '../domain/dto/create.dto.js';
import { randomUUID } from 'crypto';
import { UserDto } from '../domain/dto/user.dto.js';
import { UserRole } from '../domain/entities/user_role.js';
import { KycStatus } from '../domain/entities/kyc_status.js';
import { UserMapper } from '../mappers/user.mapper.js';
import { AddressDto } from '../domain/dto/address.dto.js';
import { UserEntity } from '../domain/entities/user.entity.js';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /users/:id
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return UserMapper.toClient(user);
  }

  // GET /users/email?email=
  @Get('email')
  @HttpCode(HttpStatus.OK)
  async findByEmailOrAll(@Query('email') email?: string) {
    if (!email) {
      const users = await this.userService.findAll();

      if (!users || users.length === 0) {
        return [];
      }

      return UserMapper.toClientList(users);
    }

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return UserMapper.toClient(user);
  }

  // GET /users/
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const users = await this.userService.findAll();

    if (!users || users.length === 0) {
      return [];
    }

    return UserMapper.toClientList(users);
  }

  // POST /users
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException(
        `User with email ${dto.email} already exists`,
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const userDto: UserDto = {
      id: randomUUID(),
      email: dto.email,
      password: hashedPassword,
      firstname: dto.firstname,
      lastname: dto.lastname,
      phone: dto.phone,
      role: UserRole.USER,
      kycStatus: KycStatus.NOT_VERIFIED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const addressDto: AddressDto = {
      userId: userDto.id,
      street: dto.street,
      city: dto.city,
      state: dto.state,
      country: dto.country,
      zipCode: dto.zipCode,
    };

    const user = UserMapper.fromDto(userDto, addressDto);
    const createdUser = await this.userService.create(user);

    if (!createdUser) {
      throw new InternalServerErrorException('Failed to create user');
    }

    return UserMapper.toClient(createdUser);
  }

  // PUT /users/:id
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Prevent email updates or check for duplicates
    if (dto.email && dto.email !== user.Email) {
      const existingUser = await this.userService.findByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException(`Email ${dto.email} is already in use`);
      }
    }

    const userDto = UserMapper.toDto(user);
    const updatedUserDto = {
      ...userDto,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    const updatedUser = UserMapper.fromDto(updatedUserDto);
    const result = await this.userService.update(updatedUser);

    if (!result) {
      throw new InternalServerErrorException('Failed to update user');
    }

    return UserMapper.toClient(result);
  }
  // DELETE /users/:id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    const deletedUser = await this.userService.delete(id);

    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return { message: `User with ID ${id} deleted successfully` };
  }

  @Patch(':id/role')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN) // Only admins can change roles
  async updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    const updatedUser = await this.userService.updateRole(id, dto.role);

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return UserMapper.toClient(updatedUser);
  }

  @Patch(':id/kyc-status')
  @HttpCode(HttpStatus.OK)
  async updateKycStatus(
    @Param('id') id: string,
    @Body() dto: UpdateKycStatusDto,
    @Req() req: Request, // To get admin who made the change
  ) {
    const updatedUser = await this.userService.updateKycStatus(
      id,
      dto.kycStatus,
    );

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Log the change for audit purposes
    // await this.auditService.log({
    //   action: 'KYC_STATUS_UPDATE',
    //   userId: id,
    //   oldStatus: updatedUser.kycStatus,
    //   newStatus: dto.kycStatus,
    //   adminId: req.user.id,
    //   timestamp: new Date(),
    // });

    return UserMapper.toClient(updatedUser);
  }
}
