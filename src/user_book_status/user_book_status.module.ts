import { Module } from '@nestjs/common';
import { UserBookStatusController } from './user_book_status.controller';
import { UserBookStatusService } from './user_book_status.service';

@Module({
  controllers: [UserBookStatusController],
  providers: [UserBookStatusService],
})
export class UserBookStatusModule {}
