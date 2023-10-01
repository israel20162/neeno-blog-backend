/*
  Warnings:

  - The `emailVerified` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    DROP COLUMN `emailVerified`,
    ADD COLUMN `emailVerified` BOOLEAN NULL;
