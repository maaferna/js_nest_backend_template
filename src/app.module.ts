import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookstoreModule } from './bookstore/bookstore.module';

@Module({
  imports: [AuthModule, UserModule, BookstoreModule],
})
export class AppModule {}
