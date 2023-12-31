/*
  Warnings:

  - Added the required column `url` to the `Datasource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Datasource` ADD COLUMN `apiKey` VARCHAR(256) NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `url` VARCHAR(512) NOT NULL;
