/*
  Warnings:

  - A unique constraint covering the columns `[creatorId]` on the table `gigs` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "contracts" ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "paymentStatus" DROP DEFAULT;

-- AlterTable
ALTER TABLE "creators" ALTER COLUMN "totalGigsPosted" DROP DEFAULT,
ALTER COLUMN "verified" DROP DEFAULT;

-- AlterTable
ALTER TABLE "gigs" ALTER COLUMN "status" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "gigs_creatorId_key" ON "gigs"("creatorId");
