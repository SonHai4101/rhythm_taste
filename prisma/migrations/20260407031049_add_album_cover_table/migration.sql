/*
  Warnings:

  - You are about to drop the column `albumCover` on the `Song` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Song" DROP COLUMN "albumCover";

-- CreateTable
CREATE TABLE "album_covers" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "album_covers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "album_covers" ADD CONSTRAINT "album_covers_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
