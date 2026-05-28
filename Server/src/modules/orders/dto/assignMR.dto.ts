import Joi from "joi";

export const assignMRSchema = Joi.object({
  mrId: Joi.string().required().messages({
    "any.required": "MR ID is required",
  }),
});

export type AssignMRInput = {
  mrId: string;
};