/*
  Warnings:

  - You are about to drop the column `name` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `admins` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `admins` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_userId_fkey";

-- DropIndex
DROP INDEX "admins_userId_key";

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "name",
DROP COLUMN "userId",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;
