import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controlller.js';
import { UserService } from './services/repositories/user.service.js';
import { UserDBService } from './services/database/db.service.js';

@Module({
  imports: [],
  providers: [UserService, UserDBService],
  controllers: [UserController],
})
export class UserModule {}
