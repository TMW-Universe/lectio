import { Module } from '@nestjs/common';
import { DatasourcesController } from './datasources.controller';
import { DatasourcesService } from './datasources.service';
import { DatasourcesRepository } from '../../database/repositories/datasources.repository';

@Module({
  controllers: [DatasourcesController],
  providers: [DatasourcesService, DatasourcesRepository],
})
export class DatasourcesModule {}
