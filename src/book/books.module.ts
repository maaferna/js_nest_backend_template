import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { DatabaseConnectionService } from '../database_connection/database_connection.service';

@Module({
  controllers: [BookController],
  providers: [BookService, DatabaseConnectionService],
})
export class BookModule {}
