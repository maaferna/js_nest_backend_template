import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { BookService } from './book.service';
import { GetUser } from '@app/auth/decorator';
import { CreateBookDto } from './dto/create-book.dto';

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

  @Get()
  getBookById() {}

  @Patch()
  editBookById() {}

  @Delete()
  deleteBookById() {}
}
