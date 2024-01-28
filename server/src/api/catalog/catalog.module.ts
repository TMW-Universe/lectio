import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { BooksRepository } from '../../database/repositories/books.repository';
import { BookChaptersRepository } from '../../database/repositories/book-chapters.repository';
import { AuthorsRepository } from '../../database/repositories/authors.repository';
import { BookCategoriesRepository } from '../../database/repositories/book-categories.repository';
import { BookScanRepository } from '../../database/repositories/book-scan.repository';

@Module({
  controllers: [CatalogController],
  providers: [
    CatalogService,
    BooksRepository,
    BookChaptersRepository,
    AuthorsRepository,
    BookCategoriesRepository,
    BookScanRepository,
  ],
})
export class CatalogModule {}
