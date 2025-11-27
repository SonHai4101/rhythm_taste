/*
  Warnings:

  - You are about to drop the column `songId` on the `Audio` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[audioId]` on the table `Song` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Audio" DROP CONSTRAINT "Audio_songId_fkey";

-- DropIndex
DROP INDEX "Audio_songId_key";

-- AlterTable
ALTER TABLE "Audio" DROP COLUMN "songId";

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "audioId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Song_audioId_key" ON "Song"("audioId");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_audioId_fkey" FOREIGN KEY ("audioId") REFERENCES "Audio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
