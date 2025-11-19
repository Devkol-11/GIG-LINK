/*
  Warnings:

  - Made the column `metadata` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "metadata" SET NOT NULL;
