import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import { AuthRequest } from "../../types/auth-request";
const prisma = new PrismaClient();

// DONE

export const createInterest = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { ideaId, message } = req.body;

    if (!userId || !ideaId) {
      throw new AppError("investorId and ideaId are required", 400);
    }

    const investor = await prisma.investorProfile.findUnique({
      where: { userId },
    });
    if (!investor) {
      throw new AppError("Investor profile not found", 404);
    }

    const interest = await prisma.investorInterest.create({
      data: {
        investorId: investor.id,
        ideaId,
        message,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        id: interest.id,
        message: interest.message,
        status: interest.status,
      },
    });
  },
);

export const getByInvestor = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const investor = await prisma.investorProfile.findUnique({
      where: { userId },
    });
    if (!investor) throw new AppError("Investor profile not found", 404);

    const interests = await prisma.investorInterest.findMany({
      where: { investorId: investor.id },
      include: { idea: true },
    });

    res.status(200).json({
      status: "success",
      total: interests.length,
      data: interests.map((i) => ({
        id: i.id,
        ideaId: i.ideaId,
        message: i.message,
        status: i.status,
        idea: i.idea,
      })),
    });
  },
);

export const getIdeaInterests = catchAsync(
  async (req: Request, res: Response) => {
    const { ideaId } = req.params;

    if (!ideaId) {
      throw new AppError("ideaId is required", 400);
    }

    const interests = await prisma.investorInterest.findMany({
      where: { ideaId },
      include: {
        investor: true,
      },
    });

    res.status(200).json({
      status: "success",
      total: interests.length,
      data: interests.map((interest) => ({
        id: interest.id,
        message: interest.message,
        status: interest.status,
        investor: {
          id: interest.investor.id,
          companyName: interest.investor.companyName,
          investmentRange: interest.investor.investmentRange,
          focusAreas: interest.investor.focusAreas,
        },
      })),
    });
  },
);

export const updateInterestStatus = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      throw new AppError("Interest id is required", 400);
    }

    const userId = req.user!.id;

    const investor = await prisma.investorProfile.findUnique({
      where: { userId },
    });

    if (!investor) {
      throw new AppError("Investor profile not found", 404);
    }

    const existingInterest = await prisma.investorInterest.findUnique({
      where: { id },
    });

    if (!existingInterest) {
      throw new AppError("Interest not found", 404);
    }

    if (existingInterest.investorId !== investor.id) {
      throw new AppError("Forbidden", 403);
    }

    const updated = await prisma.investorInterest.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({
      status: "success",
      data: {
        id: updated.id,
        message: updated.message,
        status: updated.status,
      },
    });
  },
);
