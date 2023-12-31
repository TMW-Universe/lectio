/*
  Warnings:

  - You are about to drop the column `scrapperBookId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `scrapperId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the `Scrapper` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[datasourceBookId,datasourceId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `datasourceBookId` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `datasourceId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Book` DROP FOREIGN KEY `Book_scrapperId_fkey`;

-- DropIndex
DROP INDEX `Book_scrapperBookId_scrapperId_key` ON `Book`;

-- AlterTable
ALTER TABLE `Book` DROP COLUMN `scrapperBookId`,
    DROP COLUMN `scrapperId`,
    ADD COLUMN `datasourceBookId` VARCHAR(32) NOT NULL,
    ADD COLUMN `datasourceId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Scrapper`;

-- CreateTable
CREATE TABLE `Datasource` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(16) NOT NULL,

    UNIQUE INDEX `Datasource_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Book_datasourceBookId_datasourceId_key` ON `Book`(`datasourceBookId`, `datasourceId`);

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_datasourceId_fkey` FOREIGN KEY (`datasourceId`) REFERENCES `Datasource`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
