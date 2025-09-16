import { Token, User } from "@prisma/client";
export type NewCreateUser = Omit<User, 'createdAt' | 'updatedAt' | 'id'>;