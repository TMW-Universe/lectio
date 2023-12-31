import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { DatasourceDTO } from '../datasource/datasource.dto';
import { ExploreBooksFilterModel } from 'src/models/book-datasource/explore-books-filters.model';
import { Type } from 'class-transformer';

export class ExploreBooksDTO
  extends DatasourceDTO
  implements ExploreBooksFilterModel
{
  @IsString()
  @MaxLength(64)
  name: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  page?: number;
}
