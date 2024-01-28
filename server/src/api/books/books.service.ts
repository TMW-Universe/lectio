import { Injectable } from '@nestjs/common';
import { BooksRepository } from '../../database/repositories/books.repository';
import { DataFetchEntryObject } from 'data-fetch-manager-entry-service';
import { Book } from '@prisma/client';
import { WarehouseService } from '@tmw-universe/tmw-universe-nestjs-warehouse-sdk';
import { uuid } from '@tmw-universe/tmw-universe-types';
import { BookChaptersRepository } from '../../database/repositories/book-chapters.repository';

@Injectable()
export class BooksService {
  constructor(
    private readonly booksRepository: BooksRepository,
    private readonly bookChaptersRepository: BookChaptersRepository,
    private readonly warehouseService: WarehouseService,
  ) {}

  async findUserBooks(
    userId: uuid,
    dataEntryObject: DataFetchEntryObject<Book>,
  ) {
    const books = await this.booksRepository.findBooks(dataEntryObject);
    const bookStats =
      await this.booksRepository.findUserBooksEndedChaptersStats(
        userId,
        books.rows.map((b) => b.id),
      );
    return {
      ...books,
      rows: await Promise.all(
        books.rows.map(async (book) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id: _, ...stats } = bookStats.find((b) => b.id === book.id);

          return {
            ...book,
            stats,
            coverImageUrl: (
              await this.warehouseService.generateFileAccess({
                fileId: book.coverImageId,
              })
            ).url,
          };
        }),
      ),
    };
  }

  async findBookById(bookId: uuid) {
    const { CategoriesAssignation, ...book } =
      await this.booksRepository.findBookByIdIncludingCategories(bookId);

    const categories = CategoriesAssignation.map((ca) => ca.BookCategory);
    return {
      ...book,
      categories,
      coverImageUrl: (
        await this.warehouseService.generateFileAccess({
          fileId: book.coverImageId,
        })
      ).url,
    };
  }

  async findChaptersWithUserInfoByBookId(userId: uuid, bookId: uuid) {
    return await this.bookChaptersRepository.findChaptersWithUserReadStatsByBookId(
      userId,
      bookId,
    );
  }

  async findUserReadChaptersByBookId(userId: uuid, bookId: uuid) {
    return await this.bookChaptersRepository.findUserReadChaptersByBookId(
      userId,
      bookId,
    );
  }
}
