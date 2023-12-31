import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { Prisma } from '@prisma/client';
import { RepositoryOptions } from '../../types/database/repository/repository-options.interface';
import { uuid } from '@tmw-universe/tmw-universe-types';

@Injectable()
export class BookCategoriesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createCategories(
    categories: Prisma.BookCategoryUncheckedCreateInput[],
    options?: RepositoryOptions,
  ) {
    return await (
      options?.transaction ?? this.databaseService
    ).bookCategory.createMany({
      data: categories,
    });
  }

  async findCategoriesByName(
    categoryNames: string[],
    options?: RepositoryOptions,
  ) {
    return await (
      options?.transaction ?? this.databaseService
    ).bookCategory.findMany({
      where: {
        name: {
          in: categoryNames,
        },
      },
    });
  }

  async assignCategories(
    categoryIds: uuid[],
    bookId: uuid,
    options?: RepositoryOptions,
  ) {
    return await (options?.transaction).categoriesAssignation.createMany({
      data: categoryIds.map((bookCategoryId) => ({
        bookCategoryId,
        bookId,
      })),
    });
  }
}
