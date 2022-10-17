-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `JWTId` VARCHAR(191) NULL,
    `twitchId` VARCHAR(191) NOT NULL,
    `spotifyId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JWT` (
    `id` VARCHAR(191) NOT NULL,
    `JWT` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `JWT_JWT_key`(`JWT`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Twitch` (
    `id` VARCHAR(191) NOT NULL,
    `twitchID` INTEGER NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `refreshToken` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Twitch_twitchID_key`(`twitchID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Spotify` (
    `id` VARCHAR(191) NOT NULL,
    `spotifyID` INTEGER NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `refreshToken` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Spotify_spotifyID_key`(`spotifyID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_JWTId_fkey` FOREIGN KEY (`JWTId`) REFERENCES `JWT`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_twitchId_fkey` FOREIGN KEY (`twitchId`) REFERENCES `Twitch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_spotifyId_fkey` FOREIGN KEY (`spotifyId`) REFERENCES `Spotify`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
