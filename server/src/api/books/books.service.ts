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

  async findBooks(dataEntryObject: DataFetchEntryObject<Book>) {
    const books = await this.booksRepository.findBooks(dataEntryObject);
    return {
      ...books,
      rows: await Promise.all(
        books.rows.map(async (book) => ({
          ...book,
          coverImageUrl: (
            await this.warehouseService.generateFileAccess({
              fileId: book.coverImageId,
            })
          ).url,
        })),
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

  async findChaptersByBookId(bookId: uuid) {
    return await this.bookChaptersRepository.findChaptersByBookId(bookId);
  }
}
