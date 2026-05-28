export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  MR: "MR",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];