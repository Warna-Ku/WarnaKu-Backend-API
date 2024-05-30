/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX `users_uid_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`uid`);
