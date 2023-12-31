-- CreateTable
CREATE TABLE `UserEndedChapters` (
    `id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `bookChapterId` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserEndedChapters` ADD CONSTRAINT `UserEndedChapters_bookChapterId_fkey` FOREIGN KEY (`bookChapterId`) REFERENCES `BookChapter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
