import {
  DynamicModule,
  Global,
  Module,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { uuid } from '@tmw-universe/tmw-universe-types';
import { IBookDatasourceClient } from './book-datasource-client.interface';
import { BookDatasourceStandard } from '../../types/datasources/book-datasource-standard.enum';
import { MangasApiDatasourceClient } from './standards/mangas-api/mangas-api.datasource-client';

export const BOOK_DATASOURCES_PROVIDER = 'BOOK_DATASOURCES_PROVIDER';

export type BookDatasourcesProvider = {
  datasourceClients: IBookDatasourceClient[];
  getDatasourceClient: (datasourceId: uuid) => IBookDatasourceClient;
};

@Global()
@Module({})
export class BookDatasourcesModule {
  static async register(): Promise<DynamicModule> {
    const client = new DatabaseService();

    const datasources = await client.datasource.findMany({
      where: {
        enabled: true,
      },
    });

    const datasourceClients = datasources.map((ds) => {
      switch (ds.standard) {
        case BookDatasourceStandard.MANGAS_API:
          return new MangasApiDatasourceClient(ds);
      }
      throw new Error(`No book standard available for ${ds.standard}`);
    });

    const getDatasourceClient = (id: uuid) => {
      const ds = datasourceClients.find((sd) => sd.getId() === id);
      if (ds) return ds;

      throw new NotFoundException();
    };

    return {
      module: BookDatasourcesModule,
      providers: [
        {
          provide: BOOK_DATASOURCES_PROVIDER,
          useValue: {
            datasourceClients,
            getDatasourceClient,
          } satisfies BookDatasourcesProvider,
        },
      ],
      exports: [BOOK_DATASOURCES_PROVIDER],
    };
  }
}
