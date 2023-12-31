/*
  Warnings:

  - Made the column `enabled` on table `Datasource` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Datasource` MODIFY `enabled` BOOLEAN NOT NULL DEFAULT true;
