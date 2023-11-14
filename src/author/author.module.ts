import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { AuthGuard } from '@nestjs/passport';
import { Prisma } from '@prisma/client';

@Module({
  providers: [AuthorService],
  controllers: [AuthorController],
})
export class AuthorModule {}

export type Author = Prisma.AuthorGetPayload<{
  include: { books: true };
}>;
