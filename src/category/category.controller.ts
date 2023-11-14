// src/categories/category.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Prisma } from '@prisma/client';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body() createCategoryDto: Prisma.CategoryCreateInput) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') categoryId: number) {
    return this.categoryService.getCategoryById(categoryId);
  }

  // You can add more controller methods for creating, updating, and deleting categories as needed.
}
