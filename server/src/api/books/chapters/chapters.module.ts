import { Module } from '@nestjs/common';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { BookChaptersRepository } from '../../../database/repositories/book-chapters.repository';
import { BooksRepository } from '../../../database/repositories/books.repository';
import { UserEndedChaptersRepository } from '../../../database/repositories/user-ended-chapters.repository';

@Module({
  controllers: [ChaptersController],
  providers: [
    ChaptersService,
    BookChaptersRepository,
    BooksRepository,
    UserEndedChaptersRepository,
  ],
})
export class ChaptersModule {}
