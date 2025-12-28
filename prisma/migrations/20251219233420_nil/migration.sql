/*
  Warnings:

  - You are about to drop the column `amountCents` on the `escrow_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `balanceCents` on the `wallets` table. All the data in the column will be lost.
  - You are about to drop the column `reservedCents` on the `wallets` table. All the data in the column will be lost.
  - Added the required column `amountKobo` to the `escrow_transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "escrow_transactions" DROP COLUMN "amountCents",
ADD COLUMN     "amountKobo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "wallets" DROP COLUMN "balanceCents",
DROP COLUMN "reservedCents",
ADD COLUMN     "balanceKobo" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "reservedKobo" INTEGER NOT NULL DEFAULT 0;
