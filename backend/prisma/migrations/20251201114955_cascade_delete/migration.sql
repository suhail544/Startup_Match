-- DropForeignKey
ALTER TABLE "EntrepreneurProfile" DROP CONSTRAINT "EntrepreneurProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "InvestorProfile" DROP CONSTRAINT "InvestorProfile_userId_fkey";

-- AddForeignKey
ALTER TABLE "EntrepreneurProfile" ADD CONSTRAINT "EntrepreneurProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestorProfile" ADD CONSTRAINT "InvestorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
