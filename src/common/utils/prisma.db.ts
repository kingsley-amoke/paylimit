import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma/client.js';

export class PrismaDBService implements OnModuleInit {
  readonly client = new PrismaClient();

  onModuleInit() {
    this.client.$connect();
  }
}
