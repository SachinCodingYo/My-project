/**
 * Module: User Constants
 * Description: Defines user roles and pagination limits for the application
 * Author: Aman Kumar Singh
 */
// users/user.constants.ts

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export const DEFAULT_PAGE_LIMIT = 10; //user acces data without page limi
export const MAX_PAGE_LIMIT = 100; 