import { DatabaseConnectionService } from '../database_connection/database_connection.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from '@prisma/client';

@Injectable()
export class BookService {
  constructor(private prisma: DatabaseConnectionService) {}

  async createBook(createdBook: CreateBookDto) {
    const { authors, categories, ...bookData } = createdBook;

    // Create book in the database
    const createdBookWithRelations = await this.prisma.book.create({
      data: {
        ...bookData,
        authors: { connect: authors.map((authorId) => ({ id: authorId })) }, // Map each author ID to AuthorWhereUniqueInput
        categories: {
          connect: categories.map((categoryId) => ({ id: categoryId })),
        }, // Map each category ID to CategoryWhereUniqueInput
      },
      include: {
        authors: true,
        categories: true,
      },
    });

    return createdBookWithRelations;
  }

  getBooks() {}

  async getBookById(id: number): Promise<Book> {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        authors: true,
        categories: true,
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  editBookById() {}

  deleteBookById() {}
}
