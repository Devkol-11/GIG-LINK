/*
  Warnings:

  - Added the required column `failedReason` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reversedReason` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "failedReason" TEXT NOT NULL,
ADD COLUMN     "reversedReason" TEXT NOT NULL;
