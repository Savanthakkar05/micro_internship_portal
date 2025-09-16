import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { env } from "../config/config";
import { db } from "../config/db"; // Prisma client
import { APIError } from "../utils/errorHandling";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

export const authenticate =
  (...allowedRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new APIError(httpStatus.BAD_REQUEST,'Missing or malformed token');
      }

      const token = authHeader.split(" ")[1];
      const payload = jwt.verify(token, env.jwt.secret!) as { id: string };

      // Fetch user from DB using the id from token
      const user = await db.user.findUnique({
        where: { id: payload.id },
        select: { id: true, role: true },
      });

      if (!user) {
        throw new APIError(httpStatus.NOT_FOUND,'User not found!');
      }

      req.user = { id: user.id, role: user.role };

      // Check allowed roles (if any)
      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        throw new APIError(httpStatus.UNAUTHORIZED,'Access denied');
      }

      next();
    } catch (error) {
      throw new APIError(httpStatus.UNAUTHORIZED,'Invalid or Expired token');
    }
  };
