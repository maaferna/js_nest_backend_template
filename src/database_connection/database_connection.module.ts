import { Module } from '@nestjs/common';
import { DatabaseConnectionService } from './database_connection.service';

@Module({
  providers: [DatabaseConnectionService]
})
export class DatabaseConnectionModule {}
