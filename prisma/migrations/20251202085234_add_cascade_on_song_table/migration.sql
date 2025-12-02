-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_audioId_fkey";

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_audioId_fkey" FOREIGN KEY ("audioId") REFERENCES "Audio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
