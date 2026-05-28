import Joi from "joi";

export const addToCartSchema = Joi.object({
  planId: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
});

export type AddToCartInput = {
  planId: string;
  quantity: number;
};
