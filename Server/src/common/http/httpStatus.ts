export const HttpStatusCodeMap: Record<number, string> = {
  200: "OK",
  201: "CREATED",
  202: "ACCEPTED",
  204: "NO_CONTENT",
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "UNPROCESSABLE_ENTITY",
  429: "TOO_MANY_REQUESTS",
  500: "INTERNAL_SERVER_ERROR",
  502: "BAD_GATEWAY",
  503: "SERVICE_UNAVAILABLE",
  504: "GATEWAY_TIMEOUT",
};

export const getStatusLabel = (statusCode: number): string => {
  return HttpStatusCodeMap[statusCode] || "UNKNOWN_STATUS";
};