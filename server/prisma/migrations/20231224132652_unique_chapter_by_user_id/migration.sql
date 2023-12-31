/*
  Warnings:

  - A unique constraint covering the columns `[userId,bookChapterId]` on the table `UserEndedChapters` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserEndedChapters_userId_bookChapterId_key` ON `UserEndedChapters`(`userId`, `bookChapterId`);
