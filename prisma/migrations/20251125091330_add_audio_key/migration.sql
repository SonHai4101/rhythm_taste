/*
  Warnings:

  - Added the required column `key` to the `Audio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Audio" ADD COLUMN     "key" TEXT NOT NULL;
