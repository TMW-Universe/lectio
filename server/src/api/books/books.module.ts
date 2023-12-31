import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { BooksRepository } from '../../database/repositories/books.repository';
import { BookChaptersRepository } from '../../database/repositories/book-chapters.repository';
import { ChaptersModule } from './chapters/chapters.module';

@Module({
  providers: [BooksService, BooksRepository, BookChaptersRepository],
  controllers: [BooksController],
  imports: [ChaptersModule],
})
export class BooksModule {}
