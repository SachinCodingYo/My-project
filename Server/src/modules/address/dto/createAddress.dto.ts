import Joi from "joi";

export const createAddressSchema = Joi.object({
  houseNo: Joi.string().trim().required().messages({
    "any.required": "House number is required",
  }),
  street: Joi.string().trim().required().messages({
    "any.required": "Street is required",
  }),
  landmark: Joi.string().trim().optional().allow(""),
  pincode: Joi.string().trim().length(6).required().messages({
    "string.length": "Pincode must be 6 digits",
    "any.required": "Pincode is required",
  }),
  city: Joi.string().trim().required().messages({
    "any.required": "City is required",
  }),
  state: Joi.string().trim().required().messages({
    "any.required": "State is required",
  }),
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
  isDefault: Joi.boolean().default(false),
});

export type createAddressInput = {
  houseNo: string;
  street: string;
  landmark?: string;
  pincode: string;
  city: string;
  state: string;
  isDefault?: boolean;
  longitude: number;
  latitude: number;
};
