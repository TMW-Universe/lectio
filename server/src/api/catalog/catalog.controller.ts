import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { ExploreBooksDTO } from 'src/dtos/catalog/explore-books.dto';
import { uuid } from '@tmw-universe/tmw-universe-types';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly explorerService: CatalogService) {}

  @Get('explore')
  async getBooksByFilter(@Query() { datasourceId, ...query }: ExploreBooksDTO) {
    return await this.explorerService.exploreBook(datasourceId, query);
  }

  @Get('add-book/:datasourceId/:bookId')
  async addBook(
    @Param('datasourceId', new ParseUUIDPipe({ version: '4' }))
    datasourceId: uuid,
    @Param('bookId') bookId: string,
  ) {
    return await this.explorerService.addBook(datasourceId, bookId);
  }

  @Post('rescan/:bookId')
  async rescanBookByBookId(
    // bookId is the database book id (not the datasource id)
    @Param('bookId', new ParseUUIDPipe({ version: '4' })) bookId: uuid,
  ) {
    return await this.explorerService.rescanBookByBookId(bookId);
  }
}
