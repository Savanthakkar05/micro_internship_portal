import { APIError } from "../utils/errorHandling";
import { NewCreateUser } from "./auth.interfaces";
import httpStatus from "http-status";
import { db } from '../config/db';
import { User } from "@prisma/client";
import bcrypt from 'bcryptjs';

export const createUser = async (userBody: NewCreateUser): Promise<User> => {
    const existUser = await db.user.findUnique({ where: { email: userBody.email } });
    if (existUser) throw new APIError(httpStatus.BAD_REQUEST, 'User already exist');

    const hashed = await bcrypt.hash(userBody.password, 10);

    const { password, ...bodyData } = userBody;

    const user = await db.user.create({
        data: {
            password: hashed,
            ...bodyData
        },
    });
    return user;
};


export const login = async (email: string, password: string): Promise<User> => {
    const user = await db.user.findUnique({ where: { email: email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new APIError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }
    return user;
};

export const getProfile = async (userId: string): Promise<Omit<User, 'password'>> => {
    const user = await db.user.findUnique({
        where: { id: userId }, select: {
            id: true,
            name: true,
            email: true,
            role: true,
            bio: true,
            password: false,
            skills: true,
            avatarUrl: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if (!user) {
        throw new APIError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
}