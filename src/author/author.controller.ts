// src/authors/author.controller.ts
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthorService } from './author.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CreateAuthorDto } from './dto/create-author.dto';

@UseGuards(JwtGuard)
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  createAuthor(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.createAuthor(createAuthorDto);
  }

  @Get()
  async getAllAuthors() {
    return this.authorService.getAllAuthors();
  }

  @Get(':id')
  async getAuthorById(@Param('id') authorId: number) {
    return this.authorService.getAuthorById(authorId);
  }
}
