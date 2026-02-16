/*
  Warnings:

  - You are about to drop the column `OTP_expiresAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otp` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "OTP_expiresAt",
DROP COLUMN "otp";
