-- CreateEnum
CREATE TYPE "RoleStatus" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "RoleStatus" NOT NULL DEFAULT 'USER';
