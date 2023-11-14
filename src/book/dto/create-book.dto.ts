// src/books/dto/create-book.dto.ts
import { Type } from 'class-transformer';
import {
  IsString,
  IsInt,
  IsDate,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsInt()
  @IsNotEmpty()
  pageCount: number;

  @IsNotEmpty()
  publishedDate: any;

  @IsString()
  @IsNotEmpty()
  thumbnailUrl: string;

  @IsString()
  shortDescription: string;

  @IsString()
  longDescription: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsArray()
  @ArrayNotEmpty()
  authors: number[]; // Array of author IDs

  @IsArray()
  @ArrayNotEmpty()
  categories: number[]; // Array of category IDs
}
