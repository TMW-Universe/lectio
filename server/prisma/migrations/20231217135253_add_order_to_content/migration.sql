/*
  Warnings:

  - Added the required column `number` to the `ChapterContent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ChapterContent` ADD COLUMN `number` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `ChapterContent_bookChapterId_number_idx` ON `ChapterContent`(`bookChapterId`, `number`);
