/**
 * @author Aman kumar singh
 * @description
 */
import Joi from "joi";

export const createRedFlagSchema = Joi.object({

    // EMAIL OR MOBILE

    identifier: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Identifier is required"
        }),

    // RED FLAG REASON

    reason: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Reason is required"
        }),

    // REMARKS

    remarks: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Remarks are required"
        })

});