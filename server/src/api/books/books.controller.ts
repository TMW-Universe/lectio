import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import {
  DataFetchEntryDTO,
  DataFetchParser,
} from 'data-fetch-manager-entry-service';
import { Book } from '@prisma/client';
import { BOOK_DMD } from '../../database/model-definitions/book.data-model-definition';
import { uuid } from '@tmw-universe/tmw-universe-types';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('list')
  async findBooks(@Query() dataEntry: DataFetchEntryDTO) {
    return await this.booksService.findBooks(
      new DataFetchParser<Book>(dataEntry, BOOK_DMD).parse(),
    );
  }

  @Get(':bookId')
  async getBookById(
    @Param('bookId', new ParseUUIDPipe({ version: '4' })) bookId: uuid,
  ) {
    return await this.booksService.findBookById(bookId);
  }

  @Get(':bookId/chapters')
  async getBookChaptersById(
    @Param('bookId', new ParseUUIDPipe({ version: '4' })) bookId: uuid,
  ) {
    return { chapters: await this.booksService.findChaptersByBookId(bookId) };
  }
}