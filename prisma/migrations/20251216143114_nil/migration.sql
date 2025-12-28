/*
  Warnings:

  - Added the required column `expectedAmountKobo` to the `escrow_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "escrow_accounts" ADD COLUMN     "expectedAmountKobo" INTEGER NOT NULL,
ALTER COLUMN "balanceKobo" DROP DEFAULT;
