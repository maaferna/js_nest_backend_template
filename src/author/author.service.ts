// src/authors/author.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Author } from '@prisma/client';
import { DatabaseConnectionService } from '../database_connection/database_connection.service';
import { CreateAuthorDto } from './dto/create-author.dto';

@Injectable()
export class AuthorService {
  constructor(private prisma: DatabaseConnectionService) {}

  async createAuthor(createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.prisma.author.create({
      data: createAuthorDto,
    });
  }

  async getAllAuthors(): Promise<Author[]> {
    return this.prisma.author.findMany();
  }

  async getAuthorById(authorId: number): Promise<Author> {
    const author = await this.prisma.author.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      throw new NotFoundException(`Author with ID ${authorId} not found`);
    }

    return author;
  }

  // You can add more methods for creating, updating, and deleting authors as needed.
}

