/**
 * Cursor Pagination Helper
 * Author: Aman Kumar Singh
 */
import { encodeCursor } from "../../config/pagination.config";

export const buildCursorFilter = (
  decoded: { createdAt: Date | string; _id: string },
  fields = {
    createdAtField: "createdAt",
    idField: "_id",
  },
) => {
  return {
    $or: [
      { [fields.createdAtField]: { $lt: decoded.createdAt } },
      {
        [fields.createdAtField]: decoded.createdAt,
        [fields.idField]: { $lt: decoded._id },
      },
    ],
  };
};

export const buildCursorPaginationResponse = <T>(
  data: T[],
  limit: number,
  cursorFields = {
    createdAtField: "createdAt",
    idField: "_id",
  },
) => {
  // const hasMore = data.length === limit;
  // console.log(data.length);
  // console.log(limit);
  const hasMore = data.length > limit;
  let nextCursor: string | null = null;
  if (hasMore && data.length > 0) {
    const last: any = data[data.length - 1];

    nextCursor = encodeCursor({
      createdAt: last[cursorFields.createdAtField],
      _id: last[cursorFields.idField].toString(),
    });
  }

  return {
    results: data,
    nextCursor,
    hasMore,
  };
};
