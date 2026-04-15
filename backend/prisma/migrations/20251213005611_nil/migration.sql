/*
  Warnings:

  - You are about to drop the `escrow_audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `escrow_disputes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `escrow_releases` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creatorId` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "escrow_audit_logs" DROP CONSTRAINT "escrow_audit_logs_escrowId_fkey";

-- DropForeignKey
ALTER TABLE "escrow_disputes" DROP CONSTRAINT "escrow_disputes_escrowId_fkey";

-- DropForeignKey
ALTER TABLE "escrow_releases" DROP CONSTRAINT "escrow_releases_escrowId_fkey";

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "creatorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "escrow_audit_logs";

-- DropTable
DROP TABLE "escrow_disputes";

-- DropTable
DROP TABLE "escrow_releases";

-- DropEnum
DROP TYPE "EscrowDisputeStatus";

-- DropEnum
DROP TYPE "EscrowReleaseType";
