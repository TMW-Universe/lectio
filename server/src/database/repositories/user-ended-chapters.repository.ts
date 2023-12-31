import { Injectable } from '@nestjs/common';
import { uuid } from '@tmw-universe/tmw-universe-types';
import { RepositoryOptions } from '../../types/database/repository/repository-options.interface';
import { DatabaseService } from '../database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserEndedChaptersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByChapterAndUserId(
    chapterId: uuid,
    userId: uuid,
    options?: RepositoryOptions,
  ) {
    return await (
      options?.transaction ?? this.databaseService
    ).userEndedChapters.findFirst({
      where: {
        bookChapterId: chapterId,
        userId,
      },
    });
  }

  async create(
    data: Prisma.UserEndedChaptersUncheckedCreateInput,
    options?: RepositoryOptions,
  ) {
    return await (
      options?.transaction ?? this.databaseService
    ).userEndedChapters.create({
      data,
    });
  }

  async bulkCreate(
    data: Prisma.UserEndedChaptersUncheckedCreateInput[],
    options?: RepositoryOptions,
  ) {
    return await (
      options?.transaction ?? this.databaseService
    ).userEndedChapters.createMany({
      data,
    });
  }

  async findChaptersByUserIdAndChapterIds(
    userId: uuid,
    chapterIds: uuid[],
    options?: RepositoryOptions,
  ) {
    return (
      options?.transaction ?? this.databaseService
    ).userEndedChapters.findMany({
      where: {
        userId,
        bookChapterId: {
          in: chapterIds,
        },
      },
    });
  }
}
