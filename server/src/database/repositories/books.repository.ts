import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { uuid } from '@tmw-universe/tmw-universe-types';
import { RepositoryOptions } from '../../types/database/repository/repository-options.interface';
import { Book, Prisma } from '@prisma/client';
import { generateQueryFromDataEntry } from 'data-fetch-manager-prisma-querier';
import { DataFetchEntryObject } from 'data-fetch-manager-entry-service';
import { BOOK_DMD } from '../model-definitions/book.data-model-definition';

@Injectable()
export class BooksRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findBookByDatasourceIdAndDatasourceBookId(
    datasourceId: uuid,
    dsBookId: string,
    options?: RepositoryOptions,
  ) {
    return await (options?.transaction ?? this.databaseService).book.findFirst({
      where: {
        datasourceId,
        datasourceBookId: dsBookId,
      },
    });
  }

  async addBook(
    bookData: Prisma.BookUncheckedCreateInput,
    options?: RepositoryOptions,
  ) {
    return await (options?.transaction ?? this.databaseService).book.create({
      data: bookData,
    });
  }

  async getBooksByDatasourceIdAndDatasourceBookCodes(
    datasourceId: uuid,
    datasourceBookCodes: string[],
    options?: RepositoryOptions,
  ) {
    return await (options?.transaction ?? this.databaseService).book.findMany({
      where: {
        datasourceId,
        datasourceBookId: {
          in: datasourceBookCodes,
        },
      },
    });
  }

  async findBooks(
    dataEntryObject: DataFetchEntryObject<Book>,
    options?: RepositoryOptions,
  ) {
    const { query, countQuery } = await generateQueryFromDataEntry(
      dataEntryObject,
      BOOK_DMD,
    );

    const rows = await (
      options?.transaction ?? this.databaseService
    ).book.findMany(query);
    const count = await (
      options?.transaction ?? this.databaseService
    ).book.count(countQuery);

    return {
      rows,
      count,
    };
  }

  async findBookById(bookId: uuid, options?: RepositoryOptions) {
    return await (options?.transaction ?? this.databaseService).book.findFirst({
      where: { id: bookId },
    });
  }

  async findBookByIdIncludingCategories(
    bookId: uuid,
    options?: RepositoryOptions,
  ) {
    return await (options?.transaction ?? this.databaseService).book.findFirst({
      where: { id: bookId },
      include: {
        CategoriesAssignation: {
          include: {
            BookCategory: true,
          },
        },
      },
    });
  }
}