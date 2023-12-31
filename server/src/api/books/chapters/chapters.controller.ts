import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { uuid } from '@tmw-universe/tmw-universe-types';
import { UserId } from '@tmw-universe/tmw-universe-nestjs-auth-utils';
import { SyncEndedChaptersDTO } from '../../../dtos/book-chapters/sync-ended-chapters.dto';

@Controller('books/chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get(':chapterId/content')
  async getChapterById(
    @Param('chapterId', new ParseUUIDPipe({ version: '4' })) chapterId: uuid,
  ) {
    return await this.chaptersService.findChapterContentById(chapterId);
  }

  @Post(':chapterId/finished')
  async markChapterAsFinished(
    @Param('chapterId', new ParseUUIDPipe({ version: '4' })) chapterId: uuid,
    @UserId() userId: uuid,
  ) {
    return await this.chaptersService.markChapterAsFinished(chapterId, userId);
  }

  @Post('sync-ended-chapters')
  async syncEndedChapters(
    @UserId() userId: uuid,
    @Body() { chapters }: SyncEndedChaptersDTO,
  ) {
    return await this.chaptersService.syncEndedChapters(userId, chapters);
  }
}
