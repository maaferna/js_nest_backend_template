import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookStatusDto } from './dto/create-book-status.dto';
import { DatabaseConnectionService } from '../database_connection/database_connection.service';

@Injectable()
export class UserBookStatusService {
  constructor(private prisma: DatabaseConnectionService) {}

  async create(userId: number, createBookStatusDto: CreateBookStatusDto) {
    // Check if the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    console.log('createBookStatusDto service:', createBookStatusDto);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Create or update the book status
    return this.prisma.bookStatus.upsert({
      where: {
        UserIdBookIdUniqueConstraint: {
          userId,
          bookId: createBookStatusDto.bookId, // Use bookId directly from the DTO
        },
      },
      update: {
        wantToRead: createBookStatusDto.wantToRead,
        currentlyRead: createBookStatusDto.currentlyRead,
      },
      create: {
        userId,
        bookId: createBookStatusDto.bookId,
        wantToRead: createBookStatusDto.wantToRead,
        currentlyRead: createBookStatusDto.currentlyRead,
      },
    });
  }

  async findAllByUserId(userId: number) {
    // Check if the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        bookStatuses: true, // Include the user's book statuses
      },
    });

    console.log('*****************', user);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Access all instances of BookStatus for the user
    const bookStatuses = user.bookStatuses;

    // Optionally, you can log the bookStatuses
    console.log('*****************', bookStatuses);

    return bookStatuses;
  }
}
