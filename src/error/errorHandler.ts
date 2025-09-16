import { Request, Response, NextFunction } from "express";
export const errorHandle = async (
  err: { statusCode: number; message: string },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  res.status(err.statusCode).json({ success: false, message: err.message });
};
