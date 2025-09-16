import { NextFunction, Request, Response } from 'express';
import { authServices } from './index';
import httpStatus from 'http-status';
import { generateTokens } from '../token/generateToken';
import { env } from '../config/config';
import jwt from 'jsonwebtoken';
import { saveRefreshToken, findRefreshToken, removeRefreshToken } from '../token/token.service'; // <-- new file for db ops
import { APIError } from '../utils/errorHandling';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await authServices.createUser(req.body);

        const { accessToken, refreshToken } = generateTokens(user.id, user.role);
        await saveRefreshToken(user.id, refreshToken);

        res
            .status(httpStatus.CREATED)
            .send({ user, tokens: { access: accessToken, refresh: refreshToken } });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await authServices.login(email, password);

        const { accessToken, refreshToken } = generateTokens(user.id, user.role);
        await saveRefreshToken(user.id, refreshToken);

        res
            .status(httpStatus.OK)
            .send({ user, tokens: { access: accessToken, refresh: refreshToken } });
    } catch (error) {
        next(error);
    }
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;
        console.log('body ==>', refreshToken);

        if (!refreshToken) return res.status(400).json({ message: 'Missing token' });

        const stored = await findRefreshToken(refreshToken);
        if (!stored || stored.expiresAt < new Date()) {
            return res.status(401).json({ message: 'Token expired or not found' });
        }

        const payload = jwt.verify(refreshToken, env.jwt.secret!) as { id: string; role: string };

        const { accessToken, refreshToken: newRefresh } = generateTokens(payload.id, payload.role);

        // Optionally rotate refresh token
        await removeRefreshToken(refreshToken);
        await saveRefreshToken(payload.id, newRefresh);

        res.status(httpStatus.CREATED).send({ access: accessToken, refresh: newRefresh });
    } catch (error) {
        next(error);
    }
};

export const profile = async(req : Request,res : Response, next : NextFunction) =>
{
    try {
        const userId = req.user?.id;
        if(!userId) 
        {
            throw new APIError(httpStatus.UNAUTHORIZED,'User not authenticated');
        }

        const user = await authServices.getProfile(userId);
        res.status(httpStatus.OK).send(user);
    } catch (error : any) {
        next(error);
    }
}