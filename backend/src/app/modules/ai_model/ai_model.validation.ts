import { z } from "zod";

const aiModel = z.object({
  body: z.object({
    prompt: z.string({ required_error: "Prompt is required!" }),
  }),
});

export const AIModelValidator = {
  aiModel,
};
