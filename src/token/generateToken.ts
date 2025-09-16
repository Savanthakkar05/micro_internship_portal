import jwt from "jsonwebtoken";
import { env } from "../config/config";
// Helper to generate tokens
export const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    env.jwt.secret!,
    { expiresIn: `${env.jwt.refreshExpirationDays}m` || "30m" }
  );

  const refreshToken = jwt.sign(
    { id: userId, role },
    env.jwt.secret!,
    { expiresIn: `${env.jwt.refreshExpirationDays}m` || "30d" }
  );

  return { accessToken, refreshToken };
};