import { uuid } from '@tmw-universe/tmw-universe-types';
import { BookDatasourceStandard } from '../../types/datasources/book-datasource-standard.enum';
import { ExploreBooksFilterModel } from '../../models/book-datasource/explore-books-filters.model';
import { Datasource } from '@prisma/client';
import { BookInfoModel } from '../../models/books/book-info.model';
import { Stream } from 'stream';

export interface IBookDatasourceClient {
  readonly apiKey: string;
  readonly standard: BookDatasourceStandard;
  readonly datasource: Datasource;

  getCode: () => string;
  getId: () => uuid;

  exploreBooks: (
    filters: ExploreBooksFilterModel,
  ) => Promise<{ count: number; rows: BookInfoModel[] }>;

  getBookInfo: (bookCode: string) => Promise<BookInfoModel>;

  getBookChapterContent: (
    bookCode: string,
    chapterCode: string,
  ) => Promise<{ images: string[] }>;

  getImageByUrl: (url: string) => Promise<Stream>;
}
