/*
  Warnings:

  - A unique constraint covering the columns `[fullname]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `customers` MODIFY `faceImageURL` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `faceImageURL` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `customers_fullname_key` ON `customers`(`fullname`);
