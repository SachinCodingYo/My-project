import Joi from "joi";

export const updateLocationSchema = Joi.object({
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
});

export type UpdateLocationInput = {
  longitude: number;
  latitude: number;
};
