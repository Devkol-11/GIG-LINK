/*
  Warnings:

  - You are about to drop the column `meta` on the `escrow_transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "escrow_transactions" DROP COLUMN "meta";
