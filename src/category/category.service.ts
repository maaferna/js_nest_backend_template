// src/categories/category.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { DatabaseConnectionService } from '../database_connection/database_connection.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: DatabaseConnectionService) {}

  async createCategory(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async getAllCategories(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async getCategoryById(categoryId: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return category;
  }

  // You can add more methods for creating, updating, and deleting categories as needed.
}
