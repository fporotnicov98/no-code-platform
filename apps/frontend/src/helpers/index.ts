import { z } from "zod";
import { NodeType } from "../types";

const schemas: Record<NodeType, z.ZodTypeAny> = {
  message: z.object({ text: z.string().min(1, "Text is required") }),
  condition: z
    .object({
      equals: z.string().optional(),
      includes: z.string().optional(),
      regex: z.string().optional(),
    })
    .refine(
      (obj) => Boolean(obj.equals || obj.includes || obj.regex),
      "Provide at least one of: equals, includes, regex"
    ),
  action: z.object({ actionKey: z.string().min(1, "Action key required"), payload: z.any().optional() }),
  input: z.object({ prompt: z.string().optional() }),
  split: z.object({ branches: z.number().int().min(2).max(5) }),
};

const genId = () => Math.random().toString(36).slice(2, 9);

export {
  genId,
  schemas
}