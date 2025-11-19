/*
  Warnings:

  - You are about to drop the column `meta` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `transactions` table. All the data in the column will be lost.
  - Made the column `channel` on table `payments` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `transactionType` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "channel" SET NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "meta",
DROP COLUMN "type",
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "transactionType" "TransactionType" NOT NULL;
