/*
  Warnings:

  - Added the required column `OTP_expiresAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otp` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "OTP_expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "otp" TEXT NOT NULL;
