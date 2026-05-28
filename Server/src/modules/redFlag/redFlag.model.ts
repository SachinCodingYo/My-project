/**
 * @author Aman kumar singh
 * @description
 */
import mongoose, { Schema } from "mongoose";

const redFlagSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    remarks: { type: String, required: true },
    flaggedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Admin ID
    isActive: { type: Boolean, default: true},
}, { timestamps: true });

export const RedFlagModel = mongoose.model("RedFlag", redFlagSchema);