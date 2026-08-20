import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../../types/auth-request";
const prisma = new PrismaClient();

// DONE

export const createIdea = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const {
    businessName,
    shortDescription,
    fullDescription,
    problemStatement,
    solution,
    targetMarket,
    businessModel,
    fundingRequired,
    category,
    location,
  } = req.body;

  // 🔍 Get entrepreneur profile using authenticated user
  const entrepreneur = await prisma.entrepreneurProfile.findUnique({
    where: { userId },
  });

  if (!entrepreneur) {
    throw new AppError("Entrepreneur profile not found", 404);
  }

  // ✅ Create idea linked to authenticated entrepreneur
  const idea = await prisma.idea.create({
    data: {
      entrepreneurId: entrepreneur.id,
      businessName,
      shortDescription,
      fullDescription,
      problemStatement,
      solution,
      targetMarket,
      businessModel,
      fundingRequired,
      category,
      location,
    },
  });

  res.status(201).json({
    status: "success",
    data: idea,
  });
});

export const getAllIdeas = catchAsync(async (_req: Request, res: Response) => {
  const ideas = await prisma.idea.findMany({
    include: {
      entrepreneur: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  res.status(200).json({
    status: "success",
    total: ideas.length,
    data: ideas.map((idea) => ({
      id: idea.id,
      businessName: idea.businessName,
      shortDescription: idea.shortDescription,
      fullDescription: idea.fullDescription,
      problemStatement: idea.problemStatement,
      solution: idea.solution,
      targetMarket: idea.targetMarket,
      businessModel: idea.businessModel,
      fundingRequired: idea.fundingRequired,
      category: idea.category,
      location: idea.location,
      status: idea.status,
      entrepreneur: {
        id: idea.entrepreneur.id,
        bio: idea.entrepreneur.bio,
        location: idea.entrepreneur.location,
        user: {
          id: idea.entrepreneur.user.id,
          name: idea.entrepreneur.user.name,
        },
      },
    })),
  });
});

export const getIdea = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    throw new AppError("Idea id is required", 400);
  }

  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      entrepreneur: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!idea) {
    throw new AppError("Idea not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      id: idea.id,
      businessName: idea.businessName,
      shortDescription: idea.shortDescription,
      fullDescription: idea.fullDescription,
      problemStatement: idea.problemStatement,
      solution: idea.solution,
      targetMarket: idea.targetMarket,
      businessModel: idea.businessModel,
      fundingRequired: idea.fundingRequired,
      category: idea.category,
      location: idea.location,
      status: idea.status,
      entrepreneur: {
        id: idea.entrepreneur.id,
        bio: idea.entrepreneur.bio,
        location: idea.entrepreneur.location,
        user: {
          id: idea.entrepreneur.user.id,
          name: idea.entrepreneur.user.name,
        },
      },
    },
  });
});

export const updateIdea = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    throw new AppError("Idea id is required", 400);
  }

  const existingIdea = await prisma.idea.findUnique({
    where: { id },
  });

  if (!existingIdea) {
    throw new AppError("Idea not found", 404);
  }

  const updatedIdea = await prisma.idea.update({
    where: { id },
    data: req.body,
  });

  res.status(200).json({
    status: "success",
    data: {
      id: updatedIdea.id,
      businessName: updatedIdea.businessName,
      shortDescription: updatedIdea.shortDescription,
      fullDescription: updatedIdea.fullDescription,
      problemStatement: updatedIdea.problemStatement,
      solution: updatedIdea.solution,
      targetMarket: updatedIdea.targetMarket,
      businessModel: updatedIdea.businessModel,
      fundingRequired: updatedIdea.fundingRequired,
      category: updatedIdea.category,
      location: updatedIdea.location,
      status: updatedIdea.status,
    },
  });
});

export const deleteIdea = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("Idea id is required", 400);
  }

  const userId = req.user!.id;

  const entrepreneur = await prisma.entrepreneurProfile.findUnique({
    where: { userId },
  });

  if (!entrepreneur) {
    throw new AppError("Entrepreneur profile not found", 404);
  }

  const existingIdea = await prisma.idea.findUnique({
    where: { id },
  });

  if (!existingIdea) {
    throw new AppError("Idea not found", 404);
  }

  if (existingIdea.entrepreneurId !== entrepreneur.id) {
    throw new AppError("Forbidden", 403);
  }

  await prisma.idea.delete({
    where: { id },
  });

  res.status(200).json({
    status: "success",
    message: "Deleted successfully",
  });
});
