import { BookStatus } from '../../types/books/book-status.enum';
import { BookChapterModel } from './book-chapter.model';

export interface BookInfoModel {
  code: string;
  name: string;
  synopsis: string;
  status: BookStatus;
  categories: string[];
  language: string; // <- Language code
  coverUrl: string;

  // Written
  authors: string[];

  // Chapters
  chapters: BookChapterModel[];
}
