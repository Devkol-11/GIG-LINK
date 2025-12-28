/*
  Warnings:

  - You are about to drop the column `amountCents` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `amountKobo` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'REVERSED';

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "amountCents",
ADD COLUMN     "amountKobo" INTEGER NOT NULL;
