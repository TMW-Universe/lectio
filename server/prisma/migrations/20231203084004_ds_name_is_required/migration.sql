/*
  Warnings:

  - Made the column `name` on table `Datasource` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Datasource` MODIFY `name` VARCHAR(32) NOT NULL;
