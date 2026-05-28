/**
 * Support Ticket Model
 * Author: Aman Kumar Singh
 */
import mongoose, { Schema } from "mongoose";

export interface ISupportTicket extends Document {
    title: string;
    description: string;
    createdBy: mongoose.Types.ObjectId;
    assignedTo? : mongoose.Types.ObjectId;
    status: "OPEN" | "IN_PROGRESS" | "CLOSED";
    replies: {
        message:string;
        repliedBy: mongoose.Types.ObjectId;
        createdAt: Date;
    } [];
}
const supportTicketSchema = new Schema<ISupportTicket> (
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type:String,
            required: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
           ref: "User",
    },
    status: {
        type: String,
        enum: ["OPEN", "IN_PROGRESS", "CLOSED"],
        default: "OPEN"
    },
    replies: [
        {
            message: String,
            repliedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            createdAt: {
                type: Date,
                default: Date.now
            },

        },
    ],

    },

    { timestamps: true }
);
export const SupportTicketModel = mongoose.model<ISupportTicket>("SupportTicket", supportTicketSchema);