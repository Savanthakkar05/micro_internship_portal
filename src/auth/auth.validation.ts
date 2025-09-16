import Joi from "joi";
import { NewCreateUser } from "./auth.interfaces";
import { password } from "../validate/custom.validation";
const createUserSchema: Record<keyof NewCreateUser, any> = {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().optional(),
    role: Joi.string().valid('STUDENT', 'ADMIN', 'MENTOR'),
    bio: Joi.string().optional(),
    skills: Joi.array().required(),
    avatarUrl: Joi.string().optional(),
};

export const regsterBody = {
    body: Joi.object().keys(createUserSchema),
};

export const loginBody = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().custom(password).required(),
    }),
};

export const refreshTokenBody = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};