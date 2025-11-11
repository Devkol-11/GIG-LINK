/*
  Warnings:

  - The `status` column on the `contracts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentStatus` column on the `contracts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Application` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wallet` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `rating` on table `creators` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating` on table `freelancers` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "EscrowStatus" AS ENUM ('HELD', 'RELEASED', 'DISPUTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "EscrowTransactionType" AS ENUM ('FUND', 'RELEASE', 'REFUND', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "EscrowReleaseType" AS ENUM ('PARTIAL', 'FULL', 'MILESTONE');

-- CreateEnum
CREATE TYPE "EscrowDisputeStatus" AS ENUM ('OPEN', 'IN_REVIEW', 'RESOLVED', 'CLOSED');

-- DropForeignKey
ALTER TABLE "public"."Application" DROP CONSTRAINT "Application_freelancerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Application" DROP CONSTRAINT "Application_gigId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_walletId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_walletId_fkey";

-- DropForeignKey
ALTER TABLE "public"."contracts" DROP CONSTRAINT "contracts_applicationId_fkey";

-- DropIndex
DROP INDEX "public"."contracts_creatorId_key";

-- DropIndex
DROP INDEX "public"."contracts_freelancerId_key";

-- DropIndex
DROP INDEX "public"."gigs_creatorId_key";

-- AlterTable
ALTER TABLE "contracts" DROP COLUMN "status",
ADD COLUMN     "status" "ContractStatus" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "ContractPaymentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "creators" ALTER COLUMN "rating" SET NOT NULL,
ALTER COLUMN "totalGigsPosted" SET DEFAULT 0,
ALTER COLUMN "verified" SET DEFAULT false;

-- AlterTable
ALTER TABLE "freelancers" ALTER COLUMN "rating" SET NOT NULL;

-- AlterTable
ALTER TABLE "gigs" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- DropTable
DROP TABLE "public"."Application";

-- DropTable
DROP TABLE "public"."Payment";

-- DropTable
DROP TABLE "public"."Transaction";

-- DropTable
DROP TABLE "public"."Wallet";

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "gigId" TEXT NOT NULL,
    "freelancerId" TEXT NOT NULL,
    "coverLetter" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balanceCents" INTEGER NOT NULL DEFAULT 0,
    "reservedCents" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL,
    "status" "WalletStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "transactionId" TEXT,
    "provider" "PaymentProvider" NOT NULL,
    "providerReference" TEXT,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "direction" "PaymentDirection" NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "channel" "PaymentChannel",
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "reference" TEXT,
    "source" "TransactionSource" NOT NULL,
    "description" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escrow_accounts" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "freelancerId" TEXT NOT NULL,
    "balanceCents" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL,
    "status" "EscrowStatus" NOT NULL DEFAULT 'HELD',
    "locked" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escrow_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escrow_transactions" (
    "id" TEXT NOT NULL,
    "escrowId" TEXT NOT NULL,
    "type" "EscrowTransactionType" NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "reference" TEXT,
    "status" "TransactionStatus" NOT NULL,
    "description" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "escrow_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escrow_releases" (
    "id" TEXT NOT NULL,
    "escrowId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "releaseType" "EscrowReleaseType" NOT NULL,
    "approvedBy" TEXT,
    "releasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "transactionId" TEXT,
    "meta" JSONB,

    CONSTRAINT "escrow_releases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escrow_disputes" (
    "id" TEXT NOT NULL,
    "escrowId" TEXT NOT NULL,
    "raisedById" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "EscrowDisputeStatus" NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "resolvedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "escrow_disputes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escrow_audit_logs" (
    "id" TEXT NOT NULL,
    "escrowId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorId" TEXT,
    "oldState" JSONB,
    "newState" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "escrow_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "applications_gigId_idx" ON "applications"("gigId");

-- CreateIndex
CREATE INDEX "applications_freelancerId_idx" ON "applications"("freelancerId");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_userId_key" ON "wallets"("userId");

-- CreateIndex
CREATE INDEX "wallets_status_idx" ON "wallets"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payments_providerReference_key" ON "payments"("providerReference");

-- CreateIndex
CREATE INDEX "payments_walletId_idx" ON "payments"("walletId");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_createdAt_idx" ON "payments"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_reference_key" ON "transactions"("reference");

-- CreateIndex
CREATE INDEX "transactions_walletId_idx" ON "transactions"("walletId");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_createdAt_idx" ON "transactions"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "escrow_accounts_contractId_key" ON "escrow_accounts"("contractId");

-- CreateIndex
CREATE INDEX "escrow_accounts_creatorId_idx" ON "escrow_accounts"("creatorId");

-- CreateIndex
CREATE INDEX "escrow_accounts_freelancerId_idx" ON "escrow_accounts"("freelancerId");

-- CreateIndex
CREATE INDEX "escrow_accounts_status_idx" ON "escrow_accounts"("status");

-- CreateIndex
CREATE UNIQUE INDEX "escrow_transactions_reference_key" ON "escrow_transactions"("reference");

-- CreateIndex
CREATE INDEX "escrow_transactions_escrowId_idx" ON "escrow_transactions"("escrowId");

-- CreateIndex
CREATE INDEX "escrow_transactions_type_idx" ON "escrow_transactions"("type");

-- CreateIndex
CREATE INDEX "escrow_releases_escrowId_idx" ON "escrow_releases"("escrowId");

-- CreateIndex
CREATE INDEX "escrow_releases_releaseType_idx" ON "escrow_releases"("releaseType");

-- CreateIndex
CREATE INDEX "escrow_disputes_escrowId_idx" ON "escrow_disputes"("escrowId");

-- CreateIndex
CREATE INDEX "escrow_disputes_status_idx" ON "escrow_disputes"("status");

-- CreateIndex
CREATE INDEX "escrow_audit_logs_escrowId_idx" ON "escrow_audit_logs"("escrowId");

-- CreateIndex
CREATE INDEX "escrow_audit_logs_createdAt_idx" ON "escrow_audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "contracts_creatorId_idx" ON "contracts"("creatorId");

-- CreateIndex
CREATE INDEX "contracts_freelancerId_idx" ON "contracts"("freelancerId");

-- CreateIndex
CREATE INDEX "contracts_status_idx" ON "contracts"("status");

-- CreateIndex
CREATE INDEX "creators_verified_idx" ON "creators"("verified");

-- CreateIndex
CREATE INDEX "creators_rating_idx" ON "creators"("rating");

-- CreateIndex
CREATE INDEX "freelancers_verified_idx" ON "freelancers"("verified");

-- CreateIndex
CREATE INDEX "freelancers_rating_idx" ON "freelancers"("rating");

-- CreateIndex
CREATE INDEX "gigs_creatorId_idx" ON "gigs"("creatorId");

-- CreateIndex
CREATE INDEX "gigs_category_idx" ON "gigs"("category");

-- CreateIndex
CREATE INDEX "gigs_status_idx" ON "gigs"("status");

-- CreateIndex
CREATE INDEX "gigs_createdAt_idx" ON "gigs"("createdAt");

-- CreateIndex
CREATE INDEX "password_reset_tokens_userId_idx" ON "password_reset_tokens"("userId");

-- CreateIndex
CREATE INDEX "password_reset_tokens_expiresAt_idx" ON "password_reset_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "refresh_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "user_profiles_location_idx" ON "user_profiles"("location");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "gigs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "freelancers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escrow_accounts" ADD CONSTRAINT "escrow_accounts_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escrow_transactions" ADD CONSTRAINT "escrow_transactions_escrowId_fkey" FOREIGN KEY ("escrowId") REFERENCES "escrow_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escrow_releases" ADD CONSTRAINT "escrow_releases_escrowId_fkey" FOREIGN KEY ("escrowId") REFERENCES "escrow_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escrow_disputes" ADD CONSTRAINT "escrow_disputes_escrowId_fkey" FOREIGN KEY ("escrowId") REFERENCES "escrow_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escrow_audit_logs" ADD CONSTRAINT "escrow_audit_logs_escrowId_fkey" FOREIGN KEY ("escrowId") REFERENCES "escrow_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
