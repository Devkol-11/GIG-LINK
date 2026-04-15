/*
  Warnings:

  - You are about to drop the column `balanceCents` on the `escrow_accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "escrow_accounts" DROP COLUMN "balanceCents",
ADD COLUMN     "balanceKobo" INTEGER NOT NULL DEFAULT 0;
