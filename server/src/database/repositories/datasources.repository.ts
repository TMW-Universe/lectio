import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { RepositoryOptions } from '../../types/database/repository/repository-options.interface';

@Injectable()
export class DatasourcesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllEnabledDatasources(options?: RepositoryOptions) {
    return await (
      options?.transaction ?? this.databaseService
    ).datasource.findMany({
      where: {
        enabled: true,
      },
    });
  }
}
