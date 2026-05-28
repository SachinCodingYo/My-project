import Joi from "joi";

export const createSessionSchema = Joi.object({
  type: Joi.string().valid("DIRECT", "THROUGHCART").required(),
  // planId aur quantity sirf DIRECT ke liye chahiye
  planId: Joi.string().when("type", { is: "DIRECT", then: Joi.required() }),
  quantity: Joi.number()
    .min(1)
    .when("type", { is: "DIRECT", then: Joi.required() }),
});
