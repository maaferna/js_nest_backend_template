/*
  Warnings:

  - You are about to drop the column `createdAt` on the `book_statuses` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `book_statuses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,bookId]` on the table `book_statuses` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "book_statuses" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "book_statuses_userId_bookId_key" ON "book_statuses"("userId", "bookId");
