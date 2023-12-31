import { uuid } from '@tmw-universe/tmw-universe-types';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsUUID,
  Validate,
  ValidateNested,
} from 'class-validator';
import { isPast } from 'date-fns';

class EndedChapterDTO {
  @IsUUID('4')
  chapterId: uuid;

  @IsDate()
  @Validate((d: Date) => isPast(d))
  @Type(() => Date)
  finishedReadingAt: Date;
}

export class SyncEndedChaptersDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(0)
  @ArrayMaxSize(5000)
  @Type(() => EndedChapterDTO)
  chapters: EndedChapterDTO[];
}
