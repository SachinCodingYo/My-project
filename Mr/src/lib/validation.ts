import { z } from "zod";

// Profile Validation
export const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must not exceed 50 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters"),
  mobile: z
    .string()
    .regex(/^[0-9]{10}$/, "Mobile must be 10 digits")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Password Change Validation
export const passwordChangeSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .regex(/[a-z]/, "Must contain lowercase letters")
      .regex(/[A-Z]/, "Must contain uppercase letters")
      .regex(/[0-9]/, "Must contain numbers"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from old password",
    path: ["newPassword"],
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

// Login Validation
export const loginSchema = z.object({
  emailOrMobile: z
    .string()
    .min(1, "Email or mobile is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
