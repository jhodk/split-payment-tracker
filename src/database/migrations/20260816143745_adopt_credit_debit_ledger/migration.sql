/*
  Warnings:

  - You are about to drop the `PaymentSplit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `PaymentSplit` DROP FOREIGN KEY `PaymentSplit_paymentId_fkey`;

-- DropForeignKey
ALTER TABLE `PaymentSplit` DROP FOREIGN KEY `PaymentSplit_userId_fkey`;

-- DropTable
DROP TABLE `PaymentSplit`;

-- CreateTable
CREATE TABLE `LedgerEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `direction` ENUM('DEBIT', 'CREDIT') NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,

    UNIQUE INDEX `LedgerEntry_paymentId_userId_direction_key`(`paymentId`, `userId`, `direction`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LedgerEntry` ADD CONSTRAINT `LedgerEntry_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LedgerEntry` ADD CONSTRAINT `LedgerEntry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
