import type { CursorResponse } from "../common/types/types";

export const extractCursorData = <T>(res: CursorResponse<T>) => {
  return {
    list: res?.data?.results || [],
    nextCursor: res?.data?.nextCursor || null,
    hasMore: res?.data?.hasMore || false,
  };
};