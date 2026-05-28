export const PAGINATION_CONFIG = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 200,
  DEFAULT_SORT: -1,
};

export const encodeCursor = (data: { createdAt: Date; _id: string }) => {
  const cursorObj = {
    createdAt: data.createdAt,
    _id: data._id,
  };
  return Buffer.from(JSON.stringify(cursorObj)).toString("base64");
};

export const decodeCursor = (cursor: string) => {
  try {
    const decoded = Buffer.from(cursor, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch (error) {
    throw new Error("Invalid cursor format");
  }
};
