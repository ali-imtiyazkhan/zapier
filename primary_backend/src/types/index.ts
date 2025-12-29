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

export const ZapCreateSchema = z.object({
  availableTriggerId: z.string(),
  triggerMetaData: z.any().optional(),
  action: z.array(
    z.object({
      availableActionId: z.string(),
      actionMetaData: z.any().optional(),
    })
  ),
});


