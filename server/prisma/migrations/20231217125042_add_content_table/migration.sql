-- CreateTable
CREATE TABLE `ChapterContent` (
    `id` VARCHAR(36) NOT NULL,
    `imageFileId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bookChapterId` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChapterContent` ADD CONSTRAINT `ChapterContent_bookChapterId_fkey` FOREIGN KEY (`bookChapterId`) REFERENCES `BookChapter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
