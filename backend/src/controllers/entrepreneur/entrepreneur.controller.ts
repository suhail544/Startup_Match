import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import z from "zod";
import { AuthRequest } from "../../middlewares/auth.middleware";
const prisma = new PrismaClient();

//   DONE

const getEntrepreneurByIdSchema = z.object({
  id: z.string().uuid({ message: "Invalid ID" }),
});

export const getAllEntrepreneur = catchAsync(
  async (req: Request, res: Response) => {
    const db_data = await prisma.entrepreneurProfile.findMany();
    res.status(200).json({
      status: "success",
      total: db_data.length,
      data: db_data.map((item) => ({
        id: item.id,
        bio: item.bio,
        location: item.location,
      })),
    });
  },
);

export const getEntrepreneur = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = getEntrepreneurByIdSchema.parse(req.params);

    if (!id) throw new AppError("Entrepreneur not found!", 400);

    const db_data = await prisma.entrepreneurProfile.findUnique({
      where: { id },
    });
    if (!db_data) throw new AppError("Entrepreneur not found!", 400);

    res.status(200).json({
      status: "success",
      data: {
        id: db_data.id,
        bio: db_data.bio,
        location: db_data.location,
      },
    });
  },
);

export const newEntrepreneur = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { bio, location } = req.body;

    // 1️⃣ Check user exists and role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("User not found!", 404);
    }

    if (user.role !== "ENTREPRENEUR") {
      throw new AppError(
        "Only ENTREPRENEUR users can create entrepreneur profile!",
        403,
      );
    }

    // 2️⃣ Prevent duplicate profile
    const existingProfile = await prisma.entrepreneurProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new AppError("Profile already exists!", 400);
    }

    // 3️⃣ Create profile
    const profile = await prisma.entrepreneurProfile.create({
      data: {
        userId,
        bio: bio ?? null,
        location: location ?? null,
      },
    });

    res.status(201).json({
      status: "success",
      data: {
        id: profile.id,
        bio: profile.bio,
        location: profile.location,
      },
    });
  },
);

export const updateEntrepreneur = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const data = req.body;

    if (!userId) throw new AppError("Entrepreneur not found!", 400);

    const profile = await prisma.entrepreneurProfile.findUnique({
      where: { userId },
    });
    if (!profile) throw new AppError("Entrepreneur profile not found!", 404);

    const db_data = await prisma.entrepreneurProfile.update({
      where: { id: profile.id },
      data: {
        bio: data.bio ?? undefined,
        location: data.location ?? undefined,
      } as Prisma.EntrepreneurProfileUpdateInput,
    });
    if (!db_data) throw new AppError("Entrepreneur not found!", 400);

    res.status(200).json({
      status: "success",
      data: {
        id: db_data.id,
        bio: db_data.bio,
        location: db_data.location,
      },
    });
  },
);

export const deleteEntrepreneur = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    if (!userId) throw new AppError("Entrepreneur not found!", 400);

    const profile = await prisma.entrepreneurProfile.findUnique({
      where: { userId },
    });
    if (!profile) throw new AppError("Entrepreneur profile not found!", 404);

    const db_data = await prisma.entrepreneurProfile.delete({
      where: { id: profile.id },
    });
    if (!db_data) throw new AppError("Entrepreneur not found!", 400);

    res.status(204).json({
      status: "success",
      message: "Data Deleted!",
    });
  },
);

export const getByUserId = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params as { userId?: string };
  if (!userId) throw new AppError("userId is required", 400);

  const profile = await prisma.entrepreneurProfile.findUnique({
    where: { userId },
  });
  if (!profile) throw new AppError("Entrepreneur profile not found", 404);

  res.status(200).json({
    status: "success",
    data: {
      id: profile.id,
      bio: profile.bio,
      location: profile.location,
      userId: profile.userId,
    },
  });
});

export const getMeEntrepreneur = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const profile = await prisma.entrepreneurProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      return res.status(200).json({ status: "success", data: null });
    }
    res.status(200).json({
      status: "success",
      data: {
        id: profile.id,
        bio: profile.bio,
        location: profile.location,
        userId: profile.userId,
      },
    });
  },
);
