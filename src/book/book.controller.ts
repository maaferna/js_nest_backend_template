import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookService } from './book.service';
import { GetUser } from '@app/auth/decorator';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}
  @Post()
  async createBook(@Body(ValidationPipe) createBookDto: CreateBookDto) {
    const createdBook = await this.bookService.createBook(createBookDto);
    return createdBook;
  }

  @Get()
  getBooks() {}

  @Get(':id')
  async getBookById(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    const book = await this.bookService.getBookById(id);
    return book;
  }

  @Patch()
  editBookById() {}

  @Delete()
  deleteBookById() {}
}
