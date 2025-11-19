/*
  Warnings:

  - You are about to drop the column `reference` on the `transactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[systemReference]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[providerReference]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerReference` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `systemReference` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."transactions_reference_key";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "reference",
ADD COLUMN     "providerReference" TEXT NOT NULL,
ADD COLUMN     "systemReference" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_systemReference_key" ON "transactions"("systemReference");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_providerReference_key" ON "transactions"("providerReference");
