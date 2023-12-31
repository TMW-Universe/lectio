import { Module } from '@nestjs/common';
import {
  AuthGuard,
  AuthModule,
} from '@tmw-universe/tmw-universe-nestjs-auth-utils';
import { getEnv } from './utils/config/get-env';
import { WarehouseModule } from '@tmw-universe/tmw-universe-nestjs-warehouse-sdk';
import { CatalogModule } from './api/catalog/catalog.module';
import { BookDatasourcesModule } from './clients/book-datasources/book-datasources.module';
import { DatasourcesModule } from './api/datasources/datasources.module';
import { DatabaseModule } from './database/database.module';
import { BooksModule } from './api/books/books.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    AuthModule.register({
      authHost: getEnv().auth.host,
      configRetryDelay: getEnv().auth.configRetryDelay,
      domain: getEnv().domain,
    }),
    WarehouseModule.registerAsync(async () => {
      const { warehouseApiKey: apiKey, warehouseHost: host } = getEnv();

      return {
        apiKey,
        host,
      };
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    BookDatasourcesModule.register(),
    DatabaseModule,
    CatalogModule,
    DatasourcesModule,
    BooksModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
