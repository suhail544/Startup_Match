import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("========== BACKEND ERROR ==========");
  console.error(err);
  console.error("MESSAGE:", err.message);
  console.error("STACK:", err.stack);
  console.error("===================================");

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    status: err.status || "error",
    message: err.message || "Internal Server Error",
  });
};