-- CreateTable
CREATE TABLE "book_statuses" (
    "id" SERIAL NOT NULL,
    "wantToRead" BOOLEAN NOT NULL,
    "currentlyRead" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "book_statuses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "book_statuses" ADD CONSTRAINT "book_statuses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_statuses" ADD CONSTRAINT "book_statuses_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
