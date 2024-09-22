/*
  Warnings:

  - Added the required column `type` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('STANDARD', 'GOOGLE', 'AZURE');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "type" "SessionType" NOT NULL;
