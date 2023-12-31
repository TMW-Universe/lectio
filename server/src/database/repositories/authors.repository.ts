import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { Prisma } from '@prisma/client';
import { RepositoryOptions } from '../../types/database/repository/repository-options.interface';
import { uuid } from '@tmw-universe/tmw-universe-types';

@Injectable()
export class AuthorsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createAuthors(
    authors: Prisma.AuthorUncheckedCreateInput[],
    options?: RepositoryOptions,
  ) {
    return await (
      options?.transaction ?? this.databaseService
    ).author.createMany({
      data: authors,
    });
  }

  async findAuthorsByName(authorNames: string[], options?: RepositoryOptions) {
    return await (options?.transaction ?? this.databaseService).author.findMany(
      {
        where: {
          name: {
            in: authorNames,
          },
        },
      },
    );
  }

  async assignAuthors(
    authorIds: uuid[],
    bookId: uuid,
    options?: RepositoryOptions,
  ) {
    return await (options?.transaction).authorAssignation.createMany({
      data: authorIds.map((authorId) => ({
        authorId,
        bookId,
      })),
    });
  }
}
