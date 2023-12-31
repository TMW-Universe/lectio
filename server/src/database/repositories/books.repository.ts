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

  async findUserBooksEndedChaptersStats(
    userId: uuid,
    booksId: uuid[],
    options?: RepositoryOptions,
  ) {
    return (
      await (options?.transaction ?? this.databaseService).$queryRaw<
        {
          id: uuid;
          chaptersCount: number;
          userReadChaptersCount: number;
          nextChapterId?: uuid | null;
        }[]
      >`SELECT b.id, (
            SELECT COUNT(bc.id)
            FROM BookChapter bc
            WHERE bc.bookId = b.id
          ) AS 'chaptersCount',
          (
            SELECT COUNT(uec.id)
            FROM BookChapter bc
            INNER JOIN UserEndedChapters uec ON uec.bookChapterId = bc.id
            WHERE bc.bookId = b.id
            AND uec.userId = ${userId}
          ) AS 'userReadChaptersCount',
          (
            SELECT bc2.id
            FROM BookChapter bc2
            WHERE bc2.bookId = b.id
            AND bc2.number > (
              SELECT bc3.number
              FROM BookChapter bc3
              INNER JOIN UserEndedChapters uec2 ON uec2.bookChapterId = bc3.id 
              WHERE uec2.userId = ${userId}
              AND bc3.bookId = b.id
              ORDER BY bc3.\`number\` ASC
              LIMIT 1
            )
            ORDER BY bc2.\`number\` ASC
            LIMIT 1
          ) AS 'nextChapterId'
        FROM Book b
        WHERE b.id IN (${Prisma.join(booksId)});`
    ).map((r) => ({
      ...r,
      chaptersCount: +r.chaptersCount.toString(),
      userReadChaptersCount: +r.userReadChaptersCount.toString(),
    }));
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
