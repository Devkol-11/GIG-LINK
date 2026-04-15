import { z } from "zod";

export const paginationQuerySchema = {
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  }),
};

export const idParamSchema = {
  params: z.object({
    id: z.uuid(),
  }),
};

export const createGigSchema = {
  body: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    category: z.string().min(1),
    deliveryTime: z.number().int().positive(),
    skills: z.array(z.string().min(1)).min(1),
  }),
};

export const updateGigSchema = {
  params: idParamSchema.params,
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    category: z.string().min(1).optional(),
    deliveryTime: z.number().int().positive().optional(),
    skills: z.array(z.string().min(1)).optional(),
  }),
};

export const createApplicationSchema = {
  body: z.object({
    gigId: z.uuid(),
    proposal: z.string().min(1),
    proposedPrice: z.number().positive(),
    estimatedDays: z.number().int().positive(),
  }),
};

export const updateApplicationStatusSchema = {
  params: idParamSchema.params,
  body: z.object({
    status: z.enum(["accepted", "rejected"]),
  }),
};

export const createContractSchema = {
  body: z.object({
    applicationId: z.uuid(),
    terms: z.string().min(1),
  }),
};

export const updateContractStatusSchema = {
  params: idParamSchema.params,
  body: z.object({
    status: z.enum(["active", "completed", "cancelled"]),
  }),
};
