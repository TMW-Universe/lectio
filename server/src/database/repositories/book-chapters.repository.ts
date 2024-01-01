import { Prisma } from '@prisma/client';
import { RepositoryOptions } from '../../types/database/repository/repository-options.interface';
import { DatabaseService } from '../database.service';
import { Injectable } from '@nestjs/common';
import { uuid } from '@tmw-universe/tmw-universe-types';

@Injectable()
export class BookChaptersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async addBookChapters(
    bookChapters: Prisma.BookChapterUncheckedCreateInput[],
    options?: RepositoryOptions,
  ) {
    return await (
      options?.transaction ?? this.databaseService
    ).bookChapter.createMany({ data: bookChapters });
  }

  async findChapterById(chapterId: uuid, options?: RepositoryOptions) {
    return await (
      options?.transaction ?? this.databaseService
    ).bookChapter.findFirst({
      where: {
        id: chapterId,
      },
    });
  }

  async findChaptersByBookId(bookId: uuid, options?: RepositoryOptions) {
    return await (
      options?.transaction ?? this.databaseService
    ).bookChapter.findMany({
      where: {
        bookId,
      },
    });
  }

  async findChaptersWithUserReadStatsByBookId(
    userId: uuid,
    bookId: uuid,
    options?: RepositoryOptions,
  ) {
    return await (
      options?.transaction ?? this.databaseService
    ).bookChapter.findMany({
      where: {
        bookId,
      },
      include: {
        UserEndedChapters: {
          where: {
            userId,
          },
          select: {
            id: true,
          },
        },
      },
    });
  }

  async countImagesByChapter(chapterId: uuid, options?: RepositoryOptions) {
    return await (
      options?.transaction ?? this.databaseService
    ).chapterContent.count({
      where: {
        bookChapterId: chapterId,
      },
    });
  }

  async createChapterContentImages(
    chapterId: uuid,
    images: { imageId: uuid; number: number }[],
    options?: RepositoryOptions,
  ) {
    return await (
      options?.transaction ?? this.databaseService
    ).chapterContent.createMany({
      data: images.map(({ imageId: imageFileId, number }) => ({
        imageFileId,
        bookChapterId: chapterId,
        number,
      })),
    });
  }

  async findSortedChapterImagesById(
    chapterId: uuid,
    options?: RepositoryOptions,
  ) {
    return await (
      options?.transaction ?? this.databaseService
    ).chapterContent.findMany({
      where: {
        bookChapterId: chapterId,
      },
      orderBy: {
        number: 'asc',
      },
    });
  }

  async findNextChapterByBookIdAndChapterNumber(
    bookId: uuid,
    chapterNumber: number,
    options?: RepositoryOptions,
  ) {
    return await (
      options?.transaction ?? this.databaseService
    ).bookChapter.findFirst({
      where: {
        number: {
          gt: chapterNumber,
        },
        bookId,
      },
      orderBy: {
        number: 'asc',
      },
    });
  }

  async findPrevChapterByBookIdAndChapterNumber(
    bookId: uuid,
    chapterNumber: number,
    options?: RepositoryOptions,
  ) {
    return await (
      options?.transaction ?? this.databaseService
    ).bookChapter.findFirst({
      where: {
        number: {
          lt: chapterNumber,
        },
        bookId,
      },
      orderBy: {
        number: 'desc',
      },
    });
  }

  async findUserReadChaptersByBookId(
    userId: uuid,
    bookId: uuid,
    options?: RepositoryOptions,
  ) {
    return await (
      options?.transaction ?? this.databaseService
    ).bookChapter.findMany({
      where: {
        bookId,
      },
      include: {
        UserEndedChapters: {
          where: {
            userId,
          },
        },
      },
    });
  }
}
