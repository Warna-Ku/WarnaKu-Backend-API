/*
  Warnings:

  - You are about to drop the column `colorHex` on the `color_analysis_reports` table. All the data in the column will be lost.
  - You are about to drop the column `colorPaletteImage` on the `color_analysis_reports` table. All the data in the column will be lost.
  - You are about to drop the column `explanation` on the `color_analysis_reports` table. All the data in the column will be lost.
  - Added the required column `paletteID` to the `color_analysis_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `color_analysis_reports` DROP COLUMN `colorHex`,
    DROP COLUMN `colorPaletteImage`,
    DROP COLUMN `explanation`,
    ADD COLUMN `paletteID` INTEGER NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `customers` ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `colors` (
    `colorID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `imageURL` VARCHAR(191) NOT NULL,
    `paletteID` INTEGER NOT NULL,

    PRIMARY KEY (`colorID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `palettes` (
    `paletteID` INTEGER NOT NULL AUTO_INCREMENT,
    `season` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `imageURL` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `palettes_season_key`(`season`),
    PRIMARY KEY (`paletteID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `colors` ADD CONSTRAINT `colors_paletteID_fkey` FOREIGN KEY (`paletteID`) REFERENCES `palettes`(`paletteID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `color_analysis_reports` ADD CONSTRAINT `color_analysis_reports_paletteID_fkey` FOREIGN KEY (`paletteID`) REFERENCES `palettes`(`paletteID`) ON DELETE RESTRICT ON UPDATE CASCADE;
