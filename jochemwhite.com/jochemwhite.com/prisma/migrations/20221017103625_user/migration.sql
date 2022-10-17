/*
  Warnings:

  - You are about to drop the column `JWT` on the `JWT` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[twitch]` on the table `JWT` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[spotify]` on the table `JWT` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `spotify` to the `JWT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `twitch` to the `JWT` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `JWT_JWT_key` ON `JWT`;

-- AlterTable
ALTER TABLE `JWT` DROP COLUMN `JWT`,
    ADD COLUMN `spotify` VARCHAR(200) NOT NULL,
    ADD COLUMN `twitch` VARCHAR(200) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `JWT_twitch_key` ON `JWT`(`twitch`);

-- CreateIndex
CREATE UNIQUE INDEX `JWT_spotify_key` ON `JWT`(`spotify`);
