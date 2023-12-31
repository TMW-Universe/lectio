import { Book } from '@prisma/client';
import {
  DataModelDefinition,
  DataType,
} from 'data-fetch-manager-entry-service';

export const BOOK_DMD = new DataModelDefinition<Book>({
  id: {
    dataType: DataType.STRING,
  },
  name: {
    dataType: DataType.STRING,
    isSearchable: true,
  },
  synopsis: {
    dataType: DataType.STRING,
    isSearchable: true,
  },
  language: {
    dataType: DataType.STRING,
  },
  publishedAt: {
    dataType: DataType.DATE,
  },
  createdAt: {
    dataType: DataType.DATE,
  },
  updatedAt: {
    dataType: DataType.DATE,
  },

  // IDs

  coverImageId: {
    dataType: DataType.STRING,
  },
  datasourceBookId: {
    dataType: DataType.STRING,
  },
  datasourceId: {
    dataType: DataType.STRING,
  },
});
