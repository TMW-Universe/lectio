import { Inject, Injectable } from '@nestjs/common';
import {
  BOOK_DATASOURCES_PROVIDER,
  BookDatasourcesProvider,
} from '../../clients/book-datasources/book-datasources.module';

@Injectable()
export class DatasourcesService {
  constructor(
    @Inject(BOOK_DATASOURCES_PROVIDER)
    private readonly bookDatasources: BookDatasourcesProvider,
  ) {}

  async getDatasourcesList() {
    return this.bookDatasources.datasourceClients.map(
      ({ datasource: { code, name, id, url, standard, createdAt } }) => ({
        code,
        name,
        id,
        url,
        standard,
        createdAt,
      }),
    );
  }
}
