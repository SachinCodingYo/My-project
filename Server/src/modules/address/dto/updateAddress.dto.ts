import Joi from "joi";

export const updateAddressSchema = Joi.object({
  houseNo: Joi.string().trim().optional(),
  street: Joi.string().trim().optional(),
  landmark: Joi.string().trim().optional().allow(null),
  pincode: Joi.string().trim().length(6).optional(),
  city: Joi.string().trim().optional(),
  state: Joi.string().trim().optional(),
  isDefault: Joi.boolean().optional(),
  longitude: Joi.number().optional(),
  latitude: Joi.number().optional(),
});

export type updateAddressInput = {
  houseNo?: string;
  street?: string;
  landmark?: string | null;
  pincode?: string;
  city?: string;
  state?: string;
  isDefault?: boolean;
  longitude?: number;
  latitude?: number;
};
