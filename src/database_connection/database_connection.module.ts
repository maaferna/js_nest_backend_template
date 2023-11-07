import { Global, Module } from '@nestjs/common';
import { DatabaseConnectionService } from './database_connection.service';

@Global()
@Module({
  providers: [DatabaseConnectionService],
  exports: [DatabaseConnectionService],
})
export class DatabaseConnectionModule {}
