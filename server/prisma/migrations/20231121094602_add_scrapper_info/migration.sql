/*
  Warnings:

  - A unique constraint covering the columns `[scrapperBookId,scrapperId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scrapperBookId` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scrapperId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Book` ADD COLUMN `scrapperBookId` VARCHAR(32) NOT NULL,
    ADD COLUMN `scrapperId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Scrapper` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(16) NOT NULL,

    UNIQUE INDEX `Scrapper_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Book_scrapperBookId_scrapperId_key` ON `Book`(`scrapperBookId`, `scrapperId`);

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_scrapperId_fkey` FOREIGN KEY (`scrapperId`) REFERENCES `Scrapper`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
