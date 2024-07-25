/*
  Warnings:

  - You are about to drop the column `data` on the `Decision` table. All the data in the column will be lost.
  - You are about to drop the column `framework` on the `Decision` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Decision` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Decision" DROP COLUMN "data",
DROP COLUMN "framework",
DROP COLUMN "summary";
