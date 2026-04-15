/*
  Warnings:

  - The `role` column on the `admins` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `refresh_tokens` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `role` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ROLE_USER" AS ENUM ('CREATOR', 'FREELANCER');

-- CreateEnum
CREATE TYPE "ROLE_ADMIN" AS ENUM ('SUPER_ADMIN', 'SUPPORTER');

-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_adminId_fkey";

-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_userId_fkey";

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "role",
ADD COLUMN     "role" "ROLE_ADMIN" NOT NULL DEFAULT 'SUPER_ADMIN';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "ROLE_USER" NOT NULL;

-- DropTable
DROP TABLE "refresh_tokens";

-- DropEnum
DROP TYPE "ROLE";

-- CreateTable
CREATE TABLE "refresh_tokens_user" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens_admin" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_user_tokenHash_key" ON "refresh_tokens_user"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_userId_idx" ON "refresh_tokens_user"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_expiresAt_idx" ON "refresh_tokens_user"("expiresAt");

-- CreateIndex
CREATE INDEX "refresh_tokens_admin_adminId_idx" ON "refresh_tokens_admin"("adminId");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- AddForeignKey
ALTER TABLE "refresh_tokens_user" ADD CONSTRAINT "refresh_tokens_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens_admin" ADD CONSTRAINT "refresh_tokens_admin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
