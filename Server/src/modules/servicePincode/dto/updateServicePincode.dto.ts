import Joi from "joi";

export const updateServicePincodeSchema = Joi.object({
  isActive: Joi.boolean().optional(),
});

export type UpdateServicePincodeInput = {
  isActive?: boolean;
};
