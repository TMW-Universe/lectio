import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { uuid } from '@tmw-universe/tmw-universe-types';
import { BookChaptersRepository } from '../../../database/repositories/book-chapters.repository';
import { DatabaseService } from '../../../database/database.service';
import {
  BOOK_DATASOURCES_PROVIDER,
  BookDatasourcesProvider,
} from '../../../clients/book-datasources/book-datasources.module';
import { BooksRepository } from '../../../database/repositories/books.repository';
import { WarehouseService } from '@tmw-universe/tmw-universe-nestjs-warehouse-sdk';
import { UserEndedChaptersRepository } from '../../../database/repositories/user-ended-chapters.repository';

@Injectable()
export class ChaptersService {
  constructor(
    private readonly bookChaptersRepository: BookChaptersRepository,
    private readonly databaseService: DatabaseService,
    private readonly booksRepository: BooksRepository,
    @Inject(BOOK_DATASOURCES_PROVIDER)
    private readonly bookDatasourcesProvider: BookDatasourcesProvider,
    private readonly warehouseService: WarehouseService,
    private readonly userEndedChaptersRepository: UserEndedChaptersRepository,
  ) {}

  async findChapterContentById(chapterId: uuid) {
    return await this.databaseService.$transaction(
      async (transaction) => {
        const chapter = await this.bookChaptersRepository.findChapterById(
          chapterId,
          { transaction },
        );

        if (!chapter) throw new NotFoundException();

        // If the chapter has no content it needs to be imported
        if (
          (await this.bookChaptersRepository.countImagesByChapter(chapterId, {
            transaction,
          })) <= 0
        ) {
          const book = await this.booksRepository.findBookById(chapter.bookId, {
            transaction,
          });

          const ds = this.bookDatasourcesProvider.getDatasourceClient(
            book.datasourceId,
          );

          // Import content
          const { images: imagesSrc } = await ds.getBookChapterContent(
            book.datasourceBookId,
            chapter.code,
          );

          // Upload images to warehouse
          const images = await Promise.all(
            imagesSrc.map(async (src) => {
              const img = await ds.getImageByUrl(src);
              return (await this.warehouseService.uploadFile(img)).fileId;
            }),
          );

          // Add images to the DB
          await this.bookChaptersRepository.createChapterContentImages(
            chapterId,
            images.map((imageId, number) => ({
              imageId,
              number,
            })),
            {
              transaction,
            },
          );
        }

        const images =
          await this.bookChaptersRepository.findSortedChapterImagesById(
            chapterId,
            { transaction },
          );

        return {
          images: await Promise.all(
            images.map(
              async (image) =>
                (
                  await this.warehouseService.generateFileAccess({
                    fileId: image.imageFileId,
                  })
                ).url,
            ),
          ),
          chapter,
          nextChapter:
            await this.bookChaptersRepository.findNextChapterByBookIdAndChapterNumber(
              chapter.bookId,
              chapter.number,
              {
                transaction,
              },
            ),
          prevChapter:
            await this.bookChaptersRepository.findPrevChapterByBookIdAndChapterNumber(
              chapter.bookId,
              chapter.number,
              {
                transaction,
              },
            ),
        };
      },
      { timeout: 20000 },
    );
  }

  async markChapterAsFinished(chapterId: uuid, userId: uuid) {
    await this.databaseService.$transaction(async (transaction) => {
      const chapter =
        await this.userEndedChaptersRepository.findByChapterAndUserId(
          chapterId,
          userId,
          { transaction },
        );

      if (chapter) return;

      await this.userEndedChaptersRepository.create(
        {
          userId,
          bookChapterId: chapterId,
        },
        {
          transaction,
        },
      );
    });
  }

  async syncEndedChapters(
    userId: uuid,
    chapters: { chapterId: uuid; finishedReadingAt: Date }[],
  ) {
    await this.databaseService.$transaction(async (transaction) => {
      // Find already synced chapters
      const alreadySyncIds = (
        await this.userEndedChaptersRepository.findChaptersByUserIdAndChapterIds(
          userId,
          chapters.map((c) => c.chapterId),
          { transaction },
        )
      ).map((c) => c.bookChapterId);

      // Filter and map chapters to sync
      const toSync = chapters
        .filter((c) => !alreadySyncIds.includes(c.chapterId))
        .map(({ chapterId: bookChapterId, ...d }) => ({
          ...d,
          bookChapterId,
          userId,
        }));

      // Add them to the DB
      await this.userEndedChaptersRepository.bulkCreate(toSync, {
        transaction,
      });
    });
  }
}
