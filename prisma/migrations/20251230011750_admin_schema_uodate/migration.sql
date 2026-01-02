-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "role" "ROLE" NOT NULL DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
