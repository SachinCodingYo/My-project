/**
 * @author Aman kumar singh
 * @description KYC Service
 */

import mongoose from "mongoose";
import Kyc from "./kyc.model";

import {
  generateAadhaarOtp,
  verifyAadhaarOtp,
  verifyPanApi,
  verifyBankApi,
} from "../../../common/external/cashfree.service";

import { KYC_STATUS } from "./kyc.constants";

import { buildCursorFilter, buildCursorPaginationResponse } from "../../../common/utils/pagination.util";

import { decodeCursor } from "../../../config/pagination.config";
import { UserModel } from "../../auth/auth.model";

class KycService {
 
  private normalizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[^a-z ]/g, "")
      .trim();
  }
  private isNameMatched(aadhaarName: string, otherName: string): boolean {
    const aadhaar = this.normalizeName(aadhaarName);

    const other = this.normalizeName(otherName);

    if (!aadhaar || !other) {
      return false;
    }

    // EXACT MATCH
    if (aadhaar === other) {
      return true;
    }

    const aadhaarWords = aadhaar.split(" ");

    const otherWords = other.split(" ");

    const matchedWords = aadhaarWords.filter((word) => otherWords.includes(word));

    return matchedWords.length >= Math.min(aadhaarWords.length, otherWords.length) - 1;
  }

  private async getOrCreateKyc(userId: string) {
    let kyc = await Kyc.findOne({ userId });

    if (!kyc) {
      kyc = await Kyc.create({
        userId,
        status: KYC_STATUS.NOT_SUBMITTED,
      });
    }

    return kyc;
  }

  private checkFinalKyc(kyc: any) {
    if (kyc.aadhaarVerified && kyc.panVerified && kyc.bankVerified && kyc.videoKycStatus === "verified") {
      kyc.status = KYC_STATUS.PENDING;

      kyc.isKycVerified = false;
    }
  }
  async sendAadhaarOtp(userId: string, aadhaar: string) {
    // VALIDATION
    if (!/^\d{12}$/.test(aadhaar)) {
      throw new Error("Invalid Aadhaar number");
    }

    const existingAadhaar = await Kyc.findOne({
      aadhaarNumber: aadhaar,
      userId: { $ne: userId },
    });

    if (existingAadhaar) {
      throw new Error("Aadhaar already used");
    }

    const kyc = await this.getOrCreateKyc(userId);

    if (kyc.status === KYC_STATUS.APPROVED || kyc.status === KYC_STATUS.REJECTED) {
      throw new Error("KYC already completed");
    }

    const result = await generateAadhaarOtp(aadhaar);

    const refId = result?.ref_id || result?.reference_id;

    if (!refId) {
      throw new Error(result?.message || "OTP failed");
    }

    kyc.aadhaarNumber = aadhaar;

    kyc.aadhaarRefId = refId;

    kyc.status = KYC_STATUS.INITIATED;

    await kyc.save();

    return {
      message: "OTP sent",
      refId,
    };
  }

  async resendAadhaarOtp(userId: string, aadhaar: string) {
    if (!/^\d{12}$/.test(aadhaar)) {
      throw new Error("Invalid Aadhaar number");
    }

    const kyc = await this.getOrCreateKyc(userId);

    if (kyc.status === KYC_STATUS.APPROVED || kyc.status === KYC_STATUS.REJECTED) {
      throw new Error("KYC already completed");
    }

    const result = await generateAadhaarOtp(aadhaar);

    const refId = result?.ref_id || result?.reference_id;

    if (!refId) {
      throw new Error(result?.message || "OTP resend failed");
    }

    kyc.aadhaarNumber = aadhaar;

    kyc.aadhaarRefId = refId;

    kyc.status = KYC_STATUS.INITIATED;

    await kyc.save();

    return {
      message: "OTP resent successfully",
      refId,
    };
  }

  async verifyAadhaarOtp(userId: string, refId: string, otp: string) {
    if (!refId) {
      throw new Error("Reference ID required");
    }

    if (!/^\d{6}$/.test(otp)) {
      throw new Error("Invalid OTP");
    }

    const kyc = await this.getOrCreateKyc(userId);

    if (kyc.status === KYC_STATUS.APPROVED || kyc.status === KYC_STATUS.REJECTED) {
      throw new Error("KYC already completed");
    }

    const result = await verifyAadhaarOtp(refId, otp);

    if (!result || result?.status === "ERROR") {
      throw new Error(result?.message || "Invalid OTP");
    }

    kyc.aadhaarHolderName = result?.name || result?.full_name || result?.user_name || "";

    kyc.aadhaarVerified = true;

    kyc.status = KYC_STATUS.AADHAAR_VERIFIED;

    await kyc.save();

    return {
      message: "Aadhaar verified",

      aadhaarHolderName: kyc.aadhaarHolderName,
    };
  }

  async verifyPan(userId: string, pan: string) {
    // VALIDATION
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
      throw new Error("Invalid PAN format");
    }
    const existingPan = await Kyc.findOne({
      panNumber: pan,
      userId: { $ne: userId },
    });

    if (existingPan) {
      throw new Error("PAN already used");
    }

    const kyc = await this.getOrCreateKyc(userId);

    if (kyc.status === KYC_STATUS.APPROVED || kyc.status === KYC_STATUS.REJECTED) {
      throw new Error("KYC already completed");
    }

    if (!kyc.aadhaarVerified) {
      throw new Error("Complete Aadhaar first");
    }

    const result = await verifyPanApi(pan, kyc.aadhaarHolderName || "");

    if (!result?.valid && result?.status !== "SUCCESS") {
      throw new Error("PAN verification failed");
    }

    const panHolderName = result?.registered_name || result?.full_name || result?.name || "";

    const isMatched = this.isNameMatched(kyc.aadhaarHolderName || "", panHolderName);

    if (!isMatched) {
      throw new Error("PAN holder name does not match Aadhaar");
    }

    kyc.panNumber = pan;

    kyc.panHolderName = panHolderName;

    // if (!kyc.fullname) {
    //   kyc.fullname = panHolderName;
    // }
    kyc.fullname = panHolderName;

    kyc.panVerified = true;
       // GET USER ROLE
    const user: any =
      await UserModel.findById(
        userId
      );

    // USER FLOW
  
    if (user?.role === "USER") {

      // DIRECT APPROVED
      kyc.status =
        KYC_STATUS.APPROVED;

      kyc.isKycVerified = true;

      kyc.verifiedAt =
        new Date();

    } else {

      
      // MR FLOW

      kyc.status =
        KYC_STATUS.PAN_VERIFIED;
    }

    await kyc.save();

    return {
      message:
        user?.role === "USER"
          ? "KYC completed successfully"
          : "PAN verified successfully",

      status: kyc.status,

      isKycVerified:
        kyc.isKycVerified,

      fullname:
        kyc.fullname,

      panHolderName:
        kyc.panHolderName,
    };
  }

  //   kyc.status = KYC_STATUS.PAN_VERIFIED;

  //   await kyc.save();

  //   return {
  //     message: "PAN verified",

  //     panHolderName: kyc.panHolderName,

  //     fullname: kyc.fullname,
  //   };
  // }


  async verifyBank(userId: string, account: string, ifsc: string, phone: string) {
      //  GET USER
    const user: any =
      await UserModel.findById(
        userId
      );

    // USER NOT ALLOWED
    if (user?.role === "USER") {

      throw new Error(
        "Bank verification not required for USER"
      );
    }

    const kyc = await this.getOrCreateKyc(userId);

    if (kyc.status === KYC_STATUS.APPROVED || kyc.status === KYC_STATUS.REJECTED) {
      throw new Error("KYC already completed");
    }

    if (!kyc.panVerified) {
      throw new Error("Complete PAN first");
    }
    if (!/^\d{9,18}$/.test(account)) {
      throw new Error("Invalid bank account number");
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      throw new Error("Invalid IFSC code");
    }

    const existingBank = await Kyc.findOne({
      bankAccountNumber: account,
      userId: { $ne: userId },
    });

    if (existingBank) {
      throw new Error("Bank account already used");
    }

    const finalPhone = phone && phone.trim() !== "" ? phone : "9999999999";

    try {
      const result = await verifyBankApi(account, ifsc, kyc.aadhaarHolderName || "", finalPhone);

      if (result?.account_status !== "VALID") {
        throw new Error(result?.message || "Bank verification failed");
      }

      const bankHolderName = result?.account_holder_name || result?.name_at_bank || result?.full_name || "";

      const isMatched = this.isNameMatched(kyc.aadhaarHolderName || "", bankHolderName);

      if (!isMatched) {
        throw new Error("Bank holder name does not match Aadhaar");
      }

      kyc.bankVerified = true;

      kyc.bankAccountNumber = account;

      kyc.ifscCode = ifsc;

      kyc.bankHolderName = bankHolderName;

      if (!kyc.fullname) {
        kyc.fullname = bankHolderName;
      }

      kyc.status = KYC_STATUS.BANK_VERIFIED;

      await kyc.save();

      return {
        message: "Bank verified successfully",

        bankHolderName: kyc.bankHolderName,

        fullname: kyc.fullname,
      };
    } catch (error: any) {
      throw new Error(error.message || "Bank verification failed");
    }
  }


  async uploadVideo(userId: string, videoUrl: string) {
       //  GET USER
    const user: any =
      await UserModel.findById(
        userId
      );

    //  USER NOT ALLOWED
    if (user?.role === "USER") {

      throw new Error(
        "Video KYC not required for USER"
      );
    }

    if (!videoUrl) {
      throw new Error("Video URL required");
    }

    if (!videoUrl.startsWith("http")) {
      throw new Error("Invalid video URL");
    }

    const kyc = await this.getOrCreateKyc(userId);

    if (kyc.status === KYC_STATUS.APPROVED || kyc.status === KYC_STATUS.REJECTED) {
      throw new Error("KYC already completed");
    }

    if (!kyc.bankVerified) {
      throw new Error("Complete bank verification first");
    }

    kyc.kycVideo = videoUrl;

    kyc.videoKycStatus = "pending";

    kyc.isVideoVerified = false;

    kyc.status = KYC_STATUS.VIDEO_UPLOADED;

    kyc.videoUploadedAt = new Date();

    await kyc.save();

    return {
      message: "Video uploaded successfully",

      data: kyc,
    };
  }


  async approveVideoKyc(adminId: string, kycId: string) {
    const kyc = await Kyc.findById(kycId);

    if (!kyc) {
      throw new Error("KYC not found");
    }

    kyc.isVideoVerified = true;

    kyc.videoKycStatus = "verified";

    kyc.videoReviewedBy = new mongoose.Types.ObjectId(adminId);

    kyc.videoReviewedAt = new Date();

    this.checkFinalKyc(kyc);

    await kyc.save();

    return {
      message: "Video KYC approved",
    };
  }


  async rejectVideoKyc(adminId: string, kycId: string, reason: string) {
    if (!reason?.trim()) {
      throw new Error("Rejection reason required");
    }

    const kyc = await Kyc.findById(kycId);

    if (!kyc) {
      throw new Error("KYC not found");
    }

    kyc.isVideoVerified = false;

    kyc.videoKycStatus = "failed";

    kyc.videoReviewedBy = new mongoose.Types.ObjectId(adminId);

    kyc.videoReviewedAt = new Date();

    kyc.rejectionReason = reason;

    await kyc.save();

    return {
      message: "Video KYC rejected",
    };
  }


  async getAllKyc(limit = 10, cursor?: string) {
    const filters: any = {
      $or: [
        {
          videoKycStatus: "pending",
        },
        {
          status: KYC_STATUS.PENDING,
        },
      ],
    };

    if (cursor) {
      const decoded = decodeCursor(cursor);

      Object.assign(filters, buildCursorFilter(decoded));
    }

    const kycs = await Kyc.find(filters)
      .populate("userId", "fullName email phone")
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .limit(limit + 1);

    const maskedKycs = kycs.map((kyc: any) => {
      const obj = kyc.toObject();

      if (obj.aadhaarNumber) {
        obj.aadhaarNumber = "XXXXXXXX" + obj.aadhaarNumber.slice(-4);
      }

      if (obj.bankAccountNumber) {
        obj.bankAccountNumber = "XXXXXX" + obj.bankAccountNumber.slice(-4);
      }

      // return obj;
      return {
  ...obj,

  panHolderName:
    obj.panHolderName || "",

  aadhaarHolderName:
    obj.aadhaarHolderName || "",

  bankHolderName:
    obj.bankHolderName || "",
};
    });

    return buildCursorPaginationResponse(maskedKycs, limit);
  }


  async getKycByUser(userId: string) {
    const kyc = await this.getOrCreateKyc(userId);

    const obj = kyc.toObject();

    if (obj.aadhaarNumber) {
      obj.aadhaarNumber = "XXXXXXXX" + obj.aadhaarNumber.slice(-4);
    }

    if (obj.bankAccountNumber) {
      obj.bankAccountNumber = "XXXXXX" + obj.bankAccountNumber.slice(-4);
    }

    // return obj;
    return {
  ...obj,

  panHolderName:
    obj.panHolderName || "",

  aadhaarHolderName:
    obj.aadhaarHolderName || "",

  bankHolderName:
    obj.bankHolderName || "",
};

  }

  async approveKyc(adminId: string, kycId: string) {
    const kyc = await Kyc.findById(kycId);

    if (!kyc) {
      throw new Error("KYC not found");
    }

    if (!kyc.aadhaarVerified || !kyc.panVerified || !kyc.bankVerified || kyc.videoKycStatus !== "verified") {
      throw new Error("KYC steps incomplete");
    }

    if (kyc.status !== KYC_STATUS.VIDEO_UPLOADED && kyc.status !== KYC_STATUS.PENDING) {
      throw new Error("Not in pending state");
    }

    kyc.status = KYC_STATUS.APPROVED;

    kyc.isKycVerified = true;

    kyc.verifiedBy = new mongoose.Types.ObjectId(adminId);

    kyc.verifiedAt = new Date();

    await kyc.save();

    return {
      message: "KYC approved",
    };
  }

  async rejectKyc(adminId: string, kycId: string, reason: string) {
    if (!reason?.trim()) {
      throw new Error("Rejection reason required");
    }

    const kyc = await Kyc.findById(kycId);

    if (!kyc) {
      throw new Error("KYC not found");
    }

    if (kyc.status !== KYC_STATUS.VIDEO_UPLOADED && kyc.status !== KYC_STATUS.PENDING) {
      throw new Error("Not in pending state");
    }

    kyc.status = KYC_STATUS.REJECTED;

    kyc.rejectionReason = reason;

    kyc.verifiedBy = new mongoose.Types.ObjectId(adminId);

    kyc.verifiedAt = new Date();

    await kyc.save();

    return {
      message: "KYC rejected",
    };
  }
}

export default new KycService();
