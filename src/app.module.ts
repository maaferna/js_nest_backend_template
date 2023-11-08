import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/books.module';
import { AuthorModule } from './author/author.module';
import { CategoryModule } from './category/category.module';
import { UserBookStatusModule } from './user_book_status/user_book_status.module';
import { BookReviewModule } from './book_review/book_review.module';
import { UserProfileModule } from './user_profile/user_profile.module';
import { DatabaseConnectionModule } from './database_connection/database_connection.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    BookModule,
    AuthorModule,
    CategoryModule,
    UserBookStatusModule,
    BookReviewModule,
    UserProfileModule,
    DatabaseConnectionModule,
  ],
})
export class AppModule {}
