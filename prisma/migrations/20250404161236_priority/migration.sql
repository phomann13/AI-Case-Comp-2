/*
  Warnings:

  - You are about to drop the column `Last message` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `Priority score` on the `Issue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Issue" DROP COLUMN "Last message",
DROP COLUMN "Priority score",
ADD COLUMN     "lastMessage" TEXT,
ADD COLUMN     "priorityScore" DOUBLE PRECISION;
