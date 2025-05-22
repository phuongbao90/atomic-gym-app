import { z } from "zod";

export type LoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
  callbackUrl?: string;
};

export type LoginResponse = {
  redirect: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    image: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  callbackUrl?: string;
  image?: string;
};

export type RegisterResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    image: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export const SignupSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    // image: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});
