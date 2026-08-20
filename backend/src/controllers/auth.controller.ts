import { catchAsync } from "../utils/catchAsync";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/appError";
import { signToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import z from "zod";
const prisma = new PrismaClient();

const userSignUpSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  role: z.enum(["ENTREPRENEUR", "INVESTOR"]),
});

const userLogInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const db_data = await prisma.user.findMany();

  res.status(200).json({
    status: "success",
    total: db_data.length,
    data: db_data.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })),
  });
});

export const signUp = catchAsync(async (req: Request, res: Response) => {
  let validateData;
  try {
    validateData = userSignUpSchema.parse(req.body);
  } catch (validationError: any) {
    throw new AppError(validationError.errors[0]?.message || "Validation failed", 400);
  }

  const { name, email, password, role } = validateData;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("Email already exists", 400);
  }

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      role,
      password: hash,
    },
  });

  const token = signToken({
    id: user.id,
    role: user.role,
  });

  res.status(201).json({
    status: "success",
    token,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  let validateData;
  try {
    validateData = userLogInSchema.parse(req.body);
  } catch (validationError: any) {
    throw new AppError(validationError.errors[0]?.message || "Validation failed", 400);
  }

  const { email, password } = validateData;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({
    id: user.id,
    role: user.role,
  });

  res.status(200).json({
    status: "success",
    token,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
