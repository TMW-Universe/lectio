import { uuid } from '@tmw-universe/tmw-universe-types';
import { IsString, IsUUID } from 'class-validator';

export class DatasourceDTO {
  @IsString()
  @IsUUID('4')
  datasourceId: uuid;
}
