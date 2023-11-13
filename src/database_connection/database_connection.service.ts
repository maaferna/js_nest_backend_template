import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseConnectionService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
  async cleanDb() {
    try {
      await this.$transaction([
        this.userProfile.deleteMany(),
        this.user.deleteMany(),
      ]);
      console.log('Database cleaned successfully.');
    } catch (error) {
      console.error('Error cleaning the database:', error.message);
      throw error; // Rethrow the error to propagate it up the call stack
    }
  }
}
