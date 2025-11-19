/*
  Warnings:

  - Added the required column `updatedAt` to the `applications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
