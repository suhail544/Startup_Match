/*
  Warnings:

  - You are about to drop the column `businessName` on the `EntrepreneurProfile` table. All the data in the column will be lost.
  - You are about to drop the column `fundingRequired` on the `EntrepreneurProfile` table. All the data in the column will be lost.
  - You are about to drop the column `ideaDescription` on the `EntrepreneurProfile` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `EntrepreneurProfile` table. All the data in the column will be lost.
  - You are about to drop the column `contactNumber` on the `InvestorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `focusArea` on the `InvestorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `InvestorProfile` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `EntrepreneurProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `InvestorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IdeaStatus" AS ENUM ('ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "InterestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "EntrepreneurProfile" DROP COLUMN "businessName",
DROP COLUMN "fundingRequired",
DROP COLUMN "ideaDescription",
DROP COLUMN "name",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "InvestorProfile" DROP COLUMN "contactNumber",
DROP COLUMN "focusArea",
DROP COLUMN "name",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "focusAreas" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "entrepreneurId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "targetMarket" TEXT NOT NULL,
    "businessModel" TEXT NOT NULL,
    "fundingRequired" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" "IdeaStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedIdea" (
    "id" TEXT NOT NULL,
    "investorId" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedIdea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestorInterest" (
    "id" TEXT NOT NULL,
    "investorId" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "message" TEXT,
    "status" "InterestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestorInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedIdea_investorId_ideaId_key" ON "SavedIdea"("investorId", "ideaId");

-- CreateIndex
CREATE UNIQUE INDEX "InvestorInterest_investorId_ideaId_key" ON "InvestorInterest"("investorId", "ideaId");

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_entrepreneurId_fkey" FOREIGN KEY ("entrepreneurId") REFERENCES "EntrepreneurProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedIdea" ADD CONSTRAINT "SavedIdea_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "InvestorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedIdea" ADD CONSTRAINT "SavedIdea_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestorInterest" ADD CONSTRAINT "InvestorInterest_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "InvestorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestorInterest" ADD CONSTRAINT "InvestorInterest_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
