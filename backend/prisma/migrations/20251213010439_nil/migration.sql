/*
  Warnings:

  - Added the required column `amountKobo` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `contracts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contracts" ADD COLUMN     "amountKobo" INTEGER NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL;
