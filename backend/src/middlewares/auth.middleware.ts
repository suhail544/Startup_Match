import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { AppError } from "../utils/appError";

export interface UserPayload {
  id: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
  
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Not authorized", 401));
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new AppError("Not authorized", 401));
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next(new AppError("JWT secret not configured", 500));
  }

  try {
    // 👇 Force correct typing safely
    const decoded = jwt.verify(token, secret) as unknown;

    const payload = decoded as {
      id: string;
      role: Role;
    };

    if (!payload.id || !payload.role) {
      return next(new AppError("Invalid token payload", 401));
    }

    req.user = {
      id: payload.id,
      role: payload.role,
    };

    next();
  } catch (err: any) {
  console.log("JWT ERROR:", err);

  if (err.name === "TokenExpiredError") {
    return next(new AppError("Token expired", 401));
  }

  return next(new AppError("Invalid token", 401));
}


};

export const restrictTo = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }
    next();
  };
};
