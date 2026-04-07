/*
  Warnings:

  - Added the required column `key` to the `album_covers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "album_covers" ADD COLUMN     "key" TEXT NOT NULL;
