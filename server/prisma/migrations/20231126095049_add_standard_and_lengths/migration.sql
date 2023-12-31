/*
  Warnings:

  - You are about to alter the column `name` on the `BookCategory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(64)`.

*/
-- AlterTable
ALTER TABLE `Book` MODIFY `datasourceBookId` VARCHAR(64) NOT NULL;

-- AlterTable
ALTER TABLE `BookCategory` MODIFY `name` VARCHAR(64) NOT NULL;

-- AlterTable
ALTER TABLE `Datasource` ADD COLUMN `standard` VARCHAR(32) NULL,
    MODIFY `code` VARCHAR(32) NOT NULL;
