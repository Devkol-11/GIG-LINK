/*
  Warnings:

  - Added the required column `cancelReason` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "cancelReason" TEXT NOT NULL;
