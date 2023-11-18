/* eslint-disable prettier/prettier */
import * as fs from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BookData {
  _id: number;
  title: string;
  isbn: string;
  pageCount: number;
  publishedDate: { $date: string };
  thumbnailUrl: string;
  shortDescription: string;
  longDescription?: string;
  status: string;
  authors: string[];
  categories: string[];
}

class ImportCommand {
  private static readonly jsonFilePath = './scripts/amazon.books.json';
  private static isErrorMessage(error: unknown): error is { message: string } {
    return typeof error === 'object' && error !== null && 'message' in error;
  }
  public static async run() {
    try {
      const data: BookData[] = this.readJsonFile();
      let newBooksCount = 0;

      for (const item of data) {
        try {
          const {
            title,
            isbn,
            pageCount,
            publishedDate,
            thumbnailUrl,
            shortDescription,
            longDescription,
            status,
            authors: authorNames,
            categories: categoryNames,
          } = item;

          // Create authors and associate them with the book
          const authorInstances = await Promise.all(
            authorNames.map((authorName) =>
              this.upsertAuthor({ name: authorName }),
            ),
          );

          // Create categories and associate them with the book
          const categoryInstances = await Promise.all(
            categoryNames.map((categoryName) => this.upsertCategory({ name: categoryName })),
          );

          // Create the new book
          await prisma.book.create({
            data: {
              title,
              isbn,
              pageCount,
              publishedDate: new Date(publishedDate.$date),
              thumbnailUrl,
              shortDescription,
              longDescription,
              status,
              authors: {
                connect: authorInstances.map((author) => ({ id: author.id })),
              },
              categories: {
                connect: categoryInstances.map((category) => ({ id: category.id })),
              },
            },
          });

          newBooksCount += 1; // Increment the counter
        } catch (e) {
          // Handle errors by logging an error message and continuing to the next item
          console.error(`Error importing book: ${e}`);
          continue;
        }
      }

      if (newBooksCount > 0) {
        console.log(`Successfully added ${newBooksCount} new book(s).`);
      } else {
        console.log('No new books added.');
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(`Error importing book: ${e}`);
      } else {
        console.error('An unknown error occurred while importing the book.');
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  private static readJsonFile(): BookData[] {
    const jsonFileContents = fs.readFileSync(this.jsonFilePath, 'utf-8');
    return JSON.parse(jsonFileContents);
  }

  private static async upsertAuthor(author: { name: string }) {
    return prisma.author.upsert({
      where: { name: author.name },
      update: {},
      create: { name: author.name },
    });
  }

  private static async upsertCategory(category: { name: string }) {
    return prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });
  }
}

// Run the import command
ImportCommand.run();

