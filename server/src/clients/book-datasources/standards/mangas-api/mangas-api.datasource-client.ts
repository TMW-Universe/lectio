import { ExploreBooksFilterModel } from '../../../../models/book-datasource/explore-books-filters.model';
import { BookInfoModel } from '../../../../models/books/book-info.model';
import { BookDatasourceClient } from '../../book-datasource-client.abstract';
import { IBookDatasourceClient } from '../../book-datasource-client.interface';

export class MangasApiDatasourceClient
  extends BookDatasourceClient
  implements IBookDatasourceClient
{
  // Retrieve info

  public async exploreBooks(filters: ExploreBooksFilterModel) {
    const { count, books } = await super.request<{
      count: number;
      books: BookInfoModel[];
    }>('explore', {
      params: filters,
    });
    return {
      count,
      rows: books,
    };
  }

  public async getBookInfo(bookCode: string) {
    return await this.request<BookInfoModel>(
      `manga/${encodeURIComponent(bookCode)}/info`,
    );
  }

  public async getBookChapterContent(bookCode: string, chapterCode: string) {
    return await this.request<{ images: string[] }>(
      `manga/${encodeURIComponent(bookCode)}/chapter/${encodeURIComponent(
        chapterCode,
      )}/content`,
    );
  }
}
