import { db } from '../config/db';
import { Token } from '@prisma/client';
import {env} from '../config/config';
// simple utility to add N days
const addDays = (days: number): Date => {
  const result = new Date();
  result.setDate(result.getDate() + days);
  return result;
};

export const saveRefreshToken = async (
  userId: string,
  token: string,
  device?: string
): Promise<Token> => {
  // adjust days as per your refreshExpirationDays setting
  const expiresAt = addDays(env.jwt.refreshExpirationDays);

  return db.token.create({
    data: {
      token,
      device,
      userId,
      expiresAt,
    },
  });
};

export const removeRefreshToken = async (token: string) => {
  return db.token.delete({ where: { token } });
};

export const findRefreshToken = async (token: string) => {
  return db.token.findUnique({ where: { token } });
};
