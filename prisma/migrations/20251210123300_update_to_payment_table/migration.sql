/*
  Warnings:

  - A unique constraint covering the columns `[walletId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[systemReference]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payments_walletId_key" ON "payments"("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_systemReference_key" ON "payments"("systemReference");
