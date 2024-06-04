-- AlterTable
ALTER TABLE `users` MODIFY `token` VARCHAR(512) NULL;

-- CreateTable
CREATE TABLE `customers` (
    `customerID` INTEGER NOT NULL AUTO_INCREMENT,
    `fullname` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `faceImageURL` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`customerID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `color_analysis_reports` (
    `analysisID` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL,
    `season` VARCHAR(191) NOT NULL,
    `colorPaletteImage` VARCHAR(191) NOT NULL,
    `colorHex` VARCHAR(191) NOT NULL,
    `explanation` VARCHAR(191) NOT NULL,
    `customerID` INTEGER NOT NULL,
    `workerID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`analysisID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `color_analysis_reports` ADD CONSTRAINT `color_analysis_reports_customerID_fkey` FOREIGN KEY (`customerID`) REFERENCES `customers`(`customerID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `color_analysis_reports` ADD CONSTRAINT `color_analysis_reports_workerID_fkey` FOREIGN KEY (`workerID`) REFERENCES `users`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;
