import { Injectable } from '@nestjs/common';
import { uuid } from '@tmw-universe/tmw-universe-types';
import { RepositoryOptions } from '../../types/database/repository/repository-options.interface';
import { DatabaseService } from '../database.service';

@Injectable()
export class BookScanRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findLatestScanByBookId(bookId: uuid, options?: RepositoryOptions) {
    return await (
      options?.transaction ?? this.databaseService
    ).bookScan.findFirst({
      where: {
        bookId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(bookId: uuid, options?: RepositoryOptions) {
    return await (options?.transaction ?? this.databaseService).bookScan.create(
      {
        data: {
          bookId,
        },
      },
    );
  }
}
