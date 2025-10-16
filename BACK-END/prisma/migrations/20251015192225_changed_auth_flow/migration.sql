/*
  Warnings:

  - You are about to drop the `PasswordResetToken` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `createdAt` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isEmailVerified` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."PasswordResetToken" DROP CONSTRAINT "PasswordResetToken_userId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "isEmailVerified" SET NOT NULL;

-- DropTable
DROP TABLE "public"."PasswordResetToken";

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
