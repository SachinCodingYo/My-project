/**
 * Authentication Validation Schemas (Joi)
 * Handles request validation for auth APIs:
 * register, login, OTP, password reset, admin password change
 *
 * Developer: Aman Kumar Singh
 */
import Joi from "joi";

export const registerSchema = Joi.object({
  fullName: Joi.string().min(4).required().messages({
    "string.min": "Full name must be at least 4 characters",
    "string.empty": "Full name is required",
  }),

  email: Joi.string().email().optional().messages({
    "string.email": "Invalid email",
  }),

  mobile: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Invalid mobile number. Must start with 6-9 and be 10 digits",
      "string.empty": "Mobile number is required",
    }),
});

export const verifyOtpSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid userId",
      "string.empty": "UserId is required",
    }),

  otp: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.pattern.base": "OTP must be exactly 6 digits",
      "string.empty": "OTP is required",
    }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),
});

export const loginSchema = Joi.object({
  emailOrMobile: Joi.string()
    .required()
    .custom((value: any, helpers: any) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobileRegex = /^[6-9]\d{9}$/;

      if (!emailRegex.test(value) && !mobileRegex.test(value)) {
        return helpers.message(
          "Must be a valid email or 10-digit mobile number",
        );
      }

      return value;
    }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),
});
export const forgotPasswordSchema = Joi.object({
  emailOrMobile: Joi.string()
    .required()
    .custom((value: any, helpers: any) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobileRegex = /^[6-9]\d{9}$/;

      if (!emailRegex.test(value) && !mobileRegex.test(value)) {
        return helpers.message(
          "Must be a valid email or 10-digit mobile number"
        );
      }

      return value;
    })
    .messages({
      "string.empty": "Email or mobile is required",
    }),
});

export const confirmPasswordSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid userId",
      "string.empty": "UserId is required",
    }),

  otp: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.pattern.base": "OTP must be exactly 6 digits",
      "string.empty": "OTP is required",
    }),

  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.empty": "New password is required",
    }),
});

export const resetPasswordSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[a-fA-F0-9]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid userId",
      "string.empty": "UserId is required",
    }),

  oldPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Old password must be at least 6 characters",
      "string.empty": "Old password is required",
    }),

  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "New password must be at least 6 characters",
      "string.empty": "New password is required",
    }),
});

export const adminChangePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Current password must be at least 6 characters",
      "string.empty": "Current password is required",
    }),

  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "New password must be at least 6 characters",
      "string.empty": "New password is required",
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm password must match new password",
      "string.empty": "Confirm password is required",
    }),
});