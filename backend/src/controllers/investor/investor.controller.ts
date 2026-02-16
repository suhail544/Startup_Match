import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import { AuthRequest } from "../../types/auth-request";
const prisma = new PrismaClient();

// DONE

export const getAllInvestor = catchAsync(
  async (req: Request, res: Response) => {
    const db_data = await prisma.investorProfile.findMany();

    res.status(200).json({
      status: "All Investors",
      total: db_data.length,
      data: db_data.map((item) => ({
        id: item.id,
        companyName: item.companyName,
        investmentRange: item.investmentRange,
        focusAreas: item.focusAreas,
      })),
    });
  },
);

export const getInvestor = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) throw new AppError("Investor not found!", 400);

  const db_data = await prisma.investorProfile.findUnique({
    where: { id },
  });
  if (!db_data) throw new AppError("Investor not found!", 400);

  res.status(200).json({
    status: "success",
    data: {
      id: db_data.id,
      companyName: db_data.companyName,
      investmentRange: db_data.investmentRange,
      focusAreas: db_data.focusAreas,
    },
  });
});

export const newInvestor = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user.id;
    const { companyName, investmentRange, focusAreas } = req.body;

    if (!companyName) {
      throw new AppError("companyName is required!", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("User not found!", 404);
    }

    if (user.role !== "INVESTOR") {
      throw new AppError(
        "Only INVESTOR users can create investor profile!",
        403,
      );
    }

    // Optional: prevent duplicate profile
    const existingProfile = await prisma.investorProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new AppError("Investor profile already exists!", 400);
    }

    const db_data = await prisma.investorProfile.create({
      data: {
        userId,
        companyName,
        investmentRange: investmentRange ?? "",
        focusAreas: Array.isArray(focusAreas)
          ? focusAreas.join(",")
          : (focusAreas ?? "none"),
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        id: db_data.id,
        companyName: db_data.companyName,
        investmentRange: db_data.investmentRange,
        focusAreas: db_data.focusAreas,
      },
    });
  },
);

export const updateInvestor = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;

    if (!id) throw new AppError("Investor not found!", 400);

    const db_data = await prisma.investorProfile.update({
      where: { id },
      data: {
        companyName: data.companyName ?? undefined,
        investmentRange: data.investmentRange ?? undefined,
        focusAreas: data.focusAreas
          ? Array.isArray(data.focusAreas)
            ? data.focusAreas.join(",")
            : data.focusAreas
          : undefined,
      } as Prisma.InvestorProfileUpdateInput,
    });
    if (!db_data) throw new AppError("Investor not found!", 400);

    res.status(200).json({
      status: "success",
      data: {
        id: db_data.id,
        companyName: db_data.companyName,
        investmentRange: db_data.investmentRange,
        focusAreas: db_data.focusAreas,
      },
    });
  },
);

export const deleteInvestor = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) throw new AppError("Investor not found!", 400);

    const db_data = await prisma.investorProfile.delete({
      where: { id },
    });
    if (!db_data) throw new AppError("Investor not found!", 400);

    res.status(201).json({
      status: "success",
      message: "Data Deleted!",
    });
  },
);

export const getByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId?: string };
  if (!userId) throw new AppError("userId is required", 400);

  const profile = await prisma.investorProfile.findUnique({
    where: { userId },
  });
  if (!profile) throw new AppError("Investor profile not found", 404);

  res.status(200).json({
    status: "success",
    data: {
      id: profile.id,
      companyName: profile.companyName,
      investmentRange: profile.investmentRange,
      focusAreas: profile.focusAreas,
      userId: profile.userId,
    },
  });
});

export const getMeInvestor = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const profile = await prisma.investorProfile.findUnique({
      where: { userId },
    });
    if (!profile)
      return res.status(200).json({ status: "success", data: null });
    res.status(200).json({
      status: "success",
      data: {
        id: profile.id,
        companyName: profile.companyName,
        investmentRange: profile.investmentRange,
        focusAreas: profile.focusAreas,
        userId: profile.userId,
      },
    });
  },
);
