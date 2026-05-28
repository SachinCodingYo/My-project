import Joi from "joi";

export const createServicePincodeSchema = Joi.object({
  pincode: Joi.string()
    .pattern(/^[1-9][0-9]{5}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid pincode format",
      "any.required": "Pincode is required",
    }),
  isActive: Joi.boolean().optional(),
});

export type CreateServicePincodeInput = {
  pincode: string;
  isActive?: boolean;
};
