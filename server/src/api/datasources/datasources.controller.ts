import { Controller, Get } from '@nestjs/common';
import { DatasourcesService } from './datasources.service';

@Controller('datasources')
export class DatasourcesController {
  constructor(private readonly serversService: DatasourcesService) {}

  @Get('list')
  async getDatasourcesList() {
    return await this.serversService.getDatasourcesList();
  }
}
