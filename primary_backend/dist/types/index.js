import { z } from "zod";
export const SignupSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string(),
});
export const SigninSchema = z.object({
    password: z.string(),
    email: z.string(),
});
