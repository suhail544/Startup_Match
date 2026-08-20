import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import { AuthRequest } from "../../types/auth-request";
const prisma = new PrismaClient();

// DONE

export const saveIdea = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { ideaId } = req.body;

  if (!userId || !ideaId) {
    throw new AppError("investorId and ideaId are required", 400);
  }

  // Find investor profile for authenticated user
  const investor = await prisma.investorProfile.findUnique({
    where: { userId },
  });
  if (!investor) {
    throw new AppError("Investor profile not found", 404);
  }

  const saved = await prisma.savedIdea.create({
    data: {
      investorId: investor.id,
      ideaId,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      id: saved.id,
      ideaId: saved.ideaId,
    },
  });
});

export const getIdea = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const investor = await prisma.investorProfile.findUnique({
    where: { userId },
  });

  if (!investor) {
    throw new AppError("Investor profile not found", 404);
  }

  const savedIdeas = await prisma.savedIdea.findMany({
    where: { investorId: investor.id },
    include: {
      idea: true,
    },
  });

  res.status(200).json({
    status: "success",
    total: savedIdeas.length,
    data: savedIdeas.map((item) => ({
      id: item.id,
      idea: {
        id: item.idea.id,
        businessName: item.idea.businessName,
        shortDescription: item.idea.shortDescription,
        fundingRequired: item.idea.fundingRequired,
        category: item.idea.category,
        location: item.idea.location,
        status: item.idea.status,
      },
    })),
  });
});

export const unsaveIdea = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new AppError("SavedIdea id is required", 400);
    }

    const userId = req.user!.id;

    const investor = await prisma.investorProfile.findUnique({
      where: { userId },
    });

    if (!investor) {
      throw new AppError("Investor profile not found", 404);
    }

    const saved = await prisma.savedIdea.findUnique({
      where: { id },
    });

    if (!saved) {
      throw new AppError("Saved idea not found", 404);
    }

    if (saved.investorId !== investor.id) {
      throw new AppError("Forbidden", 403);
    }

    await prisma.savedIdea.delete({
      where: { id },
    });

    res.status(200).json({
      status: "success",
      message: "Deleted successfully",
    });
  },
);
