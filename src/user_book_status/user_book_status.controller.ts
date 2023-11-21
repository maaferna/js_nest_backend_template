import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserBookStatusService } from './user_book_status.service';
import { CreateBookStatusDto } from './dto/create-book-status.dto';
import { JwtGuard } from '../auth/guard';

@Controller()
export class UserBookStatusController {
  constructor(private readonly userBookStatusService: UserBookStatusService) {}

  @UseGuards(JwtGuard)
  @Post('users/:userId/book-statuses')
  create(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createBookStatusDto: CreateBookStatusDto,
  ) {
    return this.userBookStatusService.create(userId, createBookStatusDto);
  }

  @UseGuards(JwtGuard)
  @Get('users/:userId/book-statuses/getall')
  findAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.userBookStatusService.findAllByUserId(userId);
  }
}
