/**
 * @author Aman kumar singh
 * @description
 */
export const KYC_STATUS = {
  NOT_SUBMITTED: "not_submitted",
  INITIATED: "initiated",
  AADHAAR_VERIFIED: "aadhaar_verified",
  PAN_VERIFIED: "pan_verified",
  BANK_VERIFIED: "bank_verified",
  VIDEO_UPLOADED: "video_uploaded",
  VIDEO_PENDING: "video_pending",
  VIDEO_VERIFIED: "video_verified",
  VIDEO_REJECTED: "video_rejected",
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;