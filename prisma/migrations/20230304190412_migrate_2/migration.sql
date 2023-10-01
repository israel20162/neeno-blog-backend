/*
  Warnings:

  - The `expires` column on the `session` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `session` DROP COLUMN `expires`,
    ADD COLUMN `expires` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `userType` ENUM('ADMIN', 'BASIC', 'EDITOR') NOT NULL DEFAULT 'BASIC';
