import { z } from "zod";

const limitSchema = z.number().int().positive().max(500).optional();
const idSchema = z.number().int().positive();

export const searchSchema = {
  term: z.string().min(1),
  limit: limitSchema,
  start: z.number().int().min(0).optional(),
  fields: z.string().optional(),
  exact_match: z.boolean().optional()
};

export const entityIdSchema = {
  id: idSchema
};

export const listActivitiesSchema = {
  deal_id: idSchema.optional(),
  person_id: idSchema.optional(),
  org_id: idSchema.optional(),
  user_id: idSchema.optional(),
  done: z.boolean().optional(),
  type: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  limit: limitSchema,
  start: z.number().int().min(0).optional()
};

export const listNotesSchema = {
  deal_id: idSchema.optional(),
  person_id: idSchema.optional(),
  org_id: idSchema.optional(),
  lead_id: z.string().optional(),
  limit: limitSchema,
  start: z.number().int().min(0).optional()
};

export const addNoteSchema = {
  content: z.string().min(1),
  deal_id: idSchema.optional(),
  person_id: idSchema.optional(),
  org_id: idSchema.optional(),
  lead_id: z.string().optional(),
  pinned_to_deal_flag: z.boolean().optional(),
  pinned_to_person_flag: z.boolean().optional(),
  pinned_to_organization_flag: z.boolean().optional()
};

export const createActivitySchema = {
  subject: z.string().min(1),
  type: z.string().optional(),
  due_date: z.string().optional(),
  due_time: z.string().optional(),
  duration: z.string().optional(),
  done: z.boolean().optional(),
  deal_id: idSchema.optional(),
  person_id: idSchema.optional(),
  org_id: idSchema.optional(),
  user_id: idSchema.optional(),
  note: z.string().optional()
};

export const updateDealSchema = {
  id: idSchema,
  title: z.string().min(1).optional(),
  value: z.number().optional(),
  currency: z.string().optional(),
  status: z.enum(["open", "won", "lost"]).optional(),
  stage_id: idSchema.optional(),
  user_id: idSchema.optional(),
  person_id: idSchema.optional(),
  org_id: idSchema.optional(),
  expected_close_date: z.string().optional(),
  custom_fields: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional()
};

export const updatePersonSchema = {
  id: idSchema,
  name: z.string().min(1).optional(),
  owner_id: idSchema.optional(),
  org_id: idSchema.optional(),
  email: z
    .union([
      z.string(),
      z.array(
        z.object({
          value: z.string().min(1),
          primary: z.boolean().optional(),
          label: z.string().optional()
        })
      )
    ])
    .optional(),
  phone: z
    .union([
      z.string(),
      z.array(
        z.object({
          value: z.string().min(1),
          primary: z.boolean().optional(),
          label: z.string().optional()
        })
      )
    ])
    .optional(),
  custom_fields: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).optional()
};
