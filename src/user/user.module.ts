import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserBookStatusController } from '../user_book_status/user_book_status.controller';
import { UserBookStatusService } from '../user_book_status/user_book_status.service';

@Module({
  controllers: [UserController, UserBookStatusController],
  providers: [UserService, UserBookStatusService],
})
export class UserModule {}
