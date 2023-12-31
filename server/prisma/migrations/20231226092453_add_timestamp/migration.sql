/*
  Warnings:

  - Added the required column `finishedReadingAt` to the `UserEndedChapters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserEndedChapters` ADD COLUMN `finishedReadingAt` DATETIME(3) NOT NULL;
