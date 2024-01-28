import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { uuid } from '@tmw-universe/tmw-universe-types';
import {
  BOOK_DATASOURCES_PROVIDER,
  BookDatasourcesProvider,
} from 'src/clients/book-datasources/book-datasources.module';
import { ExploreBooksFilterModel } from 'src/models/book-datasource/explore-books-filters.model';
import { BooksRepository } from '../../database/repositories/books.repository';
import { DatabaseService } from '../../database/database.service';
import { BookChaptersRepository } from '../../database/repositories/book-chapters.repository';
import { AuthorsRepository } from '../../database/repositories/authors.repository';
import { BookCategoriesRepository } from '../../database/repositories/book-categories.repository';
import { WarehouseService } from '@tmw-universe/tmw-universe-nestjs-warehouse-sdk';
import { BookScanRepository } from '../../database/repositories/book-scan.repository';
import { addHours, isFuture } from 'date-fns';

@Injectable()
export class CatalogService {
  constructor(
    @Inject(BOOK_DATASOURCES_PROVIDER)
    private readonly bookDatasourcesProvider: BookDatasourcesProvider,
    private readonly booksRepository: BooksRepository,
    private readonly databaseService: DatabaseService,
    private readonly bookChaptersRepository: BookChaptersRepository,
    private readonly authorsRepository: AuthorsRepository,
    private readonly bookCategoriesRepository: BookCategoriesRepository,
    private readonly warehouseService: WarehouseService,
    private readonly bookScanRepository: BookScanRepository,
  ) {}

  async exploreBook(datasourceId: uuid, query: ExploreBooksFilterModel) {
    const books = await this.bookDatasourcesProvider
      .getDatasourceClient(datasourceId)
      .exploreBooks(query);

    const existingBooks =
      await this.booksRepository.getBooksByDatasourceIdAndDatasourceBookCodes(
        datasourceId,
        books.rows.map(({ code }) => code),
      );

    return {
      ...books,
      rows: books.rows.map((book) => ({
        ...book,
        isAdded: existingBooks.find((eb) => eb.datasourceBookId === book.code),
      })),
    };
  }

  async addBook(datasourceId: uuid, dsBookId: string) {
    const datasourceClient =
      this.bookDatasourcesProvider.getDatasourceClient(datasourceId);
    return await this.databaseService.$transaction(async (transaction) => {
      const existingBook =
        await this.booksRepository.findBookByDatasourceIdAndDatasourceBookId(
          datasourceId,
          dsBookId,
          {
            transaction,
          },
        );

      // The book has been added already
      if (existingBook) return existingBook;

      // Get book info
      const bookInfo = await datasourceClient.getBookInfo(dsBookId);

      // Get images
      const coverImage = await datasourceClient.getImageByUrl(
        bookInfo.coverUrl,
      );

      const { fileId: coverImageId } =
        await this.warehouseService.uploadFile(coverImage);

      // Write book info
      const book = await this.booksRepository.addBook(
        {
          datasourceBookId: bookInfo.code,
          name: bookInfo.name,
          synopsis: bookInfo.synopsis,
          publishedAt: null,
          language: bookInfo.language,
          datasourceId,
          coverImageId,
        },
        { transaction },
      );

      // Retrieve existing authors
      const existingAuthors = await this.authorsRepository.findAuthorsByName(
        bookInfo.authors,
        {
          transaction,
        },
      );

      const existingAuthorNames = existingAuthors.map(({ name }) => name);
      const newAuthorNames = bookInfo.authors.filter(
        (name) => !existingAuthorNames.includes(name),
      );

      // Create missing authors
      await this.authorsRepository.createAuthors(
        newAuthorNames.map((name) => ({
          name,
        })),
        {
          transaction,
        },
      );

      const newlyAddedAuthors = await this.authorsRepository.findAuthorsByName(
        newAuthorNames,
        { transaction },
      );

      // Assign all authors to the newly added book
      await this.authorsRepository.assignAuthors(
        [...newlyAddedAuthors, ...existingAuthors].map(({ id }) => id),
        book.id,
        {
          transaction,
        },
      );

      // Read existing categories
      const existingCategories =
        await this.bookCategoriesRepository.findCategoriesByName(
          bookInfo.categories,
          { transaction },
        );
      const existingCategoriesNames = existingCategories.map(
        ({ name }) => name,
      );
      const missingCategories = bookInfo.categories.filter(
        (name) => !existingCategoriesNames.includes(name),
      );

      // Create missing categories
      await this.bookCategoriesRepository.createCategories(
        missingCategories.map((name) => ({
          name,
        })),
        { transaction },
      );

      const newlyAddedCategories =
        await this.bookCategoriesRepository.findCategoriesByName(
          missingCategories,
          {
            transaction,
          },
        );

      // Assign all categories to the newly added book
      await this.bookCategoriesRepository.assignCategories(
        [...newlyAddedCategories, ...existingCategories].map(({ id }) => id),
        book.id,
        {
          transaction,
        },
      );

      // Write all chapters metadata
      await this.bookChaptersRepository.addBookChapters(
        bookInfo.chapters.map((chapter) => ({
          ...chapter,
          bookId: book.id,
        })),
        { transaction },
      );

      return book;
    });
  }

  async rescanBookByBookId(bookId: uuid) {
    return await this.databaseService.$transaction(async (transaction) => {
      // Check if any rescan has been run
      const latestScan = await this.bookScanRepository.findLatestScanByBookId(
        bookId,
        {
          transaction,
        },
      );

      if (latestScan && isFuture(addHours(latestScan.createdAt, 1)))
        throw new ForbiddenException();

      // Get the book
      const { BookChapter: chapters, ...book } =
        await this.booksRepository.findBookWithChaptersAndAuthorsById(bookId, {
          transaction,
        });

      // Generate datasource client
      const datasourceClient = this.bookDatasourcesProvider.getDatasourceClient(
        book.datasourceId,
      );

      // Read all chapters
      const latestBookData = await datasourceClient.getBookInfo(
        book.datasourceBookId,
      );

      // Update book info
      await this.booksRepository.updateBookById(
        bookId,
        {
          name: latestBookData.name,
          synopsis: latestBookData.synopsis,
          language: latestBookData.language,
        },
        { transaction },
      );

      // Detect new chapters
      const newChapters = latestBookData.chapters.filter(
        ({ code }) => !chapters.find((c) => c.code === code),
      );

      // Add missing chapters
      await this.bookChaptersRepository.addBookChapters(
        newChapters.map((chapter) => ({
          ...chapter,
          bookId: book.id,
        })),
        {
          transaction,
        },
      );

      // Create scan
      await this.bookScanRepository.create(bookId, { transaction });
    });
  }
}
